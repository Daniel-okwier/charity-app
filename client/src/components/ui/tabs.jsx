import React from "react";
import { cn } from "../../lib/utils";

const Tabs = ({ defaultValue, value, onValueChange, ...props }) => {
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue);
  
  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div {...props} data-value={selectedValue}>
      {React.Children.map(props.children, (child) => {
        if (!React.isValidElement(child)) return child;

        return React.cloneElement(child, {
          selectedValue,
          onValueChange: handleValueChange,
        });
      })}
    </div>
  );
};

const TabsList = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  );
});
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef(({ className, value, selectedValue, onValueChange, ...props }, ref) => {
  const isSelected = selectedValue === value;
  
  return (
    <button
      ref={ref}
      role="tab"
      aria-selected={isSelected}
      data-state={isSelected ? "active" : "inactive"}
      onClick={() => onValueChange?.(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isSelected 
          ? "bg-background text-foreground shadow-sm" 
          : "text-muted-foreground",
        className
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef(({ className, value, selectedValue, ...props }, ref) => {
  const isSelected = selectedValue === value;
  
  if (!isSelected) return null;
  
  return (
    <div
      ref={ref}
      role="tabpanel"
      data-state={isSelected ? "active" : "inactive"}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
});
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
