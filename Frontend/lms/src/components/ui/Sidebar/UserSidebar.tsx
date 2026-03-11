import {
    User,
    Handshake,
    Wallet,
    BookMarked,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";

interface UserSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const navItems = [
    { icon: <User size={20} />, label: "Profile", to: "/user/dashboard" },
    { icon: <Handshake size={20} />, label: "My Loans", to: "/user/loans" },
    { icon: <Wallet size={20} />, label: "Fines & Payments", to: "/user/fines", fineCount: 2 },
    { icon: <BookMarked size={20} />, label: "Books", to: "/user/books" },
];

export const UserSidebar = ({ isOpen = true, onClose }: UserSidebarProps) => {
    return (
        <>
            {/* Mobile overlay */}
            {isOpen && onClose && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={onClose}
                />
            )}

            <aside
                className={`w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed md:relative z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
            >
                <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100">
                    <span className="font-bold text-lg text-blue-600">LibHub Menu</span>
                    <button onClick={onClose} className="p-2 text-gray-500 rounded-lg hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                    {navItems.map((item, index) =>
                        item.to ? (
                            <NavLink
                                key={`${item.label}-${index}`}
                                to={item.to}
                                className={({ isActive }) =>
                                    `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-bold transition-colors ${isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-800 hover:bg-gray-50"
                                    }`
                                }
                            >
                                {item.icon}
                                {item.label}
                            </NavLink>
                        ) : (
                            <button
                                key={`${item.label}-${index}`}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ),
                    )}
                </nav>
            </aside>
        </>
    );
};