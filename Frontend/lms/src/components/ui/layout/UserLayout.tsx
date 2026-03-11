import React, { useEffect, useState } from "react";
import { UserSidebar } from "../Sidebar/UserSidebar";
import { PageHeader } from "../PageHeader/PageHeader";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../../services/api";

interface UserLayoutProps {
    children?: React.ReactNode;
}

export const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [userName, setUserName] = useState("User");

    useEffect(() => {
        if (location.pathname !== "/user/dashboard") return;
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

    useEffect(() => {
        let isMounted = true;
        const loadUserName = async () => {
            try {
                const me = await api.getMe();
                const memberPage = await api.getMembers({ id: me.memberId, page: 0, size: 1 });
                if (!isMounted) return;
                setUserName(memberPage.content[0]?.name ?? "User");
            } catch {
                if (!isMounted) return;
                setUserName("User");
            }
        };
        loadUserName();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="flex h-screen bg-gray-50">
            <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden w-full">
                <PageHeader
                    userName={userName}
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
