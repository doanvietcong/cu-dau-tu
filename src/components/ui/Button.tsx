"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "gold";
type Size = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "ref"> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-duolingo-green text-white border-duolingo-green-dark hover:bg-duolingo-green-light shadow-duo-green-sm active:shadow-none",
  secondary: "bg-white text-duolingo-gray-5 border-duolingo-gray-1 hover:bg-duolingo-gray-1/50 shadow-duo-card",
  danger: "bg-duolingo-red text-white border-duolingo-red-dark hover:bg-red-500 shadow-duo-red-sm active:shadow-none",
  ghost: "bg-transparent text-duolingo-gray-3 border-transparent hover:bg-duolingo-gray-1/50",
  gold: "bg-duolingo-gold text-duolingo-gray-5 border-duolingo-gold-dark hover:bg-yellow-400 shadow-duo-gold-sm active:shadow-none",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-6 py-3 text-lg",
  xl: "px-8 py-4 text-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", fullWidth, loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-b-4 font-bold uppercase tracking-wide transition-all",
          "active:translate-y-[2px] active:border-b-2 disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? <span className="animate-spin">⏳</span> : children}
      </button>
    );
  }
);
Button.displayName = "Button";
