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
import {
  formatDateISO,
  formatRelativeTime,
  isOverdue,
} from "../../services/format";
import { useDebounce } from "../../hooks/useDebounce";

export const LoansPage: React.FC = () => {
  const [actionMode, setActionMode] = useState<"issue" | "return">("issue");
  const [recordTab, setRecordTab] = useState<"all" | "active" | "overdue">(
    "all",
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [loans, setLoans] = useState<LoanResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [refreshCounter, setRefreshCounter] = useState(0);
  const [issueForm, setIssueForm] = useState({
    memberId: "",
    copyId: "",
    issueDate: new Date().toISOString().split("T")[0],
    loanPeriodDays: "14",
  });
  const [returnForm, setReturnForm] = useState({ copyId: "", remarks: "" });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedSearch = useDebounce(search);

  const mapLoanRecords = (loanList: LoanResponse[]) => {
    return loanList.map((loan) => {
      const overdue = isOverdue(loan.dueDate, loan.returnDate);
      const returned = !!loan.returnDate;
      return {
        copyId: `CP-${loan.copyId}`,
        title: loan.bookTitle,
        member: loan.memberName,
        issuedOn: formatDateISO(loan.issueDate),
        dueDate: formatDateISO(loan.dueDate),
        status: returned ? "Returned" : overdue ? "Overdue" : "Active",
        statusType: returned ? "returned" : overdue ? "overdue" : "active",
      };
    });
  };

  useEffect(() => {
    let isMounted = true;
    const loadLoans = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const loansPage = await api.getLoans({
          page,
          size: pageSize,
          overdue: recordTab === "overdue" ? true : undefined,
          active: recordTab === "active" ? true : undefined,
        });
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
  }, [page, pageSize, recordTab, refreshCounter]);

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (
      !issueForm.memberId ||
      !issueForm.copyId ||
      !issueForm.issueDate ||
      !issueForm.loanPeriodDays
    ) {
      setFormError("All fields are required.");
      return;
    }
    const copyIdNum = issueForm.copyId.toUpperCase().replace("CP-", "");
    setIsSubmitting(true);
    try {
      await api.createLoan({
        memberId: parseInt(issueForm.memberId),
        copyId: parseInt(copyIdNum),
        issueDate: issueForm.issueDate,
        loanPeriodDays: parseInt(issueForm.loanPeriodDays),
      });
      setIssueForm({
        memberId: "",
        copyId: "",
        issueDate: new Date().toISOString().split("T")[0],
        loanPeriodDays: "14",
      });
      setRefreshCounter((c) => c + 1);
    } catch (err: any) {
      setFormError(err.message || "Failed to issue book");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!returnForm.copyId) {
      setFormError("Copy ID is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const copyIdNum = returnForm.copyId.toUpperCase().replace("CP-", "");
      await api.returnLoanByCopy(parseInt(copyIdNum), returnForm.remarks);
      setReturnForm({ copyId: "", remarks: "" });
      setRefreshCounter((c) => c + 1);
    } catch (err: any) {
      setFormError(err.message || "Failed to return book");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calcDueDate = useMemo(() => {
    const d = new Date(issueForm.issueDate);
    if (isNaN(d.getTime())) return "Invalid Date";
    d.setDate(d.getDate() + parseInt(issueForm.loanPeriodDays || "0"));
    return d.toDateString();
  }, [issueForm.issueDate, issueForm.loanPeriodDays]);

  const loanRecords = useMemo(() => {
    return mapLoanRecords(loans);
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
      const q = debouncedSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        loan.copyId.toLowerCase().includes(q) ||
        loan.title.toLowerCase().includes(q) ||
        loan.member.toLowerCase().includes(q);

      return matchesSearch;
    });
  }, [debouncedSearch, loanRecords]);

  const handleExportLoans = async () => {
    try {
      const allLoans: LoanResponse[] = [];
      let currentPage = 0;
      let total = 1;
      while (currentPage < total) {
        const pageData = await api.getLoans({
          page: currentPage,
          size: pageSize,
          overdue: recordTab === "overdue" ? true : undefined,
          active: recordTab === "active" ? true : undefined,
        });
        allLoans.push(...pageData.content);
        total = pageData.totalPages;
        currentPage += 1;
      }
      const mapped = mapLoanRecords(allLoans).filter((loan) => {
        const q = debouncedSearch.toLowerCase().trim();
        if (!q) return true;
        return (
          loan.copyId.toLowerCase().includes(q) ||
          loan.title.toLowerCase().includes(q) ||
          loan.member.toLowerCase().includes(q)
        );
      });
      exportToCsv(
        `loans_${recordTab}`,
        ["Copy ID", "Book Title", "Member", "Issued On", "Due Date", "Status"],
        mapped.map((l) => [
          l.copyId,
          l.title,
          l.member,
          l.issuedOn,
          l.dueDate,
          l.status,
        ]),
      );
    } catch (err) {
      console.error("Failed to export loans", err);
      window.alert("Unable to export loans right now.");
    }
  };

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
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Loan Operations
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage book issuances, returns, and overdue assets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <TopStat
              title="TOTAL ACTIVE"
              value={isLoading ? "—" : String(loanRecords.length)}
              icon={<CheckCircle2 size={14} />}
            />
            <TopStat
              title="OVERDUE"
              value={
                isLoading
                  ? "—"
                  : String(
                      loanRecords.filter(
                        (loan) => loan.statusType === "overdue",
                      ).length,
                    )
              }
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
                  className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-md text-sm font-medium transition-all ${
                    actionMode === "issue"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                  }`}
                  onClick={() => {
                    setActionMode("issue");
                    setFormError("");
                  }}
                  type="button"
                >
                  <CircleDot
                    size={16}
                    className={
                      actionMode === "issue" ? "text-gray-700" : "text-gray-400"
                    }
                  />
                  Issue Book
                </button>
                <button
                  className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-md text-sm font-medium transition-all ${
                    actionMode === "return"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                  }`}
                  onClick={() => {
                    setActionMode("return");
                    setFormError("");
                  }}
                  type="button"
                >
                  <RefreshCcw
                    size={16}
                    className={
                      actionMode === "return"
                        ? "text-gray-700"
                        : "text-gray-400"
                    }
                  />
                  Return Book
                </button>
              </div>

              {actionMode === "issue" ? (
                <form className="mt-4 space-y-3" onSubmit={handleIssue}>
                  {formError && (
                    <div className="text-red-600 bg-red-50 p-2 rounded text-xs">
                      {formError}
                    </div>
                  )}
                  <Field label="Member ID">
                    <InputLike
                      placeholder="Enter Member ID..."
                      value={issueForm.memberId}
                      onChange={(e) =>
                        setIssueForm((f) => ({
                          ...f,
                          memberId: e.target.value,
                        }))
                      }
                    />
                  </Field>

                  <Field label="Book Copy ID">
                    <InputLike
                      placeholder="Enter Copy ID (e.g. 100)..."
                      value={issueForm.copyId}
                      onChange={(e) =>
                        setIssueForm((f) => ({ ...f, copyId: e.target.value }))
                      }
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Issue Date">
                      <InputLike
                        type="date"
                        value={issueForm.issueDate}
                        onChange={(e) =>
                          setIssueForm((f) => ({
                            ...f,
                            issueDate: e.target.value,
                          }))
                        }
                      />
                    </Field>
                    <Field label="Loan Period (Days)">
                      <InputLike
                        type="number"
                        placeholder="14"
                        value={issueForm.loanPeriodDays}
                        onChange={(e) =>
                          setIssueForm((f) => ({
                            ...f,
                            loanPeriodDays: e.target.value,
                          }))
                        }
                      />
                    </Field>
                  </div>

                  <div className="rounded-md bg-blue-50 border border-blue-100 p-2.5 text-xs text-gray-600 space-y-1">
                    <p className="flex justify-between">
                      <span>Calculated Due Date:</span>
                      <span className="font-semibold text-gray-900">
                        {calcDueDate}
                      </span>
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Complete Issuance"}
                  </Button>
                </form>
              ) : (
                <form className="mt-4 space-y-3" onSubmit={handleReturn}>
                  {formError && (
                    <div className="text-red-600 bg-red-50 p-2 rounded text-xs">
                      {formError}
                    </div>
                  )}
                  <Field label="Book Copy ID">
                    <InputLike
                      placeholder="Enter Copy ID (e.g. 100)..."
                      value={returnForm.copyId}
                      onChange={(e) =>
                        setReturnForm((f) => ({ ...f, copyId: e.target.value }))
                      }
                    />
                  </Field>

                  <Field label="Remarks">
                    <textarea
                      rows={3}
                      placeholder="Add optional return remarks..."
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                      value={returnForm.remarks}
                      onChange={(e) =>
                        setReturnForm((f) => ({
                          ...f,
                          remarks: e.target.value,
                        }))
                      }
                    />
                  </Field>

                  <Button
                    className="w-full"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Complete Return"}
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
                  <div className="py-2 text-sm text-gray-400 italic">
                    Loading activity...
                  </div>
                ) : error ? (
                  <div className="py-2 text-sm text-red-500 italic">
                    {error}
                  </div>
                ) : (
                  recentActivities.map((activity) => (
                    <div
                      key={`${activity.book}-${activity.time}`}
                      className="py-2 flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-800">{activity.book}</span>
                      <span className="text-xs text-gray-500">
                        {activity.time}
                      </span>
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
                  <h2 className="text-lg font-semibold text-gray-900">
                    Loan Records
                  </h2>
                  <p className="text-xs text-gray-500">
                    All loans in the system.
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

                  <Button
                    variant="outline"
                    onClick={handleExportLoans}
                  >
                    <Download size={14} />
                    Export Data
                  </Button>
                </div>
              </div>

              <div className="px-5 border-b border-gray-100">
                <div className="flex items-center gap-6 text-xs font-semibold uppercase tracking-wide">
                  <button
                    className={`h-10 border-b-2 ${
                      recordTab === "all"
                        ? "text-blue-600 border-blue-500"
                        : "text-gray-400 border-transparent"
                    }`}
                    onClick={() => {
                      setRecordTab("all");
                      setPage(0);
                    }}
                  >
                    All Loans
                  </button>
                  <button
                    className={`h-10 border-b-2 ${
                      recordTab === "active"
                        ? "text-blue-600 border-blue-500"
                        : "text-gray-400 border-transparent"
                    }`}
                    onClick={() => {
                      setRecordTab("active");
                      setPage(0);
                    }}
                  >
                    Active Loans
                  </button>
                  <button
                    className={`h-10 border-b-2 ${
                      recordTab === "overdue"
                        ? "text-blue-600 border-blue-500"
                        : "text-gray-400 border-transparent"
                    }`}
                    onClick={() => {
                      setRecordTab("overdue");
                      setPage(0);
                    }}
                  >
                    Overdue Loans
                  </button>
                </div>
              </div>

              <DataTable
                headers={[
                  "Book / Copy ID",
                  "Member",
                  "Issued",
                  "Due Date",
                  "Status",
                ]}
              >
                {isLoading ? (
                  <tr>
                    <TableCell colSpan={5} center>
                      <div className="py-10 text-gray-400 italic">
                        Loading loans...
                      </div>
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
                        <tr
                          key={`${loan.copyId}-${loan.member}`}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                      <TableCell>
                        <p className="font-bold text-gray-900">{loan.title}</p>
                        <p className="text-xs font-mono text-gray-400 mt-0.5">
                          {loan.copyId}
                        </p>
                      </TableCell>
                      <TableCell center>
                        <div className="inline-flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 inline-flex items-center justify-center">
                            <UserRound size={12} />
                          </span>
                          <span className="text-sm text-gray-800">
                            {loan.member}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell center>
                        <span className="text-gray-700">{loan.issuedOn}</span>
                      </TableCell>
                      <TableCell center>
                        <span
                          className={
                            loan.statusType === "overdue"
                              ? "text-red-600 font-black"
                              : "text-gray-700"
                          }
                        >
                          {loan.dueDate}
                        </span>
                      </TableCell>
                      <TableCell center>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black ${
                            loan.statusType === "overdue"
                              ? "bg-red-50 text-red-700"
                              : loan.statusType === "returned"
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {loan.statusType === "overdue" ? (
                            <RefreshCcw size={11} />
                          ) : loan.statusType === "returned" ? (
                            <CheckCircle2 size={11} />
                          ) : (
                            <Clock3 size={11} />
                          )}
                          {loan.status}
                        </span>
                      </TableCell>
                    </tr>
                  ))
                )}
              </DataTable>

              <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <p>
                  Page {page + 1} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
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
    className={`rounded-xl border px-4 py-3 min-w-36 ${
      danger ? "border-red-200 bg-red-50" : "border-gray-200 bg-white"
    }`}
  >
    <p
      className={`text-[10px] font-semibold uppercase tracking-wide ${
        danger ? "text-red-500" : "text-gray-400"
      } inline-flex items-center gap-1`}
    >
      {icon}
      {title}
    </p>
    <p
      className={`text-3xl font-bold mt-1 ${danger ? "text-red-600" : "text-gray-900"}`}
    >
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
  value,
  onChange,
}: {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
      value={value}
      onChange={onChange}
      className={`w-full h-10 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 ${
        type === "text" ? "pl-8 pr-3" : "px-3"
      }`}
    />
  </div>
);
