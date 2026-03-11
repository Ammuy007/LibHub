import React, { useState } from "react";
import { Library, LogOut, ChevronDown, Settings, Menu, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/api";
interface PageHeaderProps {
  userName: string;
  settingsPath?: string | null;
  securityPath?: string | null;
  onMenuClick?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ userName, settingsPath, securityPath, onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore logout failures
    }
    setIsProfileOpen(false);
    navigate("/");
  };
  return (
    <header className="h-16 w-full bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2.5 mr-4 sm:mr-8 shrink-0">
        {onMenuClick && (
          <button
            className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={onMenuClick}
          >
            <Menu size={24} />
          </button>
        )}
        <div className="bg-blue-500 p-1.5 rounded-lg flex items-center justify-center hidden sm:flex">
          <Library size={22} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold text-blue-500 tracking-tight hidden sm:block">LibHub</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>

        <div className="relative h-16 flex items-center">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-3 px-3 h-[calc(100%-8px)] rounded-xl transition-all relative z-30 ${isProfileOpen ? "bg-gray-50" : "hover:bg-gray-50"
              }`}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 leading-none">{userName}</p>
            </div>

            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center overflow-hidden">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProfileOpen && (
            <>

              <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />


              <div className="absolute top-[63px] right-0 w-full bg-white border border-gray-100 border-t-0 rounded-b-2xl shadow-2xl z-20 overflow-hidden animate-in slide-in-from-top-1 duration-200">




                <div className="p-1.5">

                  {securityPath && (
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                      onClick={() => {
                        navigate(securityPath);
                        setIsProfileOpen(false);
                      }}
                    >
                      <Shield size={16} className="text-gray-400 group-hover:text-blue-500" />
                      <span className="font-semibold">Security</span>
                    </button>
                  )}
                  {settingsPath && (
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                      onClick={() => {
                        navigate(settingsPath);
                        setIsProfileOpen(false);
                      }}
                    >
                      <Settings size={16} className="text-gray-400 group-hover:text-blue-500" />
                      <span className="font-semibold">Settings</span>
                    </button>
                  )}
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                    onClick={handleLogout}>
                    <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    <span className="font-bold">Log Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header >
  );
};
