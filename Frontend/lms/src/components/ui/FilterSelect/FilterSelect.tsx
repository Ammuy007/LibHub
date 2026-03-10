import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FilterSelectProps {
    label: string;
    options: string[];
    onSelect: (val: string) => void;
    className?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
    label,
    options,
    onSelect,
    className = "",
    searchable = false,
    searchPlaceholder = "Search...",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const filteredOptions = searchable
        ? options.filter((option) => option.toLowerCase().includes(searchValue.toLowerCase()))
        : options;

    const handleClose = () => {
        setIsOpen(false);
        setSearchValue("");
    };

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
                    <div className="fixed inset-0 z-10" onClick={handleClose} />
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl z-20 py-1 overflow-hidden">
                        {searchable && (
                            <div className="px-3 pb-2 pt-2">
                                <input
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    className="h-9 w-full rounded-lg border border-gray-100 bg-gray-50 px-3 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    placeholder={searchPlaceholder}
                                    autoFocus
                                />
                            </div>
                        )}
                        <div className="max-h-64 overflow-y-auto">
                            {filteredOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => {
                                        onSelect(option);
                                        handleClose();
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${label === option ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
