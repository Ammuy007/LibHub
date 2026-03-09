import React, { useState } from "react";
import { Bell, Library, LogOut, ChevronDown, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface PageHeaderProps {
  userName: string;
  settingsPath: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ userName, settingsPath }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    //clear token
    setIsProfileOpen(false);
    navigate("/");
  };
  return (
    <header className="h-16 w-full bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2.5 mr-8 shrink-0">
        <div className="bg-blue-500 p-1.5 rounded-lg flex items-center justify-center">
          <Library size={22} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold text-blue-500 tracking-tight">LibHub</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

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

                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group" onClick={() => {
                    navigate(settingsPath); // Navigates to the settings route
                    setIsProfileOpen(false); // Closes the dropdown extension
                  }}>
                    <Settings size={16} className="text-gray-400 group-hover:text-blue-500" />
                    <span className="font-semibold">Settings</span>
                  </button>
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