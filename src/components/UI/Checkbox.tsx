import type React from "react";

import { twMerge } from "tailwind-merge";

type CheckboxProps = {
  label?: string;
  className?: string;
  checked?: boolean;
  onChange: (checked: boolean) => void;
  name: string;
};

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  className,
  checked,
  onChange,
  name,
}) => {
  const checkboxClass = twMerge(
    "peer h-4 w-4 cursor-pointer rounded border-white/20 bg-bg text-primary accent-primary transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
    className
  );

  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <input
        type="checkbox"
        name={name}
        id={name}
        className={checkboxClass}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label && (
        <span className="text-sm font-medium text-slate-300 transition-colors select-none peer-checked:text-white">
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;
