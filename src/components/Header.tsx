import { NavLink, useNavigate } from "react-router";

import { CameraIcon, GithubIcon, LinkedinIcon } from "@/components/UI/Icons";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-bg sticky top-0 z-50 border-b border-white/10">
      <div className="container flex h-16 items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="group focus-visible:ring-primary/60 flex cursor-pointer items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2"
          aria-label="Go to Camera Alarm home"
        >
          <span className="border-primary/25 bg-primary/10 text-primary group-hover:bg-primary/15 grid size-9 place-items-center rounded-lg border transition">
            <CameraIcon className="size-5" />
          </span>
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-sm font-semibold sm:text-base">
              Camera Alarm
            </span>
            <span className="text-secondary hidden text-xs sm:block">
              Artificial Intelligence course project
            </span>
          </span>
        </button>

        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-1 sm:gap-2">
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `rounded-md px-2.5 py-2 text-sm font-medium transition hover:bg-white/5 hover:text-white sm:px-3 ${
                    isActive ? "bg-white/5 text-white" : "text-secondary"
                  }`
                }
              >
                About
              </NavLink>
            </li>
            <li>
              <a
                href="https://github.com/ThePrimeShak/alarm-cam"
                target="_blank"
                rel="noreferrer"
                className="text-secondary flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition hover:bg-white/5 hover:text-white"
                aria-label="View Camera Alarm repository on GitHub"
              >
                <GithubIcon className="size-4" />
                <span className="hidden lg:inline">Repository</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/theprimeshak/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-md border border-white/10 px-2.5 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white sm:px-3"
                aria-label="Visit ThePrimeShak on LinkedIn"
              >
                <LinkedinIcon className="size-4" />
                <span className="hidden lg:inline">ThePrimeShak</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
