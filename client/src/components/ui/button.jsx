import React from 'react';
import { cn } from "../../lib/utils";

const buttonVariants = {
  variant: {
    default: "bg-islamic-primary text-white hover:bg-islamic-secondary transition-colors duration-200",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border-2 border-islamic-primary bg-transparent text-islamic-primary hover:bg-islamic-light/20",
    secondary: "bg-islamic-secondary text-white hover:bg-islamic-secondary/90",
    ghost: "text-islamic-primary hover:bg-islamic-light/20",
    link: "text-islamic-primary underline underline-offset-4 hover:text-islamic-secondary",
  },
  size: {
    default: "h-12 px-6 py-3 text-base",
    sm: "h-10 px-5 py-2.5 text-sm",
    lg: "h-14 px-8 py-4 text-lg",
    icon: "h-12 w-12 p-3",
  }
};

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const variantClasses = buttonVariants.variant[variant];
    const sizeClasses = buttonVariants.size[size];

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium", // Changed rounded-md to rounded-full
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-islamic-primary/50 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-60",
          "shadow-sm hover:shadow-md transition-all duration-200", // Added shadow transitions
          variantClasses,
          sizeClasses,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };