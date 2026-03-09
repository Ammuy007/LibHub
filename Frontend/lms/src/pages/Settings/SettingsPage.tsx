import React, { useState } from "react";
import { MainLayout } from "../../components/ui/layout/MainLayout";
import { Input } from "../../components/ui/Input/Input";
import { Button } from "../../components/ui/Button/Button";
import {
    User,
    Library,
    ShieldCheck,
    Save,
    Camera,
    RotateCcw
} from "lucide-react";

export const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState("account");

    // Initial values for reset logic
    const initialAccount = { name: "Admin User", email: "admin@libhub.com" };
    const [account, setAccount] = useState(initialAccount);

    const handleReset = () => {
        if (window.confirm("Are you sure you want to discard all unsaved changes?")) {
            setAccount(initialAccount);
        }
    };

    return (
        <MainLayout>
            <div className="mx-10 space-y-8 animate-in fade-in duration-500 pb-12">

                {/* Page Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Settings</h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-[2px]">System Configuration</p>
                </div>

                {/* Horizontal Navigation Bar */}
                <nav className="flex items-center gap-1 border-b border-gray-100 pb-1">
                    {[
                        { id: "account", label: "Account Identity", icon: <User size={18} /> },
                        { id: "library", label: "Library Rules", icon: <Library size={18} /> },
                        { id: "security", label: "Security", icon: <ShieldCheck size={18} /> },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-2.5 px-6 py-4 rounded-t-2xl text-sm font-bold transition-all relative ${activeTab === item.id
                                ? "text-blue-600"
                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                        >
                            {item.icon}
                            {item.label}
                            {/* Active Indicator Line */}
                            {activeTab === item.id && (
                                <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-blue-600 animate-in fade-in zoom-in-95" />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Content Area */}
                <main className="max-w-4xl space-y-12 pt-4">

                    {activeTab === "account" && (
                        <div className="space-y-10 animate-in slide-in-from-bottom-2 duration-300">
                            <header className="space-y-1">
                                <h2 className="text-xl font-bold text-gray-900">Account Identity</h2>
                                <p className="text-sm text-gray-500">Update your primary administrative contact details.</p>
                            </header>

                            <div className="flex items-center gap-8">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-white shadow-md">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-gray-100 text-blue-600 hover:scale-110 transition-transform">
                                        <Camera size={16} />
                                    </button>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Profile Picture</h3>
                                    <p className="text-xs text-gray-400 mt-1">Recommended size: 256x256px</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <Input
                                    label="Full Name"
                                    value={account.name}
                                    onChange={(e) => setAccount({ ...account, name: e.target.value })}
                                    className="bg-white"
                                />
                                <Input
                                    label="Email Address"
                                    value={account.email}
                                    onChange={(e) => setAccount({ ...account, email: e.target.value })}
                                    className="bg-white"
                                />
                                <div className="md:col-span-2">
                                    <Input label="Admin ID" defaultValue="ADM-2024-001" disabled className="bg-gray-50/50 w-full md:w-1/2" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "library" && (
                        <div className="space-y-10 animate-in slide-in-from-bottom-2 duration-300">
                            <header className="space-y-1">
                                <h2 className="text-xl font-bold text-gray-900">Library Rules</h2>
                                <p className="text-sm text-gray-500">Configure global circulation and penalty parameters.</p>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <Input label="Default Loan Period (Days)" type="number" defaultValue="14" className="bg-white" />
                                <Input label="Daily Fine Rate (Rs.)" type="number" defaultValue="10" className="bg-white" />
                                <Input label="Max Books per Member" type="number" defaultValue="3" className="bg-white" />
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="space-y-10 animate-in slide-in-from-bottom-2 duration-300">
                            <header className="space-y-1">
                                <h2 className="text-xl font-bold text-gray-900">Security</h2>
                                <p className="text-sm text-gray-500">Manage your password and account protection.</p>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="md:col-span-2">
                                    <Input label="Current Password" type="password" placeholder="••••••••" className="bg-white" />
                                </div>
                                <Input label="New Password" type="password" className="bg-white" />
                                <Input label="Confirm Password" type="password" className="bg-white" />
                            </div>
                        </div>
                    )}

                    {/* Actions Bar */}
                    <div className="pt-10 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs text-gray-400 font-medium italic">Changes are saved to the system database.</p>
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                onClick={handleReset}
                                className="px-6 h-12 text-sm font-bold border-gray-200 text-gray-500 hover:bg-gray-50"
                            >
                                <RotateCcw size={16} className="mr-2" /> Discard
                            </Button>
                            <Button className="px-12 h-12 text-sm font-bold shadow-xl shadow-blue-600/20">
                                <Save size={16} className="mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </MainLayout>
    );
};