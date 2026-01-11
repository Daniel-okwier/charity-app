const ToastViewport = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-[350px]", // Updated positioning
        className
      )}
      {...props}
    />
  );
});