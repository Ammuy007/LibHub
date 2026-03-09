import React from "react";

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

export const DataTable = ({ headers, children, className = "" }: TableProps) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            {headers.map((header) => (
              <th
                key={header}
                className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center first:text-left"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">{children}</tbody>
      </table>
    </div>
  );
};

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  center?: boolean;
  colSpan?: number; // Added to resolve the TypeScript error
}

export const TableCell = ({
  children,
  className = "",
  center = false,
  colSpan, // Destructured here
}: TableCellProps) => (
  <td
    colSpan={colSpan} // Passed to the native HTML element
    className={`p-6 ${center ? "text-center" : ""} ${className}`}
  >
    {children}
  </td>
);