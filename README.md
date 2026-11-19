# Alarm Camera

A browser-based motion detection demo built with React and TypeScript for a university AI course.

**Live demo:** [Open on Vercel](https://alarm-cam.vercel.app)

## Overview

Created for a university Artificial Intelligence course to explore local video processing with background subtraction, adaptive thresholds, and multi-frame confirmation.

## Features

- Process webcam frames locally at 10 FPS and highlight detected movement.
- Capture detection snapshots and play audio alerts.
- Optionally save detections in IndexedDB and export saved records as JSON.
- Open the camera dashboard without an account.

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS, Canvas, MediaDevices, IndexedDB, Web Audio.

## Run locally

Use Node.js 22.12 or newer and npm.

```sh
git clone https://github.com/ThePrimeShak/alarm-cam.git
cd alarm-cam
npm ci
npm run dev
```

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create the production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Check code with ESLint |
| `npm run lint:fix` | Apply ESLint fixes |
| `npm run format` | Format project files |
| `npm run format:check` | Check formatting |

## Project structure

- `src/components/camera/` — camera controls, processing, and detection history.
- `src/utils/` — image-processing, storage, and audio helpers.

## Scope and limitations

Requires a camera, browser permission, and HTTPS or localhost. Detection quality depends on lighting and camera conditions; this is an educational demo.

## Author

Built by [ThePrimeShak](https://github.com/ThePrimeShak) · [LinkedIn](https://www.linkedin.com/in/theprimeshak/).
