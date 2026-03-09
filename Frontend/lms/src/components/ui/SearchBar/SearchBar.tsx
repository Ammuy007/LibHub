import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  containerClassName = "",
  ...props
}) => {
  return (
    <div className={`relative group ${containerClassName}`}>
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
      </span>
      <input
        type="text"
        className="w-full h-10 pl-10 pr-4 text-sm bg-gray-50 border border-transparent rounded-xl 
                   focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 
                   transition-all outline-none placeholder:text-gray-400"
        {...props}
      />
    </div>
  );
};

