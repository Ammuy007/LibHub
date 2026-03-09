import React, { useState, useMemo } from "react";
import { X } from "lucide-react";

interface DateFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (month: number, year: number) => void;
    initialMonth: number;
    initialYear: number;
}

export const DateFilterModal: React.FC<DateFilterModalProps> = ({
    isOpen,
    onClose,
    onApply,
    initialMonth,
    initialYear,
}) => {
    const [view, setView] = useState<"Month" | "Year">("Month");
    const [selectedMonth, setSelectedMonth] = useState(initialMonth);
    const [selectedYear, setSelectedYear] = useState(initialYear);

    const months = useMemo(() =>
        Array.from({ length: 12 }, (_, i) =>
            new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(2000, i))
        ), []);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const years = useMemo(() =>
        Array.from({ length: currentYear - 2012 }, (_, i) => (currentYear - i)),
        [currentYear]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-8 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-gray-900">Filter by</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Tab Switcher - Centered using justify-center */}
                <div className="px-8 flex justify-center gap-3 mb-8">
                    {["Month", "Year"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setView(tab as any)}
                            className={`px-6 py-2 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1.5 ${view === tab
                                    ? "bg-blue-600 text-white border-blue-600" // Updated to Blue/White
                                    : "bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-200"
                                }`}
                        >
                            <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${view === tab ? 'bg-white border-white' : 'border-gray-300'}`}>
                                {view === tab && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                            </div>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Grid Content */}
                <div className="px-8 pb-12 min-h-[320px]">
                    <div className="grid grid-cols-3 gap-3">
                        {view === "Month" ? (
                            months.map((month, idx) => {
                                const isFuture = selectedYear === currentYear && idx > currentMonth;
                                return (
                                    <button
                                        key={month}
                                        disabled={isFuture}
                                        onClick={() => setSelectedMonth(idx)}
                                        className={`py-3.5 rounded-2xl text-xs font-bold transition-all ${selectedMonth === idx
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105" // Updated to Blue/White
                                                : "text-gray-500 hover:bg-gray-50 disabled:opacity-20 disabled:hover:bg-transparent"
                                            }`}
                                    >
                                        {month}
                                    </button>
                                );
                            })
                        ) : (
                            years.map((year) => (
                                <button
                                    key={year}
                                    onClick={() => setSelectedYear(year)}
                                    className={`py-3.5 rounded-2xl text-xs font-bold transition-all ${selectedYear === year
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105" // Updated to Blue/White
                                            : "text-gray-500 hover:bg-gray-50"
                                        }`}
                                >
                                    {year}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Action Button - Updated to Blue */}
                <button
                    onClick={() => onApply(selectedMonth, selectedYear)}
                    className="w-full bg-blue-600 text-white py-6 text-sm font-black uppercase tracking-[3px] hover:bg-blue-700 transition-colors active:bg-blue-800"
                >
                    Apply
                </button>
            </div>
        </div>
    );
};