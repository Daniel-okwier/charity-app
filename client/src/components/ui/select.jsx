import React from 'react';
import {
  Select as RadixSelect,
  SelectContent as RadixSelectContent,
  SelectItem as RadixSelectItem,
  SelectTrigger as RadixSelectTrigger,
  SelectValue as RadixSelectValue,
} from '@radix-ui/react-select';

const Select = React.forwardRef(({ children, ...props }, ref) => (
  <RadixSelect {...props}>{children}</RadixSelect>
));

const SelectTrigger = React.forwardRef(({ children, ...props }, ref) => (
  <RadixSelectTrigger {...props} ref={ref}>
    {children}
  </RadixSelectTrigger>
));

const SelectValue = React.forwardRef(({ children, ...props }, ref) => (
  <RadixSelectValue {...props} ref={ref}>
    {children}
  </RadixSelectValue>
));

const SelectContent = React.forwardRef(({ children, ...props }, ref) => (
  <RadixSelectContent {...props} ref={ref}>
    {children}
  </RadixSelectContent>
));

const SelectItem = React.forwardRef(({ children, ...props }, ref) => (
  <RadixSelectItem {...props} ref={ref}>
    {children}
  </RadixSelectItem>
));

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
};