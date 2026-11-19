import React, { useEffect, useRef, useState } from "react";

import Chip from "@/components/UI/Chip";
import type { CameraViewProps, Detection } from "@/types";
import {
  getGrayFromImageData,
  meanBrightness,
  bboxFromMask,
  createZoomedDataURLFromCanvas,
} from "@/utils/frames";
import playBeep from "@/utils/play-beep";

import Card from "../UI/Card";

// Processing configuration
const PROCESS_FPS = 10;
const ALPHA_BG = 0.02;
const EMA_ALPHA = 0.05;
const SENSITIVITY_FACTOR = 1.8;
const PAUSE_AFTER_DETECTION_MS = 3000;
const MOTION_CONFIRM_FRAMES = 2;

type Props = CameraViewProps & {
  resetBgSignal?: number;
  triggerResetBackground?: () => void;
  onPauseChange?: (paused: boolean, remainingMs?: number) => void;
};

const CameraView: React.FC<Props> = ({
  onDetection,
  enabled,
  resetBgSignal = 0,
  onPauseChange,
  triggerResetBackground,
}) => {
  // DOM refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Algorithm state
  const bgRef = useRef<Uint8ClampedArray | null>(null);
  const prevGrayRef = useRef<Uint8ClampedArray | null>(null);
  const emaAvgDiffRef = useRef(0);
  const emaMeanDiffRef = useRef(0);
  const motionCounterRef = useRef(0);
  const foregroundMaskRef = useRef<Uint8Array | null>(null);
  const maskExpiryRef = useRef(0);

  // Processing loop state
  const runningRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastProcessTimeRef = useRef(0);

  // Pause state
  const isPausedRef = useRef(false);
  const pauseTimeoutRef = useRef<number | null>(null);
  const pauseIntervalRef = useRef<number | null>(null);
  const pauseEndRef = useRef(0);

  // UI state
  const [initialBgDataUrl, setInitialBgDataUrl] = useState<string | null>(null);
  const lastResetSignalRef = useRef(resetBgSignal);

  // Initialize camera on mount
  useEffect(() => {
    let mounted = true;

    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (!mounted) return;

        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        await video.play();

        video.addEventListener("loadedmetadata", () => {
          const width = video.videoWidth || 640;
          const height = video.videoHeight || 480;

          if (canvasRef.current) {
            canvasRef.current.width = width;
            canvasRef.current.height = height;
          }
          if (captureCanvasRef.current) {
            captureCanvasRef.current.width = width;
            captureCanvasRef.current.height = height;
          }
        });
      } catch (error) {
        console.error("Camera access error:", error);
      }
    }

    initCamera();

    return () => {
      mounted = false;
      stopProcessing();
      stopCameraStream();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Start/stop processing when enabled changes
  useEffect(() => {
    if (enabled) {
      startProcessing();
    } else {
      stopProcessing();
    }
  }, [enabled]);

  // Handle reset background signal
  useEffect(() => {
    if (resetBgSignal !== lastResetSignalRef.current) {
      lastResetSignalRef.current = resetBgSignal;
      resetBackground();
    }
  }, [resetBgSignal]);

  function stopCameraStream() {
    const video = videoRef.current;
    if (video?.srcObject) {
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
  }

  function startProcessing() {
    if (runningRef.current) return;
    runningRef.current = true;
    lastProcessTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
  }

  function stopProcessing() {
    runningRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    clearPauseTimers();
  }

  function loop(now: number) {
    if (!runningRef.current) return;

    const elapsed = now - lastProcessTimeRef.current;
    const interval = 1000 / PROCESS_FPS;

    if (elapsed >= interval) {
      processFrame();
      lastProcessTimeRef.current = now;
    }

    rafRef.current = requestAnimationFrame(loop);
  }

  function updateEMA(emaRef: React.MutableRefObject<number>, newValue: number) {
    if (emaRef.current === 0) {
      emaRef.current = newValue;
    } else {
      emaRef.current = emaRef.current * (1 - EMA_ALPHA) + newValue * EMA_ALPHA;
    }
    return emaRef.current;
  }

  function convertGrayToCanvas(
    gray: Uint8ClampedArray,
    width: number,
    height: number,
    canvas: HTMLCanvasElement | null
  ) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.createImageData(width, height);
    let idx = 0;
    for (let i = 0; i < gray.length; i++) {
      const value = gray[i];
      imageData.data[idx++] = value;
      imageData.data[idx++] = value;
      imageData.data[idx++] = value;
      imageData.data[idx++] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  function clearPauseTimers() {
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
    if (pauseIntervalRef.current) {
      clearInterval(pauseIntervalRef.current);
      pauseIntervalRef.current = null;
    }
    isPausedRef.current = false;
    pauseEndRef.current = 0;
    onPauseChange?.(false);
  }

  function startPause(duration: number) {
    isPausedRef.current = true;
    pauseEndRef.current = Date.now() + duration;

    onPauseChange?.(true, duration);

    pauseIntervalRef.current = window.setInterval(() => {
      const remaining = Math.max(0, pauseEndRef.current - Date.now());
      onPauseChange?.(true, remaining);
    }, 200);

    pauseTimeoutRef.current = window.setTimeout(() => {
      clearPauseTimers();
    }, duration);
  }

  function resetBackground() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const currentGray = getGrayFromImageData(frame);

    bgRef.current = new Uint8ClampedArray(currentGray);
    foregroundMaskRef.current = null;
    maskExpiryRef.current = 0;
    prevGrayRef.current = null;

    if (captureCanvasRef.current) {
      convertGrayToCanvas(
        currentGray,
        canvas.width,
        canvas.height,
        captureCanvasRef.current
      );
      setInitialBgDataUrl(captureCanvasRef.current.toDataURL("image/png"));
    }
  }

  function processFrame() {
    if (isPausedRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.paused || video.ended) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    if (!width || !height) return;

    // Get current frame
    ctx.drawImage(video, 0, 0, width, height);
    const frameData = ctx.getImageData(0, 0, width, height);
    const currentGray = getGrayFromImageData(frameData);

    // Calculate brightness statistics
    const currentMean = meanBrightness(currentGray);
    const previousGray = prevGrayRef.current;
    const previousMean = previousGray
      ? meanBrightness(previousGray)
      : currentMean;
    const meanDiff = Math.abs(currentMean - previousMean);

    // Initialize background if needed
    if (!bgRef.current) {
      bgRef.current = new Uint8ClampedArray(currentGray);
      if (!initialBgDataUrl && captureCanvasRef.current) {
        convertGrayToCanvas(
          bgRef.current,
          width,
          height,
          captureCanvasRef.current
        );
        setInitialBgDataUrl(captureCanvasRef.current.toDataURL("image/png"));
      }
    }

    const background = bgRef.current;
    const totalPixels = currentGray.length;

    // Calculate average absolute difference from background
    let sumAbsDiff = 0;
    for (let i = 0; i < totalPixels; i++) {
      sumAbsDiff += Math.abs(currentGray[i] - background[i]);
    }
    const avgAbsDiff = sumAbsDiff / totalPixels;

    // Update exponential moving averages
    const emaAvg = updateEMA(emaAvgDiffRef, avgAbsDiff);
    const emaMean = updateEMA(emaMeanDiffRef, meanDiff);

    // Calculate adaptive thresholds
    const pixelThreshold = Math.max(8, Math.round(emaAvg * 2.5));
    const sensitivityRatio = Math.min(
      0.2,
      Math.max(
        0.002,
        SENSITIVITY_FACTOR * (emaAvg / (emaAvg + 1)) * 0.01 + 0.005
      )
    );
    const suddenLightThreshold = Math.max(
      12,
      Math.round(Math.max(emaMean * 3, emaMean + 20))
    );

    // Create binary mask
    const mask = new Uint8Array(totalPixels);
    let changedPixels = 0;

    for (let i = 0; i < totalPixels; i++) {
      const diff = Math.abs(currentGray[i] - background[i]);
      if (diff > pixelThreshold) {
        mask[i] = 1;
        changedPixels++;
      }
    }

    const changeRatio = changedPixels / totalPixels;

    // Detect motion and sudden light changes
    const suddenLight = meanDiff > suddenLightThreshold;
    const motionDetected = changeRatio > sensitivityRatio;

    if (motionDetected) {
      motionCounterRef.current++;
    } else {
      motionCounterRef.current = 0;
    }

    const motionConfirmed = motionCounterRef.current >= MOTION_CONFIRM_FRAMES;
    const shouldTrigger = suddenLight || motionConfirmed;

    if (shouldTrigger) {
      // Prepare detection images
      const beforeGray = prevGrayRef.current || currentGray;

      convertGrayToCanvas(beforeGray, width, height, captureCanvasRef.current);
      const beforeDataUrl =
        captureCanvasRef.current?.toDataURL("image/png") ?? "";

      convertGrayToCanvas(currentGray, width, height, captureCanvasRef.current);
      const afterDataUrl =
        captureCanvasRef.current?.toDataURL("image/png") ?? "";

      convertGrayToCanvas(background, width, height, captureCanvasRef.current);
      const backgroundDataUrl =
        captureCanvasRef.current?.toDataURL("image/png") ?? "";

      const bbox = bboxFromMask(mask, width, height);
      const markedDataUrl = createZoomedDataURLFromCanvas(
        captureCanvasRef.current,
        bbox,
        240,
        160
      );

      const detection: Detection = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        suddenLight,
        motion: motionConfirmed,
        ratio: changeRatio,
        meanDiff,
        before: beforeDataUrl,
        after: afterDataUrl,
        background: backgroundDataUrl,
        marked: markedDataUrl,
        bbox: bbox ?? undefined,
      };

      onDetection(detection);

      try {
        playBeep();
      } catch (error) {
        console.warn("Beep failed:", error);
      }

      foregroundMaskRef.current = mask;
      maskExpiryRef.current = Date.now() + PAUSE_AFTER_DETECTION_MS;
      startPause(PAUSE_AFTER_DETECTION_MS);
    }

    // Update background (skip masked pixels during pause)
    const activeMask = foregroundMaskRef.current;
    const maskActive = activeMask && Date.now() < maskExpiryRef.current;

    if (maskActive) {
      for (let i = 0; i < totalPixels; i++) {
        if (!activeMask[i]) {
          background[i] = Math.round(
            (1 - ALPHA_BG) * background[i] + ALPHA_BG * currentGray[i]
          );
        }
      }
    } else {
      for (let i = 0; i < totalPixels; i++) {
        background[i] = Math.round(
          (1 - ALPHA_BG) * background[i] + ALPHA_BG * currentGray[i]
        );
      }
      foregroundMaskRef.current = null;
    }

    prevGrayRef.current = currentGray;
  }

  return (
    <section
      aria-label="Camera Canvas"
      className="grid gap-5 lg:grid-cols-[1fr_280px]"
    >
      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
        <div className="bg-card/70 flex items-center justify-between border-b border-white/8 px-4 py-3">
          <span className="text-sm font-semibold">Live camera preview</span>
          <span className="text-secondary rounded border border-white/8 bg-black/20 px-2.5 py-1 text-xs font-medium">
            {enabled ? "Detecting" : "Preview"}
          </span>
        </div>
        <video
          ref={videoRef}
          muted
          playsInline
          className="aspect-video w-full bg-black object-cover"
        />
        <div className="bg-card/40 text-secondary flex items-center justify-between gap-3 border-t border-white/8 px-4 py-3 text-xs">
          <span>Video stays on this device</span>
          <span className="font-medium text-slate-400">
            {PROCESS_FPS} FPS analysis
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <Card className="m-0" ariaLabel="info-box">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                Detection engine
              </p>
              <p className="text-secondary mt-0.5 text-xs">
                Live processing status
              </p>
            </div>
            <span
              className={`rounded px-2.5 py-1 text-xs font-medium ${enabled ? "bg-emerald-400/10 text-emerald-300" : "bg-slate-500/10 text-slate-400"}`}
            >
              {enabled ? "Online" : "Standby"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-bg/50 rounded-md p-3">
              <span className="text-secondary block text-xs">Frame rate</span>
              <strong className="mt-1 block text-sm">{PROCESS_FPS} FPS</strong>
            </div>
            <div className="bg-bg/50 rounded-md p-3">
              <span className="text-secondary block text-xs">Pause</span>
              <strong className="mt-1 block text-sm">
                {PAUSE_AFTER_DETECTION_MS / 1000}s
              </strong>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip className="bg-cyan-400/10 text-cyan-300">
              BG α {ALPHA_BG}
            </Chip>
            <Chip className="bg-violet-400/10 text-violet-300">
              EMA α {EMA_ALPHA}
            </Chip>
          </div>
        </Card>

        <Card className="m-0 flex-1" ariaLabel="Reference background">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Reference frame</p>
              <p className="text-secondary mt-0.5 text-xs">
                Used to compare motion
              </p>
            </div>
            <button
              type="button"
              onClick={triggerResetBackground}
              className="focus-visible:ring-primary/50 cursor-pointer rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:outline-none"
            >
              Reset
            </button>
          </div>
          {initialBgDataUrl ? (
            <img
              src={initialBgDataUrl}
              alt="initial background"
              className="aspect-video w-full rounded-md border border-white/8 bg-black/30 object-cover"
            />
          ) : (
            <div className="bg-bg/40 grid aspect-video w-full place-items-center rounded-md border border-dashed border-white/10 text-xs text-slate-500">
              Waiting for camera…
            </div>
          )}
        </Card>
      </div>

      <div className="hidden">
        <canvas ref={canvasRef} />
        <canvas ref={captureCanvasRef} />
      </div>
    </section>
  );
};

export default CameraView;
