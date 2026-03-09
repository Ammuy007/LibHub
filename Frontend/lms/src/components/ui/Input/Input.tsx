import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  wrapperClassName?: string;
  labelClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  leftIcon,
  wrapperClassName = "",
  labelClassName = "",
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col space-y-3 ${wrapperClassName}`}>
      {label && (
        <label
          className={`text-sm font-medium text-gray-700 ${labelClassName}`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </span>
        )}
        <input
          className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${leftIcon ? "pl-9" : ""} ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};
