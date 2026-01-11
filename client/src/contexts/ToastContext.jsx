// src/contexts/ToastContext.jsx
import React, { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@lib/utils";

const ToastContext = React.createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, visible: true }]);
    
    setTimeout(() => {
      setToasts((prev) => 
        prev.map(t => t.id === id ? {...t, visible: false} : t)
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter(toast => toast.id !== id));
      }, 200); // Matches animation duration
    }, 3000); // Reduced from 5s to 3s for better UX
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "toast flex items-center justify-between p-4 rounded-md shadow-lg min-w-[300px] transition-all duration-200",
              `toast-${toast.type}`,
              {
                'slide-in-from-right': toast.visible,
                'slide-out-to-right opacity-0': !toast.visible,
              }
            )}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => {
                setToasts((prev) => prev.filter(t => t.id !== toast.id));
              }}
              className="ml-4"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => React.useContext(ToastContext);