import React, { useEffect, useMemo, useState } from "react";
import { MainLayout } from "../../components/ui/layout/MainLayout";
import { Button } from "../../components/ui/Button/Button";
import { SearchBar } from "../../components/ui/SearchBar/SearchBar";
import { DataTable, TableCell } from "../../components/ui/Table/Table";
import { exportToCsv } from "../../utils/exportToCsv";
import { Mail, Download, Book } from "lucide-react";
import { api } from "../../services/api";
import type { LoanResponse } from "../../services/api";
import { formatDateISO } from "../../services/format";

export const OverdueItemsPage: React.FC = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(10);
    const [overdueLoans, setOverdueLoans] = useState<LoanResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const loadOverdues = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const loansPage = await api.getLoans({ overdue: true, page, size: pageSize });
                if (!isMounted) return;
                setOverdueLoans(loansPage.content);
                setTotalPages(loansPage.totalPages);
            } catch (err) {
                if (!isMounted) return;
                console.error("Failed to load overdue loans", err);
                setError("Unable to load overdue loans.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadOverdues();
        return () => {
            isMounted = false;
        };
    }, [page]);

    const overdueData = useMemo(() => {
        return overdueLoans.map((loan) => {
            const dueDate = new Date(loan.dueDate);
            const daysOverdue = Math.max(0, Math.ceil((Date.now() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
            return {
                id: loan.loanId,
                memberId: `LIB-${loan.memberId}`,
                member: loan.memberName,
                book: loan.bookTitle,
                dueDate: formatDateISO(loan.dueDate),
                daysOverdue,
                fine: daysOverdue * 10,
            };
        });
    }, [overdueLoans]);

    const filteredData = useMemo(() => {
        const q = search.toLowerCase();
        if (!q) return overdueData;
        return overdueData.filter(
            (item) =>
                item.member.toLowerCase().includes(q) ||
                item.memberId.toLowerCase().includes(q) ||
                item.book.toLowerCase().includes(q)
        );
    }, [search, overdueData]);

    return (
        <MainLayout>
            <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 pb-12">

                {/* Header Section */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Overdue Loans</h1>
                        <p className="text-gray-500 font-medium">Active overdue loans and accumulated fines.</p>
                    </div>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() =>
                            exportToCsv(
                                "overdue_loans",
                                ["Member ID", "Full Name", "Book Title", "Due Date", "Days Overdue", "Fine (Rs.)"],
                                filteredData.map((item) => [
                                    item.memberId,
                                    item.member,
                                    item.book,
                                    item.dueDate,
                                    String(item.daysOverdue),
                                    String(item.fine),
                                ])
                            )
                        }
                    >
                        <Download size={18} /> Export List
                    </Button>
                </div>

                {/* Combined Section for Search and Table */}
                <section className="rounded-xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm">
                    <div className="mb-5">
                        <SearchBar
                            placeholder="Search by Member ID, Name, or Book Title..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                        />
                    </div>

                    <DataTable
                        headers={[
                            "Member ID",
                            "Full Name",
                            "Book Title",
                            "Due Date",
                            "Days Overdue",
                            "Total Fine",
                            "Actions"
                        ]}
                    >
                        {isLoading ? (
                            <tr>
                                <TableCell colSpan={7} center>
                                    <div className="py-10 text-gray-400 italic">Loading overdue loans...</div>
                                </TableCell>
                            </tr>
                        ) : error ? (
                            <tr>
                                <TableCell colSpan={7} center>
                                    <div className="py-10 text-red-500 italic">{error}</div>
                                </TableCell>
                            </tr>
                        ) : filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell center>
                                        <span className="text-xs font-mono font-bold text-gray-400">
                                            {item.memberId}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        <span className="font-bold text-gray-900">{item.member}</span>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Book size={14} className="text-gray-400" />
                                            <span className="font-semibold text-gray-700">{item.book}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell center>
                                        <span className="text-sm text-gray-500">{item.dueDate}</span>
                                    </TableCell>

                                    <TableCell center>
                                        <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-black">
                                            {item.daysOverdue} Days
                                        </span>
                                    </TableCell>

                                    <TableCell center>
                                        <span className="font-black text-gray-900">Rs.{item.fine}</span>
                                    </TableCell>

                                    <TableCell center>
                                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all active:scale-95">
                                            <Mail size={14} /> Send Email
                                        </button>
                                    </TableCell>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <TableCell colSpan={7} center>
                                    <div className="py-10 text-gray-400 italic">No overdue items match your search.</div>
                                </TableCell>
                            </tr>
                        )}
                    </DataTable>

                    {/* Pagination Footer */}
                    <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-gray-500 border-t pt-5">
                        <p>Page {page + 1} of {totalPages}</p>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                                className="h-8 px-3 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <button className="h-8 min-w-8 px-2 rounded border border-blue-200 bg-blue-50 text-blue-600 font-semibold">
                                {page + 1}
                            </button>
                            <button
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage(page + 1)}
                                className="h-8 px-3 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
};
