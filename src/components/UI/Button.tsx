import type React from "react";

import { PropagateLoader } from "react-spinners";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  type: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className,
  type,
  disabled,
  loading,
}) => {
  const buttonClasses = twMerge(
    "inline-flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-primary/20 bg-primary px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto",
    className
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {children}
      {loading && <PropagateLoader className="ml-2" />}
    </button>
  );
};

export default Button;
