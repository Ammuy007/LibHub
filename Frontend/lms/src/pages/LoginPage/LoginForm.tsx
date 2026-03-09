import React from "react";
import { Card } from "../../components/ui/Card/Card";
import { Button } from "../../components/ui/Button/Button";
import { Input } from "../../components/ui/Input/Input";

import { Lock, Mail, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    if (!email || !password) {
      navigate("dashboard")
      return;
    }

    navigate("/user/dashboard");
  };

  return (
    <Card className="w-full border border-gray-200 rounded-md p-5 shadow-sm">
      <div className="text-center mb-5">
        <h2 className="text-[20px] leading-none font-semibold text-gray-800">
          Login
        </h2>
        <p className="text-xs text-gray-500 mt-4">
          Enter your library credentials to access your dashboard.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="admin@gmail.com"
          leftIcon={<Mail className="w-4 h-4" />}
          labelClassName="text-xs font-semibold"
          className="text-sm"
          required
        />

        <Input
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          labelClassName="text-xs font-semibold"
          className="text-sm"
          required
        />
        <div className="mt-6">
          <Button
            type="submit"
            fullWidth
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all w-full"
          >
            Sign In <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </form>

      <div className="mt-3 text-center">
        <button className="text-xs text-blue-500 hover:underline">
          Forgot password?
        </button>
      </div>
    </Card>
  );
};
