import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export const CameraIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M3.75 8.75A2.75 2.75 0 0 1 6.5 6h1.15l.72-1.32A1.75 1.75 0 0 1 9.9 3.75h4.2c.64 0 1.23.36 1.53.93L16.35 6h1.15a2.75 2.75 0 0 1 2.75 2.75v8.5A2.75 2.75 0 0 1 17.5 20h-11a2.75 2.75 0 0 1-2.75-2.75v-8.5Z"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

export const GithubIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 .7C5.65.7.5 5.85.5 12.2c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.23c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18A10.96 10.96 0 0 1 12 6.13c.98 0 1.94.13 2.86.39 2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.25c0 .31.21.67.79.56a11.51 11.51 0 0 0 7.87-10.91C23.5 5.85 18.35.7 12 .7Z" />
  </svg>
);

export const LinkedinIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M5.37 7.47H1.75V22h3.62V7.47ZM5.6 3.5A2.05 2.05 0 1 0 1.5 3.5a2.05 2.05 0 0 0 4.1 0ZM13.2 7.47H9.73V22h3.62v-7.19c0-1.9.36-3.74 2.72-3.74 2.33 0 2.36 2.18 2.36 3.86V22h3.62v-7.97c0-3.92-.85-6.94-5.43-6.94-2.2 0-3.67 1.21-4.27 2.36h-.05V7.47h-.1Z" />
  </svg>
);

export const ShieldIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M12 21s7-3.4 7-9.24V5.82L12 3 5 5.82v5.94C5 17.6 12 21 12 21Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d="m9 12 2 2 4-4"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ExternalLinkIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M14 5h5v5M19 5l-8 8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 14v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);
