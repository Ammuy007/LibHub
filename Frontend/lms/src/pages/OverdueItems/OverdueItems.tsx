import React, { useEffect, useMemo, useState } from "react";
import { MainLayout } from "../../components/ui/layout/MainLayout";
import { Button } from "../../components/ui/Button/Button";
import { SearchBar } from "../../components/ui/SearchBar/SearchBar";
import { DataTable, TableCell } from "../../components/ui/Table/Table";
import { exportToCsv } from "../../utils/exportToCsv";
import { Mail, Download, Book } from "lucide-react";
import { api } from "../../services/api";
import type {
  FineResponse,
  LoanResponse,
  MemberResponse,
} from "../../services/api";
import { formatDateISO, formatMemberId } from "../../services/format";
import { useDebounce } from "../../hooks/useDebounce";

export const OverdueItemsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [overdueLoans, setOverdueLoans] = useState<LoanResponse[]>([]);
  const [loanById, setLoanById] = useState<Record<number, LoanResponse>>({});
  const [fines, setFines] = useState<FineResponse[]>([]);
  const [membersById, setMembersById] = useState<
    Record<number, MemberResponse>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    let isMounted = true;
    const loadOverdues = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const allLoans: LoanResponse[] = [];
        let loanPage = 0;
        let loanTotal = 1;
        while (loanPage < loanTotal) {
          const loansPage = await api.getLoans({ page: loanPage, size: 200 });
          allLoans.push(...loansPage.content);
          loanTotal = loansPage.totalPages;
          loanPage += 1;
        }

        const allFines: FineResponse[] = [];
        let finePage = 0;
        let fineTotal = 1;
        while (finePage < fineTotal) {
          const finesPage = await api.getFines({ page: finePage, size: 200 });
          allFines.push(...finesPage.content);
          fineTotal = finesPage.totalPages;
          finePage += 1;
        }

        const allMembers: MemberResponse[] = [];
        let memberPage = 0;
        let memberTotal = 1;
        while (memberPage < memberTotal) {
          const membersPage = await api.getMembers({
            page: memberPage,
            size: 200,
          });
          allMembers.push(...membersPage.content);
          memberTotal = membersPage.totalPages;
          memberPage += 1;
        }

        if (!isMounted) return;
        const today = toDateOnly(new Date().toISOString());
        const overdueOnly = allLoans.filter((loan) => {
          if (loan.returnDate) return false;
          const dueDate = toDateOnly(loan.dueDate);
          if (!dueDate || !today) return false;
          return dueDate.getTime() < today.getTime();
        });
        setOverdueLoans(overdueOnly);
        const loanMap = allLoans.reduce<Record<number, LoanResponse>>(
          (acc, loan) => {
            acc[loan.loanId] = loan;
            return acc;
          },
          {},
        );
        setLoanById(loanMap);
        setFines(allFines);
        const byId = allMembers.reduce<Record<number, MemberResponse>>(
          (acc, m) => {
            acc[m.id] = m;
            return acc;
          },
          {},
        );
        setMembersById(byId);
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
  }, []);

  const toDateOnly = (value?: string | null) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const overdueData = useMemo(() => {
    const loanItems = overdueLoans.map((loan) => {
      const dueDate = toDateOnly(loan.dueDate);
      const today = toDateOnly(new Date().toISOString());
      const diffDays =
        dueDate && today
          ? Math.floor(
              (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24),
            )
          : 0;
      const daysOverdue = Math.max(0, diffDays);
      const member = membersById[loan.memberId];
      return {
        type: "loan" as const,
        id: `L-${loan.loanId}`,
        memberId: formatMemberId(loan.memberId, member?.membershipStart),
        member: loan.memberName,
        memberIdRaw: loan.memberId,
        book: loan.bookTitle,
        dueDate: formatDateISO(loan.dueDate),
        daysOverdue,
        fine: daysOverdue * 10,
        reason: "Overdue Loan",
        status: "Overdue",
      };
    });

    const fineItems = fines.map((fine) => {
      const loan = loanById[fine.loanId];
      const member = membersById[fine.memberId];
      return {
        type: "fine" as const,
        id: `F-${fine.fineId}`,
        memberId: formatMemberId(fine.memberId, member?.membershipStart),
        member: fine.memberName ?? "-",
        memberIdRaw: fine.memberId,
        book: loan?.bookTitle ?? "-",
        dueDate: "-",
        daysOverdue: 0,
        fine: fine.amount ?? 0,
        reason: fine.reason ?? "Fine",
        status: fine.status ?? "-",
      };
    });

    return [...loanItems, ...fineItems];
  }, [overdueLoans, fines, membersById, loanById]);

  const filteredData = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    if (!q) return overdueData;
    return overdueData.filter(
      (item) =>
        item.member.toLowerCase().includes(q) ||
        item.memberId.toLowerCase().includes(q) ||
        item.book.toLowerCase().includes(q) ||
        item.reason.toLowerCase().includes(q),
    );
  }, [debouncedSearch, overdueData]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = page * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  const paginationItems = useMemo(() => {
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
  }, [page, totalPages]);

  return (
    <MainLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Overdue & Fines
            </h1>
            <p className="text-gray-500 font-medium">
              Overdue loans and fines combined.
            </p>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() =>
              exportToCsv(
                "overdue_loans_fines",
                [
                  "Member ID",
                  "Full Name",
                  "Book Title",
                  "Reason",
                  "Due Date",
                  "Days Overdue",
                  "Fine (Rs.)",
                  "Status",
                ],
                filteredData.map((item) => [
                  item.memberId,
                  item.member,
                  item.book,
                  item.reason,
                  item.dueDate,
                  String(item.daysOverdue),
                  String(item.fine),
                  item.status,
                ]),
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
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
          </div>

          <DataTable
            headers={[
              "Member ID",
              "Full Name",
              "Book Title",
              "Reason",
              "Due Date",
              "Days Overdue",
              "Total Fine",
              "Actions",
            ]}
          >
            {isLoading ? (
              <tr>
                <TableCell colSpan={9} center>
                  <div className="py-10 text-gray-400 italic">
                    Loading overdue items...
                  </div>
                </TableCell>
              </tr>
            ) : error ? (
              <tr>
                <TableCell colSpan={9} center>
                  <div className="py-10 text-red-500 italic">{error}</div>
                </TableCell>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell center>
                    <span className="text-xs font-mono font-bold text-gray-400">
                      {item.memberId}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="font-bold text-gray-900">
                      {item.member}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Book size={14} className="text-gray-400" />
                      <span className="font-semibold text-gray-700">
                        {item.book}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell center>
                    <span className="text-sm text-gray-600">{item.reason}</span>
                  </TableCell>

                  <TableCell center>
                    <span className="text-sm text-gray-500">
                      {item.dueDate}
                    </span>
                  </TableCell>

                  <TableCell center>
                    <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-black">
                      {item.daysOverdue} Days
                    </span>
                  </TableCell>

                  <TableCell center>
                    <span className="font-black text-gray-900">
                      Rs.{item.fine}
                    </span>
                  </TableCell>

                  <TableCell center>
                    <button
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all active:scale-95"
                      onClick={async () => {
                        try {
                          await api.sendOverdueEmail({
                            memberId: item.memberIdRaw,
                            memberName: item.member,
                            bookTitle:
                              item.book !== "-" ? item.book : undefined,
                            dueDate:
                              item.dueDate !== "-" ? item.dueDate : undefined,
                            daysOverdue: item.daysOverdue,
                            fineAmount: item.fine,

                            reason: item.reason,
                          });
                          window.alert("Email sent.");
                        } catch (err) {
                          console.error("Failed to send email", err);
                          window.alert("Unable to send email right now.");
                        }
                      }}
                    >
                      <Mail size={14} /> Send Email
                    </button>
                  </TableCell>
                </tr>
              ))
            ) : (
              <tr>
                <TableCell colSpan={9} center>
                  <div className="py-10 text-gray-400 italic">
                    No overdue items match your search.
                  </div>
                </TableCell>
              </tr>
            )}
          </DataTable>

          {/* Pagination Footer */}
          <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-gray-500 border-t pt-5">
            <p>
              Page {page + 1} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="h-8 px-3 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
