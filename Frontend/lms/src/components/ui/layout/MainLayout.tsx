import React, { useEffect } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { PageHeader } from "../PageHeader/PageHeader";
import { useLocation, useNavigate } from "react-router-dom";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== "/dashboard") return;
    window.history.pushState(null, "", window.location.pathname);
    const handlePopState = () => {
      const shouldLogout = window.confirm("Do you want to logout?");
      if (shouldLogout) {
        try {
          localStorage.removeItem("authToken");
        } catch {
          // noop
        }
        navigate("/", { replace: true });
      } else {
        window.history.pushState(null, "", window.location.pathname);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [location.pathname, navigate]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <PageHeader
          userName="Admin"
          settingsPath={null}
          securityPath="/security"
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
