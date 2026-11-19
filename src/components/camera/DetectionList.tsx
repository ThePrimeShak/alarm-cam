import type { Detection } from "@/types";

import Chip from "../UI/Chip";

interface Props {
  detections: Detection[];
}

const DetectionList: React.FC<Props> = ({ detections }) => {
  return (
    <section className="bg-card/50 overflow-hidden rounded-lg border border-white/10">
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3.5 sm:px-5">
        <div>
          <h2 className="text-sm font-semibold">Detection history</h2>
          <p className="text-secondary mt-0.5 text-xs">
            Most recent events appear first
          </p>
        </div>
        <span className="bg-bg/50 rounded border border-white/8 px-2.5 py-1 text-xs font-medium text-slate-300">
          {detections.length} {detections.length === 1 ? "event" : "events"}
        </span>
      </div>

      <div className="max-h-[520px] overflow-y-auto p-3 sm:p-4">
        {detections.length === 0 && (
          <div className="grid min-h-48 place-items-center text-center">
            <div>
              <p className="text-sm font-medium text-slate-300">
                No motion detected yet
              </p>
              <p className="text-secondary mt-1 text-xs">
                Enable detection to start monitoring.
              </p>
            </div>
          </div>
        )}
        <div className="space-y-3">
          {detections.map((detection) => (
            <div
              key={detection.id}
              className="bg-bg/35 flex flex-col gap-4 rounded-md border border-white/8 p-3.5 lg:flex-row lg:items-center"
            >
              <div className="w-full lg:max-w-[220px] lg:min-w-[220px]">
                <span className="block text-xs font-medium text-slate-300">
                  {new Date(detection.timestamp).toLocaleString()}
                </span>
                <div className="text-secondary mt-2.5 flex flex-wrap gap-1.5 text-sm">
                  {detection.motion && (
                    <Chip className="bg-rose-400/10 text-rose-300">Motion</Chip>
                  )}
                  {detection.suddenLight && (
                    <Chip className="bg-amber-400/10 text-amber-300">
                      Sudden light
                    </Chip>
                  )}
                  <Chip className="bg-white/5 text-slate-300">
                    Change {(detection.ratio * 100).toFixed(2)}%
                  </Chip>
                  <Chip className="bg-white/5 text-slate-300">
                    Diff {detection.meanDiff.toFixed(1)}
                  </Chip>
                  {detection.bbox && (
                    <Chip className="bg-white/5 text-slate-400">
                      Area {detection.bbox.w}×{detection.bbox.h}
                    </Chip>
                  )}
                </div>
              </div>

              <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  [detection.before, "Before"],
                  [detection.after, "After"],
                  [detection.background, "Reference"],
                  [detection.marked ?? detection.after, "Detected area"],
                ].map(([src, label]) => (
                  <figure
                    key={label}
                    className="overflow-hidden rounded-lg border border-white/8 bg-black/30"
                  >
                    <img
                      src={src}
                      alt={label}
                      className="aspect-video w-full object-cover"
                    />
                    <figcaption className="text-secondary px-2 py-1.5 text-center text-[10px] font-medium">
                      {label}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetectionList;
