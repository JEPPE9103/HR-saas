import { clsx } from "clsx";
import { HTMLAttributes } from "react";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        "border-neutral-300 text-neutral-700 bg-neutral-100",
        className
      )}
      {...props}
    />
  );
}


