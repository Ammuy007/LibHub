import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FilterSelectProps {
    label: string;
    options: string[];
    onSelect: (val: string) => void;
    className?: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
    label,
    options,
    onSelect,
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-10 min-w-40 px-3 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50 inline-flex items-center justify-between gap-3 transition-all"
            >
                <span>{label}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    {/* Overlay to handle click-outside to close */}
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl z-20 py-1 overflow-hidden">
                        {options.map((option) => (
                            <button
                                key={option}
                                onClick={() => {
                                    onSelect(option);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${label === option ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
