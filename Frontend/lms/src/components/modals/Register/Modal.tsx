import React, { useEffect } from "react";
import { X, AlertCircle } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthClassName?: string;
  variant: "branded" | "danger" | "clean";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidthClassName = "max-w-2xl",
  variant,
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDanger = variant === "danger";
  const isClean = variant === "clean";
  const isBranded = variant === "branded";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`w-full ${maxWidthClassName} bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- DANGER VARIANT HEADER (Centered/Minimal) --- */}
        {isDanger && (
          <div className="pt-10 pb-4 flex flex-col items-center text-center px-10">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
              {icon || <AlertCircle size={32} />}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-gray-500 mt-2 text-sm">{subtitle}</p>}
          </div>
        )}

        {/* --- BRANDED VARIANT HEADER (Solid Blue/Red Background) --- */}
        {isBranded && (
          <div className="px-10 pt-10 pb-8 relative bg-blue-600 text-white">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-8 right-8 p-2 rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3">
              {icon && <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md text-white">{icon}</div>}
              <h2 className="text-2xl font-black tracking-tight">{title}</h2>
            </div>
            {subtitle && <p className="text-sm mt-1 text-white/80 font-medium italic">{subtitle}</p>}
          </div>
        )}

        {/* --- CLEAN VARIANT HEADER (Minimal/No Background) --- */}
        {isClean && (
          <div className="px-8 pt-8 pb-0 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
              <X size={18} />
            </button>
          </div>
        )}

        {/* --- CONTENT SECTION --- */}
        <div className={`overflow-y-auto max-h-[70vh] ${isDanger ? "px-10 py-4 text-center" : "px-10 py-8"}`}>
          {children}
        </div>

        {/* --- FOOTER SECTION --- */}
        {footer && (
          <div className={`px-10 pb-10 pt-2 ${isDanger ? "flex flex-col gap-3" : "bg-gray-50/30"}`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};