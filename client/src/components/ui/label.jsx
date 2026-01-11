import React from "react";
import { cn } from "../../lib/utils";

const Label = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "block text-sm font-medium leading-none mb-1 text-gray-700", // Added mb-1 for consistent spacing
        className
      )}
      {...props}
    />
  );
});
Label.displayName = "Label";

export { Label };