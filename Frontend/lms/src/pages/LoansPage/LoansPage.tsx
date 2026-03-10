import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleDot,
  Clock3,
  Download,
  RefreshCcw,
  Search,
  UserRound,
} from "lucide-react";
import { MainLayout } from "../../components/ui/layout/MainLayout";
import { Button } from "../../components/ui/Button/Button";
import { DataTable, TableCell } from "../../components/ui/Table/Table";
import { exportToCsv } from "../../utils/exportToCsv";
import { api } from "../../services/api";
import type { LoanResponse } from "../../services/api";
import { formatDateISO, formatRelativeTime, isOverdue } from "../../services/format";

export const LoansPage: React.FC = () => {
  const [actionMode, setActionMode] = useState<"issue" | "return">("issue");
  const [recordTab, setRecordTab] = useState<"all" | "active" | "overdue">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [loans, setLoans] = useState<LoanResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadLoans = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const loansPage = await api.getLoans({ page, size: pageSize, overdue: recordTab === "overdue" ? true : undefined });
        if (!isMounted) return;
        setLoans(loansPage.content);
        setTotalPages(loansPage.totalPages);
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
  }, [page, recordTab]);

  const loanRecords = useMemo(() => {
    return loans
      .filter((loan) => !loan.returnDate)
      .map((loan) => {
        const overdue = isOverdue(loan.dueDate, loan.returnDate);
        return {
          copyId: `CP-${loan.copyId}`,
          title: loan.bookTitle,
          member: loan.memberName,
          issuedOn: formatDateISO(loan.issueDate),
          dueDate: formatDateISO(loan.dueDate),
          status: overdue ? "Overdue" : "Active",
          statusType: overdue ? "overdue" : "active",
        };
      });
  }, [loans]);

  const recentActivities = useMemo(() => {
    return [...loans]
      .sort((a, b) => {
        const aTime = new Date(a.createdAt ?? a.issueDate).getTime();
        const bTime = new Date(b.createdAt ?? b.issueDate).getTime();
        return bTime - aTime;
      })
      .slice(0, 3)
      .map((loan) => ({
        book: loan.bookTitle,
        time: formatRelativeTime(loan.createdAt ?? loan.issueDate),
      }));
  }, [loans]);

  const filteredLoans = useMemo(() => {
    return loanRecords.filter((loan) => {
      const matchesTab =
        recordTab === "all" || loan.statusType === recordTab;

      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        loan.copyId.toLowerCase().includes(q) ||
        loan.title.toLowerCase().includes(q) ||
        loan.member.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [recordTab, search, loanRecords]);

  return (
    <MainLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Loan Operations</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage book issuances, returns, and overdue assets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <TopStat title="TOTAL ACTIVE" value={isLoading ? "—" : String(loanRecords.length)} icon={<CheckCircle2 size={14} />} />
            <TopStat
              title="OVERDUE"
              value={isLoading ? "—" : String(loanRecords.filter((loan) => loan.statusType === "overdue").length)}
              icon={<Clock3 size={14} />}
              danger
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-3 space-y-4">
            <section className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex bg-gray-50/80 p-1 rounded-lg border border-gray-100 mb-2">
                <button
                  className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-md text-sm font-medium transition-all ${actionMode === "issue"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                    }`}
                  onClick={() => setActionMode("issue")}
                  type="button"
                >
                  <CircleDot size={16} className={actionMode === "issue" ? "text-gray-700" : "text-gray-400"} />
                  Issue Book
                </button>
                <button
                  className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-md text-sm font-medium transition-all ${actionMode === "return"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                    }`}
                  onClick={() => setActionMode("return")}
                  type="button"
                >
                  <RefreshCcw size={16} className={actionMode === "return" ? "text-gray-700" : "text-gray-400"} />
                  Return Book
                </button>
              </div>

              {actionMode === "issue" ? (
                <form className="mt-4 space-y-3">
                  <Field label="Select Member">
                    <InputLike placeholder="Search by name or ID..." />
                  </Field>

                  <Field label="Select Book Copy">
                    <InputLike placeholder="Enter Copy ID (e.g. CP-100)..." />
                  </Field>

                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Issue Date">
                      <InputLike type="date" />
                    </Field>
                    <Field label="Loan Period (Days)">
                      <InputLike type="number" placeholder="14" />
                    </Field>
                  </div>

                  <div className="rounded-md bg-blue-50 border border-blue-100 p-2.5 text-xs text-gray-600 space-y-1">
                    <p className="flex justify-between">
                      <span>Calculated Due Date:</span>
                      <span className="font-semibold text-gray-900">Mar 3, 2026</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Member Eligibility:</span>
                      <span className="font-semibold text-gray-900">Valid (0 Overdue)</span>
                    </p>
                  </div>

                  <Button className="w-full">
                    Complete Issuance
                  </Button>
                </form>
              ) : (
                <form className="mt-4 space-y-3">
                  <Field label="Member / Copy ID">
                    <InputLike placeholder="Search by member name, ID, or copy ID..." />
                  </Field>

                  <Field label="Remarks">
                    <textarea
                      rows={3}
                      placeholder="Add optional return remarks..."
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                    />
                  </Field>

                  <Button className="w-full">
                    Complete Return
                  </Button>
                </form>
              )}
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Recent Activities
              </h3>
              <div className="mt-3 divide-y divide-gray-100">
                {isLoading ? (
                  <div className="py-2 text-sm text-gray-400 italic">Loading activity...</div>
                ) : error ? (
                  <div className="py-2 text-sm text-red-500 italic">{error}</div>
                ) : (
                  recentActivities.map((activity) => (
                    <div
                      key={`${activity.book}-${activity.time}`}
                      className="py-2 flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-800">{activity.book}</span>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))
                )}
              </div>
              <button className="mt-3 text-xs text-blue-600 hover:underline">
                View full logs
              </button>
            </section>
          </div>

          <div className="xl:col-span-9">
            <section className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Loan Records</h2>
                  <p className="text-xs text-gray-500">
                    All currently outstanding loans in the system.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      className="h-9 w-52 rounded-md border border-gray-200 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                      placeholder="Search by member or copy ID..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <Button variant="outline"
                    onClick={() =>
                      exportToCsv(
                        `loans_${recordTab}`,
                        ["Copy ID", "Book Title", "Member", "Issued On", "Due Date", "Status"],
                        filteredLoans.map((l) => [l.copyId, l.title, l.member, l.issuedOn, l.dueDate, l.status])
                      )
                    }
                  >
                    <Download size={14} />
                    Export Data
                  </Button>
                </div>
              </div>

              <div className="px-5 border-b border-gray-100">
                <div className="flex items-center gap-6 text-xs font-semibold uppercase tracking-wide">
                  <button
                    className={`h-10 border-b-2 ${recordTab === "all"
                      ? "text-blue-600 border-blue-500"
                      : "text-gray-400 border-transparent"
                      }`}
                    onClick={() => { setRecordTab("all"); setPage(0); }}
                  >
                    All Loans
                  </button>
                  <button
                    className={`h-10 border-b-2 ${recordTab === "active"
                      ? "text-blue-600 border-blue-500"
                      : "text-gray-400 border-transparent"
                      }`}
                    onClick={() => { setRecordTab("active"); setPage(0); }}
                  >
                    Active Loans
                  </button>
                  <button
                    className={`h-10 border-b-2 ${recordTab === "overdue"
                      ? "text-blue-600 border-blue-500"
                      : "text-gray-400 border-transparent"
                      }`}
                    onClick={() => { setRecordTab("overdue"); setPage(0); }}
                  >
                    Overdue Loans
                  </button>
                </div>
              </div>

              <DataTable headers={["Book / Copy ID", "Member", "Issued", "Due Date", "Status"]}>
                {isLoading ? (
                  <tr>
                    <TableCell colSpan={5} center>
                      <div className="py-10 text-gray-400 italic">Loading loans...</div>
                    </TableCell>
                  </tr>
                ) : error ? (
                  <tr>
                    <TableCell colSpan={5} center>
                      <div className="py-10 text-red-500 italic">{error}</div>
                    </TableCell>
                  </tr>
                ) : (
                  filteredLoans.map((loan) => (
                    <tr key={`${loan.copyId}-${loan.member}`} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell>
                        <p className="font-bold text-gray-900">{loan.title}</p>
                        <p className="text-xs font-mono text-gray-400 mt-0.5">{loan.copyId}</p>
                      </TableCell>
                      <TableCell center>
                        <div className="inline-flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 inline-flex items-center justify-center">
                            <UserRound size={12} />
                          </span>
                          <span className="text-sm text-gray-800">{loan.member}</span>
                        </div>
                      </TableCell>
                      <TableCell center>
                        <span className="text-gray-700">{loan.issuedOn}</span>
                      </TableCell>
                      <TableCell center>
                        <span className={loan.statusType === "overdue" ? "text-red-600 font-black" : "text-gray-700"}>
                          {loan.dueDate}
                        </span>
                      </TableCell>
                      <TableCell center>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black ${loan.statusType === "overdue" ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-700"
                          }`}>
                          {loan.statusType === "overdue" ? <RefreshCcw size={11} /> : <Clock3 size={11} />}
                          {loan.status}
                        </span>
                      </TableCell>
                    </tr>
                  ))
                )}
              </DataTable>

              <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <p>Page {page + 1} of {totalPages}</p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className="h-8 px-3 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(page + 1)}
                    className="h-8 px-3 rounded border border-gray-200 bg-white hover:bg-gray-50 font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const TopStat = ({
  title,
  value,
  icon,
  danger = false,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  danger?: boolean;
}) => (
  <div
    className={`rounded-xl border px-4 py-3 min-w-36 ${danger ? "border-red-200 bg-red-50" : "border-gray-200 bg-white"
      }`}
  >
    <p
      className={`text-[10px] font-semibold uppercase tracking-wide ${danger ? "text-red-500" : "text-gray-400"
        } inline-flex items-center gap-1`}
    >
      {icon}
      {title}
    </p>
    <p className={`text-3xl font-bold mt-1 ${danger ? "text-red-600" : "text-gray-900"}`}>
      {value}
    </p>
  </div>
);

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <label className="text-xs font-semibold text-gray-700">{label}</label>
    {children}
  </div>
);

const InputLike = ({
  type = "text",
  placeholder,
}: {
  type?: string;
  placeholder?: string;
}) => (
  <div className="relative">
    {type === "text" ? (
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
    ) : null}
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full h-10 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 ${type === "text" ? "pl-8 pr-3" : "px-3"
        }`}
    />
  </div>
);
