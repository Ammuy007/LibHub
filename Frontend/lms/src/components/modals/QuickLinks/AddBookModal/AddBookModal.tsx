import React, { useState, useEffect } from "react";
import { X, Book, Hash, User, Building2, Calendar, Layers, ShieldCheck, BookMarked } from "lucide-react";
import { Button } from "../../../ui/Button/Button";
import { Modal } from "../../Register/Modal";

interface AddBookModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AVAILABLE_CATEGORIES = ["Fiction", "Non-Fiction", "Sci-Fi", "Academic", "History", "Technology", "Biography", "Classic", "Self-Help", "Mystery"];


const INITIAL_FORM_STATE = {
    title: "",
    isbn: "",
    author: "",
    publisher: "",
    year: "",
    edition: "",
};

export const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [showCategoryList, setShowCategoryList] = useState(false);


    useEffect(() => {
        if (!isOpen) {
            setFormData(INITIAL_FORM_STATE);
            setSelectedCategories([]);
            setShowCategoryList(false);
        }
    }, [isOpen]);

    const toggleCategory = (cat: string) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Book"
            subtitle="Register a new book in the library system"
            icon={<BookMarked size={20} />}
            variant="branded"
            maxWidthClassName="max-w-3xl"
        >
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
                <InputGroup
                    label="Book Title *"
                    icon={<Book size={16} />}
                    placeholder="Enter Book Title"
                    value={formData.title}
                    onChange={(v: string) => setFormData({ ...formData, title: v })}
                />

                <div className="grid grid-cols-2 gap-4">
                    <InputGroup
                        label="ISBN-13"
                        icon={<Hash size={16} />}
                        placeholder="XXXXXXXXXXXXX"
                        value={formData.isbn}
                        onChange={(v: string) => setFormData({ ...formData, isbn: v })}
                    />
                    <InputGroup
                        label="Author"
                        icon={<User size={16} />}
                        placeholder="Enter the Author Name"
                        value={formData.author}
                        onChange={(v: string) => setFormData({ ...formData, author: v })}
                    />
                </div>

                {/* Multi-Category Selection */}
                <div className="space-y-2 relative text-left">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                        Categories
                    </label>
                    <div
                        onClick={() => setShowCategoryList(!showCategoryList)}
                        className={`min-h-12 w-full bg-gray-50 border-2 rounded-2xl p-2 flex flex-wrap gap-2 cursor-pointer transition-all ${showCategoryList
                            ? 'border-blue-100 bg-white ring-4 ring-blue-50/50'
                            : 'border-transparent hover:bg-gray-100/50'
                            }`}
                    >
                        {selectedCategories.length === 0 && (
                            <span className="text-sm font-semibold text-gray-400 ml-2 mt-1.5">
                                Select categories...
                            </span>
                        )}

                        {selectedCategories.map(cat => (
                            <span
                                key={cat}
                                className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-2 animate-in fade-in zoom-in-95"
                            >
                                {cat}
                                <X
                                    size={12}
                                    className="hover:text-red-200 transition-colors"
                                    onClick={(e) => { e.stopPropagation(); toggleCategory(cat); }}
                                />
                            </span>
                        ))}
                    </div>

                    {showCategoryList && (
                        <div className="absolute z-20 top-full left-0 w-full mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 animate-in slide-in-from-top-2">
                            {AVAILABLE_CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => toggleCategory(cat)}
                                    className={`text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${selectedCategories.includes(cat)
                                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                        : 'hover:bg-gray-50 text-gray-500 border border-transparent'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <InputGroup
                        label="Publisher"
                        icon={<Building2 size={14} />}
                        placeholder="Publisher Name"
                        value={formData.publisher}
                        onChange={(v: string) => setFormData({ ...formData, publisher: v })}
                    />
                    <InputGroup
                        label="Publication Year"
                        icon={<Calendar size={14} />}
                        placeholder="Year"
                        value={formData.year}
                        onChange={(v: string) => setFormData({ ...formData, year: v })}
                    />
                    <InputGroup
                        label="Edition"
                        icon={<Layers size={14} />}
                        placeholder="Ed."
                        value={formData.edition}
                        onChange={(v: string) => setFormData({ ...formData, edition: v })}
                    />
                </div>

                <div className="pt-6 flex gap-4">
                    <Button variant="ghost" type="button" onClick={onClose} className="flex-1 h-14 rounded-xl bg-gray-50/50 hover:bg-gray-100 font-bold text-gray-500">
                        Cancel
                    </Button>
                    <Button type="submit" className="flex-[2] h-14">
                        <ShieldCheck size={20} /> Register Book
                    </Button>
                </div>
            </form>
        </Modal>
    );
};


const InputGroup = ({ label, icon, placeholder, value, onChange }: { label: string; icon: React.ReactNode; placeholder: string; value: string; onChange: (v: string) => void }) => (
    <div className="space-y-2 text-left">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">{icon}</div>
            <input
                className="w-full h-12 bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-4 text-sm font-semibold focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50/50 transition-all outline-none"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    </div>
);