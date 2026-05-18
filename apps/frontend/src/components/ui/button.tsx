import { Slot } from "@radix-ui/react-slot";
import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-white/30 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-white text-black hover:bg-white/90",
        variant === "secondary" && "border border-white/[0.12] bg-white/[0.08] text-white hover:bg-white/[0.12]",
        variant === "ghost" && "text-white/[0.72] hover:bg-white/[0.08] hover:text-white",
        className
      )}
      {...props}
    />
  );
}
