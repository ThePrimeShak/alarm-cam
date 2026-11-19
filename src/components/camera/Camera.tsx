import React, { useEffect, useRef, useState } from "react";

import CameraView from "@/components/camera/CameraView";
import DetectionList from "@/components/camera/DetectionList";
import Button from "@/components/UI/Button";
import Checkbox from "@/components/UI/Checkbox";
import type { Detection } from "@/types";
import {
  addDetectionToDB,
  getAllDetectionsFromDB,
  clearDetectionsInDB,
  type StoredDetection,
  exportAllDetections,
} from "@/utils/idb";
import { startToastTimer } from "@/utils/toast-timer";

const ENABLE_COUNTDOWN_SECONDS = 5;
const RESET_BG_COUNTDOWN_SECONDS = 5;
const MAX_DETECTIONS_IN_MEMORY = 1000;

const Camera: React.FC = () => {
  const [enableRequested, setEnableRequested] = useState(false);
  const [isAlarmEnabled, setIsAlarmEnabled] = useState(false);

  const [saveToStorage, setSaveToStorage] = useState(false);
  const [loadingResetBtn, setLoadingResetBtn] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);

  // Background reset state
  const [resetBgSignal, setResetBgSignal] = useState(0);
  const pauseToastShownRef = useRef(false);
  const enableRequestRef = useRef(0);

  useEffect(() => {
    loadDetections();
  }, []);

  const loadDetections = async () => {
    try {
      const all = await getAllDetectionsFromDB();
      setDetections(all.reverse());
    } catch (error) {
      console.warn("Could not load detections from IndexedDB:", error);
    }
  };

  const handleDetection = async (detection: Detection) => {
    // Add to local state
    setDetections((prev) =>
      [detection, ...prev].slice(0, MAX_DETECTIONS_IN_MEMORY)
    );

    // Save to IndexedDB if enabled
    if (saveToStorage) {
      try {
        await addDetectionToDB({
          ...detection,
          background: detection.background ?? "",
          marked: detection.marked ?? "",
        } as StoredDetection);
      } catch (error) {
        console.warn("Failed to add detection to IndexedDB:", error);
      }
    }
  };

  const resetDetections = async () => {
    setLoadingResetBtn(true);
    setDetections([]);
    try {
      await clearDetectionsInDB();
    } catch (error) {
      console.warn("Failed to clear IndexedDB:", error);
    } finally {
      setLoadingResetBtn(false);
    }
  };

  const handleExport = async () => {
    try {
      const all = await exportAllDetections();
      const data = all.map(
        ({
          before: _before,
          after: _after,
          background: _background,
          marked: _marked,
          ...rest
        }) => rest
      );

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `alarmcam_export_${new Date().toISOString()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.warn("Export failed:", error);
    }
  };

  function triggerResetBackground() {
    const { taskPromise } = startToastTimer(
      RESET_BG_COUNTDOWN_SECONDS * 1000,
      "Background resetting in"
    );
    taskPromise.then(() => setResetBgSignal((prev) => prev + 1));
  }

  function handlePauseChange(paused: boolean, remainingMs?: number) {
    if (paused && remainingMs && !pauseToastShownRef.current) {
      pauseToastShownRef.current = true;
      startToastTimer(remainingMs, "Detection paused, resuming in");
    } else if (!paused) {
      pauseToastShownRef.current = false;
    }
  }

  const handleToggleDetection = (isChecked: boolean) => {
    const requestId = ++enableRequestRef.current;
    setEnableRequested(isChecked);

    if (isChecked) {
      const { taskPromise } = startToastTimer(
        ENABLE_COUNTDOWN_SECONDS * 1000,
        "Detection enabling in"
      );
      taskPromise.then(() => {
        if (enableRequestRef.current === requestId) setIsAlarmEnabled(true);
      });
    } else setIsAlarmEnabled(false);
  };

  return (
    <section className="container py-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-primary mb-2 text-sm font-medium">
              University Artificial Intelligence Course Project
            </p>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              Motion Detection Dashboard
            </h1>
            <p className="text-secondary mt-2 max-w-2xl text-sm leading-6">
              A browser-based demonstration of background subtraction, adaptive
              thresholds, and motion detection. Video processing stays on this
              device.
            </p>
          </div>

          <div className="bg-card/50 flex flex-col gap-3 rounded-lg border border-white/8 p-4 sm:flex-row sm:items-center sm:gap-5">
            <Checkbox
              className="font-medium"
              label="Enable Detection"
              name="enable-detection"
              checked={enableRequested}
              onChange={(isChecked) => handleToggleDetection(isChecked)}
            />

            <Checkbox
              className="font-medium"
              label="Save detections to storage"
              name="save-detections"
              checked={saveToStorage}
              onChange={(isChecked) => setSaveToStorage(isChecked)}
            />
          </div>
        </div>

        <CameraView
          onDetection={handleDetection}
          enabled={isAlarmEnabled}
          resetBgSignal={resetBgSignal}
          onPauseChange={handlePauseChange}
          saveToStorage={saveToStorage}
          triggerResetBackground={triggerResetBackground}
        />

        <div aria-label="Buttons of Detect Section" className="mt-6">
          <DetectionList detections={detections} />
          <div className="mt-4 flex flex-col-reverse items-stretch justify-end gap-3 sm:flex-row sm:items-center">
            <Button
              type="button"
              onClick={resetDetections}
              disabled={!detections.length}
              className="border-white/10 bg-white/5 text-slate-300 shadow-none hover:bg-white/10 hover:text-white"
              loading={loadingResetBtn}
            >
              Clear List
            </Button>

            <Button
              type="button"
              onClick={handleExport}
              disabled={!detections.length}
            >
              Export All
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Camera;
