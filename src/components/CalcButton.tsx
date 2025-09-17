import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface CalcButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'number' | 'operator' | 'special' | 'equals';
  children: React.ReactNode;
}

const CalcButton = forwardRef<HTMLButtonElement, CalcButtonProps>(
  ({ className, variant = 'number', children, ...props }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case 'number':
          return "bg-calc-number hover:bg-calc-number-hover text-foreground border-border/50";
        case 'operator':
          return "bg-calc-operator hover:bg-calc-operator-hover text-white border-calc-operator/30 shadow-glow";
        case 'special':
          return "bg-calc-special hover:bg-calc-special-hover text-accent-foreground border-calc-special/30";
        case 'equals':
          return "bg-gradient-primary hover:shadow-glow text-white border-primary/30 col-span-2";
        default:
          return "";
      }
    };

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "relative flex items-center justify-center rounded-2xl border",
          "text-xl font-semibold transition-all duration-200",
          "active:scale-95 active:shadow-inner",
          "shadow-button backdrop-blur-sm",
          "min-h-[60px] sm:min-h-[70px] lg:min-h-[80px]",
          "hover:scale-105 hover:brightness-110",
          // Variant-specific styles
          getVariantClasses(),
          className
        )}
        {...props}
      >
        <span className="relative z-10">
          {children}
        </span>
      </button>
    );
  }
);

CalcButton.displayName = "CalcButton";

export { CalcButton };