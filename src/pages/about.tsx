import { GithubIcon } from "@/components/UI/Icons";

const features = [
  {
    title: "Adaptive motion detection",
    description:
      "Background subtraction and adaptive thresholds respond to environmental changes while reducing false alerts.",
  },
  {
    title: "Local video processing",
    description:
      "Frames are processed in the browser with Canvas. Camera footage is not sent to a remote server.",
  },
  {
    title: "Detection history",
    description:
      "Each event can include before, after, reference, and highlighted frames, with optional IndexedDB storage.",
  },
];

const specs = [
  ["Processing rate", "10 FPS"],
  ["Background learning rate", "0.02"],
  ["EMA smoothing", "0.05"],
  ["Motion confirmation", "2 frames"],
  ["Post-detection pause", "3 seconds"],
  ["Optional storage", "IndexedDB"],
];

const AboutPage = () => {
  return (
    <div id="about" className="container py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <header className="border-b border-white/10 pb-8">
          <p className="text-primary mb-2 text-sm font-medium">
            University Artificial Intelligence Course Project
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            About Camera Alarm
          </h1>
          <p className="text-secondary mt-4 max-w-3xl text-base leading-7">
            Camera Alarm is an educational real-time motion detection project
            built with React and TypeScript. It demonstrates how fundamental
            computer vision techniques can be applied to a live browser camera
            feed without a backend or cloud video processing.
          </p>
          <a
            href="https://github.com/ThePrimeShak/alarm-cam"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            <GithubIcon className="size-4" />
            View source code
          </a>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section aria-labelledby="learning-goals-title">
            <h2 id="learning-goals-title" className="text-xl font-semibold">
              Project goals
            </h2>
            <p className="text-secondary mt-3 text-sm leading-7">
              The project was created for a university Artificial Intelligence
              course to explore frame processing, background modelling,
              threshold-based classification, and practical handling of noisy
              real-world input.
            </p>

            <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
              {features.map((feature) => (
                <article key={feature.title} className="py-5">
                  <h3 className="font-medium text-white">{feature.title}</h3>
                  <p className="text-secondary mt-1.5 text-sm leading-6">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <aside className="bg-card/50 rounded-lg border border-white/10 p-5 sm:p-6">
            <h2 className="text-lg font-semibold">Detection parameters</h2>
            <p className="text-secondary mt-2 text-sm leading-6">
              The current values used by the browser processing loop.
            </p>
            <dl className="mt-5 divide-y divide-white/10">
              {specs.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 py-3 text-sm"
                >
                  <dt className="text-secondary">{label}</dt>
                  <dd className="font-medium text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <footer className="text-secondary mt-8 border-t border-white/10 pt-6 text-sm">
          Designed and developed by{" "}
          <a
            href="https://www.linkedin.com/in/theprimeshak/"
            target="_blank"
            rel="noreferrer"
            className="text-primary font-medium transition hover:text-teal-300"
          >
            ThePrimeShak
          </a>
          .
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;
