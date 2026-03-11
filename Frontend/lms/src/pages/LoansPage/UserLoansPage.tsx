import React, { useEffect, useMemo, useState } from "react";
import { UserLayout } from "../../components/ui/layout/UserLayout";
import { Book, AlertCircle, Clock, History } from "lucide-react";
import { DataTable, TableCell } from "../../components/ui/Table/Table";
import { StatCard } from "../../components/ui/StatCard/StatCard";
import { SearchBar } from "../../components/ui/SearchBar/SearchBar";
import { api } from "../../services/api";
import type { BookResponse, LoanResponse } from "../../services/api";
import { formatDateISO, isOverdue } from "../../services/format";
import { useDebounce } from "../../hooks/useDebounce";

export const UserLoansPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState<"active" | "history">("active");
  const [loans, setLoans] = useState<LoanResponse[]>([]);
  const [booksByTitle, setBooksByTitle] = useState<
    Record<string, BookResponse>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const debouncedSearch = useDebounce(searchQuery);

  useEffect(() => {
    let isMounted = true;
    const loadLoans = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [loansPage, books] = await Promise.all([
          api.getLoans({ page: 0, size: 200 }),
          api.getBooks(),
        ]);
        if (!isMounted) return;
        setLoans(loansPage.content);
        const byTitle = books.reduce<Record<string, BookResponse>>(
          (acc, book) => {
            acc[book.title] = book;
            return acc;
          },
          {},
        );
        setBooksByTitle(byTitle);
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to load loans", err);
        setError("Unable to load loans right now.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadLoans();
    return () => {
      isMounted = false;
    };
  }, []);

  const loanHistory = useMemo(() => {
    return loans.map((loan) => {
      const book = booksByTitle[loan.bookTitle];
      const overdue = isOverdue(loan.dueDate, loan.returnDate);
      const returned = !!loan.returnDate;
      return {
        id: `LOAN-${loan.loanId}`,
        title: loan.bookTitle,
        author: book?.author ?? "Unknown",
        checkoutDate: formatDateISO(loan.issueDate),
        dueDate: formatDateISO(loan.dueDate),
        returnedDate: loan.returnDate ? formatDateISO(loan.returnDate) : "-",
        status: returned ? "Returned" : overdue ? "Overdue" : "On Time",
      };
    });
  }, [loans, booksByTitle]);

  const activeCheckouts = useMemo(() => {
    return loanHistory.filter((loan) => loan.status !== "Returned");
  }, [loanHistory]);

  const recentlyReturned = useMemo(() => {
    return loans
      .filter((loan) => loan.returnDate)
      .sort((a, b) => {
        const aTime = new Date(a.returnDate ?? "").getTime();
        const bTime = new Date(b.returnDate ?? "").getTime();
        return bTime - aTime;
      })
      .slice(0, 3)
      .map((loan) => {
        const book = booksByTitle[loan.bookTitle];
        return {
          title: loan.bookTitle,
          author: book?.author ?? "Unknown",
          returnedDate: formatDateISO(loan.returnDate ?? ""),
        };
      });
  }, [loans, booksByTitle]);

  const filteredHistory = loanHistory.filter(
    (loan) =>
      loan.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      loan.author.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      loan.id.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const filteredActive = activeCheckouts.filter(
    (loan) =>
      loan.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      loan.author.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      loan.id.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const activeTotalPages = Math.max(
    1,
    Math.ceil(filteredActive.length / pageSize),
  );
  const historyTotalPages = Math.max(
    1,
    Math.ceil(filteredHistory.length / pageSize),
  );
  const paginatedActive = useMemo(() => {
    const start = page * pageSize;
    return filteredActive.slice(start, start + pageSize);
  }, [filteredActive, page, pageSize]);
  const paginatedHistory = useMemo(() => {
    const start = page * pageSize;
    return filteredHistory.slice(start, start + pageSize);
  }, [filteredHistory, page, pageSize]);

  const paginationItems = useMemo(() => {
    const totalPages = tab === "active" ? activeTotalPages : historyTotalPages;
    if (totalPages <= 1) return [0];
    const current = page;
    const last = totalPages - 1;
    const items: Array<number | "ellipsis"> = [];
    items.push(0);
    const start = Math.max(1, current - 1);
    const end = Math.min(last - 1, current + 1);
    if (start > 1) items.push("ellipsis");
    for (let i = start; i <= end; i += 1) {
      items.push(i);
    }
    if (end < last - 1) items.push("ellipsis");
    if (last > 0) items.push(last);
    return items;
  }, [page, tab, activeTotalPages, historyTotalPages]);

  return (
    <UserLayout>
      <div className=" mx-auto  space-y-10 animate-in fade-in duration-700">
        {/* Header with Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900">My Loans</h1>
            <p className="text-gray-500 text-sm font-medium mt-1">
              Manage your currently borrowed books and review your history.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Active"
            value={
              isLoading ? "—" : loans.filter((loan) => !loan.returnDate).length
            }
            subtitle="Books currently in your possession"
            icon={<Book size={24} />}
            color="blue"
          />
          <StatCard
            title="Overdue Loans"
            value={
              isLoading
                ? "—"
                : loans.filter((loan) =>
                    isOverdue(loan.dueDate, loan.returnDate),
                  ).length
            }
            subtitle="Require immediate attention"
            icon={<AlertCircle size={24} />}
            color="red"
          />
        </div>

        {/* Loan History / Active Checkouts */}
        <div className="space-y-4">
          <div className="flex items-center gap-6 text-xs font-semibold uppercase tracking-wide">
            <button
              className={`h-10 border-b-2 ${
                tab === "active"
                  ? "text-blue-600 border-blue-500"
                  : "text-gray-400 border-transparent"
              }`}
              onClick={() => {
                setTab("active");
                setPage(0);
              }}
            >
              Active Checkouts
            </button>
            <button
              className={`h-10 border-b-2 ${
                tab === "history"
                  ? "text-blue-600 border-blue-500"
                  : "text-gray-400 border-transparent"
              }`}
              onClick={() => {
                setTab("history");
                setPage(0);
              }}
            >
              Loan History
            </button>
          </div>
          <DataTable
            headers={
              tab === "active"
                ? ["Book Details", "Checkout Date", "Due Date", "Status"]
                : [
                    "Book Details",
                    "Checkout Date",
                    "Due Date",
                    "Returned",
                    "Status",
                  ]
            }
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {isLoading ? (
              <tr>
                <TableCell colSpan={tab === "active" ? 4 : 5} center>
                  <div className="py-8 text-gray-400 italic">
                    Loading loans...
                  </div>
                </TableCell>
              </tr>
            ) : error ? (
              <tr>
                <TableCell colSpan={tab === "active" ? 4 : 5} center>
                  <div className="py-8 text-red-500 italic">{error}</div>
                </TableCell>
              </tr>
            ) : (
              (tab === "active" ? paginatedActive : paginatedHistory).map(
                (loan) => (
                  <tr
                    key={loan.id}
                    className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <TableCell>
                      <p className="text-base font-black text-gray-900 leading-tight">
                        {loan.title}
                      </p>
                      <p className="text-xs text-gray-400 font-bold uppercase mt-1">
                        by {loan.author}
                      </p>
                      <p className="text-[10px] text-gray-300 font-bold mt-1 uppercase tracking-wider">
                        {loan.id}
                      </p>
                    </TableCell>
                    <TableCell center>
                      <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-700">
                        <Clock size={16} className="text-gray-400" />{" "}
                        {loan.checkoutDate}
                      </div>
                    </TableCell>
                    <TableCell center>
                      <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-700">
                        <Clock size={16} className="text-gray-400" />{" "}
                        {loan.dueDate}
                      </div>
                    </TableCell>
                    {tab === "history" && (
                      <TableCell center>
                        <div className="text-sm font-bold text-gray-700">
                          {loan.returnedDate}
                        </div>
                      </TableCell>
                    )}
                    <TableCell center>
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                          loan.status === "Overdue"
                            ? "bg-red-500 text-white shadow-md shadow-red-100"
                            : loan.status === "Returned"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {loan.status}
                      </span>
                    </TableCell>
                  </tr>
                ),
              )
            )}
          </DataTable>
          {(tab === "active" ? activeTotalPages : historyTotalPages) > 1 && (
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="h-8 px-3 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {paginationItems.map((item, idx) =>
                item === "ellipsis" ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                    …
                  </span>
                ) : (
                  <button
                    key={`page-${item}`}
                    onClick={() => setPage(item)}
                    className={`h-8 min-w-8 px-2 rounded border ${
                      item === page
                        ? "border-blue-200 bg-blue-50 text-blue-600 font-semibold"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item + 1}
                  </button>
                ),
              )}
              <button
                disabled={
                  page >=
                  (tab === "active" ? activeTotalPages : historyTotalPages) - 1
                }
                onClick={() => setPage(page + 1)}
                className="h-8 px-3 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Recently Returned & Policy */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-stretch">
          <div className="space-y-6 lg:col-span-3">
            <div className="flex items-center gap-3 px-2">
              <History size={20} className="text-blue-500" />
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-wide">
                Recently Returned
              </h3>
            </div>
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-sm text-gray-400 italic">
                  Loading returns...
                </div>
              ) : error ? (
                <div className="text-sm text-red-500 italic">{error}</div>
              ) : (
                recentlyReturned.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100">
                        <Book size={24} />
                      </div>
                      <div>
                        <p className="text-base font-black text-gray-900">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-400 font-bold mt-0.5">
                          by {item.author}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-wide">
                        Returned
                      </p>
                      <p className="text-sm font-bold text-gray-900 mt-1">
                        {item.returnedDate}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Library Policy Sidebar */}
          <div className="bg-blue-50/50 rounded-3xl p-10 border border-blue-100 flex flex-col items-center text-center h-full">
            <h3 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-wide">
              Library Policy
            </h3>
            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl border border-blue-50 text-left mb-10 shadow-sm">
              <div className="text-blue-500 mt-1">
                <Clock size={20} />
              </div>
              <p className="text-sm font-semibold text-gray-600 leading-relaxed">
                Overdue fines are calculated at{" "}
                <span className="text-blue-600 font-black">Rs. 10 per day</span>{" "}
                for general collection items.
              </p>
            </div>
            <a
              href="/Learn%20Tarento%20Course%20Content.pdf"
              download
              className="w-full py-5 bg-gray-900 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-gray-200 hover:bg-black transition-all text-center"
            >
              Read Full Handbook
            </a>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};
