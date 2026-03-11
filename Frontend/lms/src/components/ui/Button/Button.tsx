import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  fullWidth,
  className = "",
  ...props
}) => {
  const baseStyles =
    "transition-all duration-200 flex items-center justify-center gap-2 leading-tight text-xs sm:text-sm [&_svg]:h-3 [&_svg]:w-3 sm:[&_svg]:h-4 sm:[&_svg]:w-4 [&_svg]:shrink-0";

  const variants = {
    primary: "px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700",
    // Inside your Button component styling definition:
    secondary: "h-10 min-w-40 px-3 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50 inline-flex items-left justify-between  transition-colors",
    outline: "flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm",
    ghost: "px-4 py-2 rounded-lg font-medium text-gray-500 hover:bg-gray-100",
    destructive: "px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-200",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
