import React, { useState } from "react";
import { UserLayout } from "../../components/ui/layout/UserLayout";
import {
  Info,
  Clock,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { DataTable, TableCell } from "../../components/ui/Table/Table";
import { FilterSelect } from "../../components/ui/FilterSelect/FilterSelect";

interface FineDetail {
  id: string;
  bookTitle: string;
  loanId: string;
  dateIncurred: string;
  amount: string;
  status: "Unpaid" | "Paid";
}

const mockFines: FineDetail[] = [
  { id: "F-1024", bookTitle: "The Great Gatsby", loanId: "L-9051", dateIncurred: "Oct 12, 2023", amount: "Rs.12.50", status: "Unpaid" },
  { id: "F-1025", bookTitle: "Sapiens: A Brief History of Humankind", loanId: "L-8822", dateIncurred: "Nov 02, 2023", amount: "Rs.45.00", status: "Unpaid" },
  { id: "F-1021", bookTitle: "Clean Code", loanId: "L-7741", dateIncurred: "Sep 15, 2023", amount: "Rs.5.25", status: "Paid" },
  { id: "F-1029", bookTitle: "Atomic Habits", loanId: "L-8211", dateIncurred: "Dec 05, 2023", amount: "Rs.2.00", status: "Unpaid" },
  { id: "F-1018", bookTitle: "Thinking, Fast and Slow", loanId: "L-6652", dateIncurred: "Aug 20, 2023", amount: "Rs.32.00", status: "Paid" },
];

export const UserFinesPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState("Status");

  const filteredFines = mockFines.filter(fine =>
    statusFilter === "Status" || fine.status === statusFilter
  );

  return (
    <UserLayout>
      <div className=" mx-auto space-y-8 animate-in fade-in duration-700">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-gray-900">Fines & Payments</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Manage your fines and view your transaction history.</p>
        </div>

        {/* Main Summary Banner */}
        <div className="relative bg-blue-500 rounded-3xl p-10 overflow-hidden shadow-xl shadow-blue-100">
          <div className="relative z-10 space-y-2">
            <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Total Fine</p>
            <h2 className="text-5xl font-black text-white">Rs.200.00</h2>
            <div className="flex items-center gap-2 text-blue-50 pt-2">
              <Clock size={14} />
              <p className="text-xs font-bold">2 individual charges require your attention.</p>
            </div>
          </div>
          {/* Abstract Card Shape Decoration */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-20 transform rotate-12">
            <CreditCard size={180} className="text-white" />
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-all">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unpaid Penalties</p>
              <h3 className="text-4xl font-black text-gray-900">2</h3>
            </div>
            <span className="px-4 py-1.5 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm shadow-red-50">
              Action Required
            </span>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-all">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Paid (Last 30 Days)</p>
              <h3 className="text-4xl font-black text-gray-900">2</h3>
            </div>
            <CheckCircle2 size={32} className="text-gray-100" />
          </div>
        </div>

        {/* Fine Details Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-end px-2">
            <div>
              <h3 className="text-lg font-black text-gray-900">Fine Details</h3>
              <p className="text-xs text-gray-400 font-medium">A comprehensive list of all charges associated with your account.</p>
            </div>
            <FilterSelect
              label={statusFilter}
              options={["Status", "Paid", "Unpaid"]}
              onSelect={setStatusFilter}
            />
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <DataTable
              headers={["Fine ID", "Book", "Date Incurred", "Amount", "Status"]}
              className="w-full"
            >
              {filteredFines.map((fine) => (
                <tr key={fine.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0 group">
                  <TableCell>
                    <span className="text-sm font-bold text-gray-400 font-mono tracking-tight group-hover:text-blue-500 transition-colors">
                      {fine.id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-md font-black text-gray-900 leading-tight">{fine.bookTitle}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[15px] text-gray-400 font-bold uppercase">ID: {fine.loanId}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell center>
                    <div className="flex items-center justify-center gap-2">
                      <Clock size={14} className="text-gray-300" />
                      <span className="text-xs font-bold text-gray-700">{fine.dateIncurred}</span>
                    </div>
                  </TableCell>
                  <TableCell center>
                    <span className="text-sm font-black text-gray-900">{fine.amount}</span>
                  </TableCell>
                  <TableCell center>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${fine.status === "Unpaid"
                      ? "bg-red-500 text-white shadow-red-100"
                      : "bg-blue-50 text-blue-500 shadow-blue-50"
                      }`}>
                      {fine.status}
                    </span>
                  </TableCell>
                </tr>
              ))}
            </DataTable>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-gray-50/50 rounded-3xl p-8 border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-500 mt-1">
              <Info size={18} />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide">Understanding Your Fines</h4>
              <p className="text-xs font-semibold text-gray-500 leading-relaxed max-w-2xl">
                Late return fees are calculated at <span className="text-gray-900 font-black">Rs.10 per day</span> for standard items and <span className="text-gray-900 font-black">Rs.15.00 per day</span> for reserved or short-loan collections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};
