const Toast = React.forwardRef(({ className, open, onOpenChange, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(open || false);

  React.useEffect(() => {
    setIsVisible(open);
  }, [open]);

  return (
    <div
      ref={ref}
      data-state={isVisible ? "open" : "closed"}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:fade-in data-[state=closed]:fade-out",
        "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
        className
      )}
      {...props}
    />
  );
});