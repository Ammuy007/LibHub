import React, { useState } from "react";
import { Card } from "../../components/ui/Card/Card";
import { Button } from "../../components/ui/Button/Button";
import { Input } from "../../components/ui/Input/Input";

import { Lock, Mail, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    if (!email || !password) {
      window.alert("Please enter your email and password.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.login(email, password);

      // Determine role from the JWT via /auth/me (single clean call)
      let destination = "/user/dashboard";
      try {
        const me = await api.getMe();
        if (me.role?.toLowerCase() === "admin") {
          destination = "/dashboard";
        }
      } catch {
        // If role detection fails, default to member dashboard
      }

      navigate(destination);
    } catch (error) {
      console.error("Login failed", error);
      window.alert("Login failed. Please check your credentials and try again.");
    } finally {
      setIsSubmitting(false);
    }
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"} <ChevronRight className="w-4 h-4" />
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
