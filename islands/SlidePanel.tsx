import { ComponentChildren } from "preact";
import { useEffect } from "preact/hooks";

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  width?: "sm" | "md" | "lg" | "xl";
  children: ComponentChildren;
}

export default function SlidePanel({
  isOpen,
  onClose,
  title,
  width = "md",
  children,
}: SlidePanelProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <>
      {/* Backdrop - subtle overlay */}
      <div
        class="fixed inset-0 bg-gray-900/20 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        class={`fixed inset-y-0 right-0 w-full ${widthClasses[width]} bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-200 ease-out`}
        style={{ animation: "slideInRight 0.2s ease-out" }}
      >
        {/* Header */}
        <div class="flex-shrink-0 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            class="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close panel"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div class="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
