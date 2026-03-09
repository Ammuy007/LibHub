import React from "react";
import { UserSidebar } from "../Sidebar/UserSidebar";
import { PageHeader } from "../PageHeader/PageHeader";

interface UserLayoutProps {
    children?: React.ReactNode;
}

export const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-50">
            <UserSidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <PageHeader userName="User" settingsPath="/" />

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};
