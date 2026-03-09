import React, { useState } from "react";
import { X, User, Mail, Phone, MapPin, CreditCard, ShieldCheck, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "../../../ui/Button/Button";

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose }) => {
    const initialFormState = {
        name: "",
        email: "",
        phone: "",
        address: "",
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleClose = () => {
        setFormData(initialFormState);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden flex animate-in zoom-in-95 duration-200">


                <div className="flex-1 p-10 border-r border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Add New Member</h2>
                            <p className="text-sm text-gray-500">Register a new reader to the library system.</p>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleClose(); }}>
                        <div className="space-y-4">
                            <InputGroup label="Full Name" icon={<User size={16} />} placeholder="Enter Full Name"
                                value={formData.name} onChange={(v: string) => setFormData({ ...formData, name: v })} />

                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="Email Address" icon={<Mail size={16} />} placeholder="Enter Email"
                                    value={formData.email} onChange={(v: string) => setFormData({ ...formData, email: v })} />
                                <InputGroup label="Phone Number" icon={<Phone size={16} />} placeholder="XXXXXXXXXX"
                                    value={formData.phone} onChange={(v: string) => setFormData({ ...formData, phone: v })} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Home Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-4 text-gray-400" size={16} />
                                    <textarea
                                        className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 min-h-[100px] resize-none"
                                        placeholder="Enter full residential address..."
                                        value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button variant="ghost" type="button" onClick={handleClose} className="flex-1 h-14 rounded-xl bg-gray-50/50 hover:bg-gray-100 font-bold text-gray-500">
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-[2] h-14">
                                <ShieldCheck size={20} /> Register Member
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Right Side: Visual Preview (Redesigned without QR) */}
                <div className="w-[380px] bg-blue-600 p-10 flex flex-col justify-between relative text-white overflow-hidden group shrink-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />

                    <button onClick={handleClose} className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full text-white/70 transition-colors z-20">
                        <X size={20} />
                    </button>

                    {/* Top: Card Branding */}
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-12">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                <CreditCard size={22} />
                            </div>
                            <span className="text-[11px] font-black tracking-[0.2em] uppercase opacity-90">LibHub</span>
                        </div>

                        {/* Middle: User Identification */}
                        <div className="space-y-6">
                            <div className="w-20 h-20 rounded-3xl bg-white/10 border-2 border-white/20 flex items-center justify-center backdrop-blur-sm shadow-xl">
                                <User size={40} className="text-white/40" />
                            </div>

                            <div>
                                <p className="text-[10px] opacity-60 uppercase tracking-widest mb-1">Name</p>
                                <p className="text-3xl font-bold tracking-tight leading-tight">
                                    {formData.name || "Full Name"}
                                </p>
                            </div>

                            <div className="pt-4 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                        <Calendar size={14} className="text-blue-200" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] opacity-50 uppercase font-bold">Member Since</p>
                                        <p className="text-xs font-bold">March 2026</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                        <CheckCircle2 size={14} className="text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] opacity-50 uppercase font-bold">Initial Account Status</p>
                                        <p className="text-xs font-bold text-green-400">Verified & Active</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom: ID Number Strip */}
                    <div className="relative z-10 mt-auto border-t border-white/10 pt-8">
                        <p className="text-[10px] opacity-50 uppercase tracking-widest mb-2"> Member ID</p>
                        <div className="bg-black/20 rounded-xl p-4 backdrop-blur-md border border-white/5">
                            <p className="text-lg font-mono font-bold tracking-[0.1em] text-blue-100">MEM-2026-8801</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InputGroup = ({ label, icon, placeholder, value, onChange }: { label: string, icon: React.ReactNode, placeholder: string, value: string, onChange: (v: string) => void }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
            <input
                className="w-full h-12 bg-gray-50 border-none rounded-2xl pl-12 pr-4 text-sm font-semibold focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    </div>
);