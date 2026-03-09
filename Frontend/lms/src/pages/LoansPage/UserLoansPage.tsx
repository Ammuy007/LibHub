import React, { useState } from "react";
import { UserLayout } from "../../components/ui/layout/UserLayout";
import {
    Book,
    AlertCircle,
    Clock,
    History,
} from "lucide-react";
import { DataTable, TableCell } from "../../components/ui/Table/Table";
import { StatCard } from "../../components/ui/StatCard/StatCard";
import { SearchBar } from "../../components/ui/SearchBar/SearchBar";

export const UserLoansPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const activeCheckouts = [
        { id: "LOAN-7721", title: "The Design of Everyday Things", author: "Don Norman", checkoutDate: "Oct 12, 2023", dueDate: "Oct 26, 2023", status: "On Time" },
        { id: "LOAN-8842", title: "Clean Code: A Handbook of Agile Software Craftsmanship", author: "Robert C. Martin", checkoutDate: "Sep 28, 2023", dueDate: "Oct 12, 2023", status: "Overdue" },
        { id: "LOAN-9910", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", checkoutDate: "Oct 05, 2023", dueDate: "Oct 19, 2023", status: "On Time" },
        { id: "LOAN-4411", title: "Atomic Habits", author: "James Clear", checkoutDate: "Oct 15, 2023", dueDate: "Oct 29, 2023", status: "On Time" },
        { id: "LOAN-5562", title: "Harry Potter: The Chamber of Secrets", author: "JK Rowling", checkoutDate: "Sep 28, 2024", dueDate: "Oct 12, 2024", status: "Overdue" },
    ];

    const recentlyReturned = [
        { title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", returnedDate: "Sep 15, 2023", rating: 5 },
        { title: "The Lean Startup", author: "Eric Ries", returnedDate: "Aug 22, 2023", rating: 4 },
        { title: "Dune", author: "Frank Herbert", returnedDate: "Jul 10, 2023", rating: 5 },
    ];

    const filteredActive = activeCheckouts.filter(loan =>
        loan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredReturned = recentlyReturned.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <UserLayout>
            <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-700">

                {/* Header with Search */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">My Loans</h1>
                        <p className="text-gray-500 text-sm font-medium mt-1">Manage your currently borrowed books and review your history.</p>
                    </div>
                    {/* //border for search bar */}
                    <div className="border border-gray-200 rounded-xl p-1">
                        <SearchBar
                            placeholder="Search by title, author or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            containerClassName="w-full md:w-96"
                        />
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Active"
                        value={5}
                        subtitle="Books currently in your possession"
                        icon={<Book size={24} />}
                        color="blue"
                    />
                    <StatCard
                        title="Overdue Loans"
                        value={1}
                        subtitle="Require immediate attention"
                        icon={<AlertCircle size={24} />}
                        color="red"
                    />

                </div>

                {/* Active Checkouts Table */}
                <div className="space-y-4">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-wide">Active Checkouts</h3>
                    <DataTable headers={["Book Details", "Checkout Date", "Due Date", "Status"]} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {filteredActive.map((loan) => (
                            <tr key={loan.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                                <TableCell>
                                    <p className="text-base font-black text-gray-900 leading-tight">{loan.title}</p>
                                    <p className="text-xs text-gray-400 font-bold uppercase mt-1">by {loan.author}</p>
                                    <p className="text-[10px] text-gray-300 font-bold mt-1 uppercase tracking-wider">{loan.id}</p>
                                </TableCell>
                                <TableCell center>
                                    <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-700">
                                        <Clock size={16} className="text-gray-400" /> {loan.checkoutDate}
                                    </div>
                                </TableCell>
                                <TableCell center>
                                    <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-700">
                                        <Clock size={16} className="text-gray-400" /> {loan.dueDate}
                                    </div>
                                </TableCell>
                                <TableCell center>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${loan.status === 'Overdue'
                                        ? 'bg-red-500 text-white shadow-md shadow-red-100'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {loan.status}
                                    </span>
                                </TableCell>
                            </tr>
                        ))}
                    </DataTable>
                </div>

                {/* Recently Returned & Policy */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <History size={20} className="text-blue-500" />
                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-wide">Recently Returned</h3>
                        </div>
                        <div className="space-y-4">
                            {filteredReturned.map((item, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100">
                                            <Book size={24} />
                                        </div>
                                        <div>
                                            <p className="text-base font-black text-gray-900">{item.title}</p>
                                            <p className="text-sm text-gray-400 font-bold mt-0.5">by {item.author}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-wide">Returned</p>
                                        <p className="text-sm font-bold text-gray-900 mt-1">{item.returnedDate}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Library Policy Sidebar */}
                    <div className="bg-blue-50/50 rounded-3xl p-10 border border-blue-100 flex flex-col items-center text-center">
                        <h3 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-wide">Library Policy</h3>
                        <div className="flex items-start gap-4 bg-white p-6 rounded-2xl border border-blue-50 text-left mb-10 shadow-sm">
                            <div className="text-blue-500 mt-1"><Clock size={20} /></div>
                            <p className="text-sm font-semibold text-gray-600 leading-relaxed">
                                Overdue fines are calculated at <span className="text-blue-600 font-black">Rs. 10 per day</span> for general collection items.
                            </p>
                        </div>
                        <button className="w-full py-5 bg-gray-900 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-gray-200 hover:bg-black transition-all">
                            Read Full Handbook
                        </button>
                    </div>
                </div>

            </div>
        </UserLayout>
    );
};