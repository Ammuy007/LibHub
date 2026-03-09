import React from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { PageHeader } from "../PageHeader/PageHeader";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader userName="Admin" settingsPath="/settings" />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
