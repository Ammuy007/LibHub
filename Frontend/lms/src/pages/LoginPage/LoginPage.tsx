import React from "react";
import { LoginForm } from "./LoginForm";
import { Library } from "lucide-react";

export const LoginPage: React.FC = () => {
  return (
    <div className="h-full w-full bg-[#f6f6f8] border border-gray-300 flex flex-col">
      <div className="flex-1 flex items-start justify-center px-4 pt-16 pb-8 mt-5">
        <div className="w-full max-w-[420px]">
          <div className=" mb-9 text-center space-y-1 mt-20">
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="w-9 h-9 rounded-md bg-blue-500 flex items-center justify-center">
                <Library className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-[32px] leading-none font-semibold text-blue-500">
                LibHub
              </h1>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Empowering Your Knowledge Journey
            </p>
          </div>

          <LoginForm />
        </div>
      </div>

      <footer className="border-t border-gray-300 bg-[#f8f8fa] py-4 text-center text-xs text-gray-500">
        &copy; 2026 LibHub Management System. All rights reserved.
      </footer>
    </div>
  );
};
