import {
  LayoutDashboard,
  Users,
  BookMarked,
  Layers,
  Handshake,
  Wallet,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", to: "/dashboard" },
  { icon: <Users size={20} />, label: "Members", to: "/members" },
  { icon: <BookMarked size={20} />, label: "Books", to: "/books" },
  { icon: <Layers size={20} />, label: "Copies", to: "/copies" },
  { icon: <Handshake size={20} />, label: "Loans", to: "/loans" },
  { icon: <Wallet size={20} />, label: "Fines", to: "/fines" },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <nav className="flex-1 px-4 space-y-2 mt-4">
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
  );
};
