import React from "react";
import { useState } from "react";
import { MainLayout } from "../../components/ui/layout/MainLayout";
import { Card } from "../../components/ui/Card/Card";
import { DateFilterModal } from "../../components/modals/DateFilterModal/DateFilterModal";
import {
  BarChart3,
  Users,
  BookOpen,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  TrendingUp,
  AlertCircle,
  PieChart as PieIcon,
  ChevronRight,
} from "lucide-react";
import { api } from "../../services/api";

export const ReportsPage: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [reportDate, setReportDate] = useState({
    month: new Date().getMonth() + 1, // 1-indexed for backend
    year: new Date().getFullYear(),
  });
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.getReport({
          month: reportDate.month,
          year: reportDate.year,
        });
        setData(res);
      } catch (err) {
        console.error("Failed to fetch report", err);
        setError("Failed to load analytics data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [reportDate]);

  const handleApplyFilter = (month: number, year: number) => {
    setReportDate({ month: month + 1, year }); // Modal might be 0-indexed
    setIsFilterOpen(false);
  };
  return (
    <MainLayout>
      <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Analytics
            </h1>
            {/* 3. Show current filter status */}
          </div>
          <div className="flex gap-3">
            {/* 4. Update Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:shadow-sm transition-all active:scale-95"
            >
              <Filter size={18} /> Filter
            </button>
          </div>
        </div>

        {/* Top Mini-Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ReportMiniCard
            title="Book Circulation"
            value={
              isLoading ? "..." : (data?.totalLoans?.toLocaleString() ?? "0")
            }
            trend="Total Loans"
            isUp={true}
            icon={<BookOpen className="text-blue-600" />}
          />
          <ReportMiniCard
            title="New Members"
            value={isLoading ? "..." : (data?.newMembers ?? "0")}
            trend="This Month"
            isUp={true}
            icon={<Users className="text-purple-600" />}
          />
          <ReportMiniCard
            title="Fine Collection"
            value={isLoading ? "..." : `Rs.${data?.totalFinesCollected ?? 0}`}
            trend="Collected"
            isUp={true}
            icon={<BarChart3 className="text-green-600" />}
          />
          <ReportMiniCard
            title="Avg. Overdue"
            value={
              isLoading
                ? "..."
                : `${data?.averageOverdueDays?.toFixed(1) ?? 0} Days`
            }
            trend="Target < 5d"
            isUp={data?.averageOverdueDays < 5}
            icon={<Clock className="text-orange-600" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left: Popular Genres (Side-by-Side Layout) */}
          {/* Left: Popular Genres (Side-by-Side Layout) */}
          <Card className="xl:col-span-5 p-8 border-gray-100 shadow-sm flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <PieIcon className="text-blue-600" size={20} />
                <h2 className="text-xl font-bold text-gray-900">
                  Popular Genres
                </h2>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 italic">
                  Loading genres...
                </div>
              ) : (
                <div className="flex flex-row items-center justify-between gap-8">
                  <div className="relative w-56 h-56 shrink-0 flex items-center justify-center">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          isLoading || !data?.topCategories
                            ? "#f3f4f6"
                            : (() => {
                                let currentPos = 0;
                                const colors = [
                                  "#2563eb",
                                  "#a855f7",
                                  "#4ade80",
                                  "#fb923c",
                                  "#ec4899",
                                  "#94a3b8",
                                ];
                                const totalIssues = data.topCategories.reduce(
                                  (sum: number, cat: any) => sum + cat.count,
                                  0,
                                );
                                const segments = data.topCategories.map(
                                  (cat: any, i: number) => {
                                    const percent =
                                      totalIssues > 0
                                        ? (cat.count / totalIssues) * 100
                                        : 0;
                                    const start = currentPos;
                                    currentPos += percent;
                                    const color = colors[i] || "#94a3b8";
                                    return `${color} ${start}% ${currentPos}%`;
                                  },
                                );

                                return `conic-gradient(${segments.join(", ") || "#f3f4f6 0% 100%"})`;
                              })(),
                      }}
                    />
                    <div className="absolute inset-[22px] bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                      <p className="text-3xl font-black text-gray-900">
                        {(() => {
                          const total = data?.topCategories?.reduce(
                            (sum: number, cat: any) => sum + cat.count,
                            0,
                          );
                          return total > 1000
                            ? `${(total / 1000).toFixed(1)}k`
                            : (total ?? 0);
                        })()}
                      </p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        Total Issues
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    {(() => {
                      const totalIssues = data.topCategories.reduce(
                        (sum: number, cat: any) => sum + cat.count,
                        0,
                      );
                      return data.topCategories.map((cat: any, i: number) => (
                        <GenreLegendItem
                          key={cat.category}
                          label={cat.category}
                          percent={`${totalIssues > 0 ? Math.round((cat.count / totalIssues) * 100) : 0}%`}
                          color={
                            [
                              "bg-blue-600",
                              "bg-purple-500",
                              "bg-green-400",
                              "bg-orange-400",
                              "bg-pink-400",
                              "bg-gray-400",
                            ][i] || "bg-gray-400"
                          }
                        />
                      ));
                    })()}
                  </div>
                </div>
              )}

              {/* Bottom Section: Fills the remaining space with actionable data */}
              <div className="mt-8 pt-6 border-t border-gray-50">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                  Collection Health
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-tighter mb-1">
                      Stock Utilization
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-xl font-bold text-gray-900">
                        {Math.round(data?.stockUtilization ?? 0)}%
                      </p>
                      <p className="text-[10px] font-medium text-blue-500 tracking-tight">
                        Active Loans
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50/50 rounded-2xl border border-green-100/50">
                    <p className="text-[9px] font-black text-green-600 uppercase tracking-tighter mb-1">
                      Return Rate
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-xl font-bold text-gray-900">
                        {Math.round(data?.returnRate ?? 0)}%
                      </p>
                      <p className="text-[10px] font-medium text-green-500 tracking-tight">
                        On-time
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Right: Fine & Overdue Analysis */}
          <Card className="xl:col-span-7 p-8 border-gray-100 shadow-sm flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                  <Clock size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Fine & Overdue Pulse
                </h2>
              </div>
              <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
                {isLoading ? "..." : `${data?.overdueCount ?? 0} Items Overdue`}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10 flex-1">
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Monthly Fine Goal
                  </p>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-black text-gray-900">
                      Rs.1,240
                    </p>
                    <div className="flex items-center text-xs font-bold text-green-500 mb-1">
                      <TrendingUp size={14} className="mr-1" /> 82%
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <ProgressBlock
                    label="Collected Fines"
                    amount={`Rs.${Math.round(data?.collectedFines ?? 0)}`}
                    percent={
                      data?.collectedFines + data?.pendingFines > 0
                        ? (data.collectedFines /
                            (data.collectedFines + data.pendingFines)) *
                          100
                        : 0
                    }
                    color="bg-blue-600"
                  />
                  <ProgressBlock
                    label="Pending (Unpaid)"
                    amount={`Rs.${Math.round(data?.pendingFines ?? 0)}`}
                    percent={
                      data?.collectedFines + data?.pendingFines > 0
                        ? (data.pendingFines /
                            (data.collectedFines + data.pendingFines)) *
                          100
                        : 0
                    }
                    color="bg-orange-500"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                  Overdue Duration
                </h3>
                <div className="space-y-5 flex-1">
                  <div className="space-y-5 flex-1">
                    <OverdueRow
                      label="1-3 Days"
                      count={data?.overdueDistribution?.["1-3 Days"] ?? 0}
                      color="bg-yellow-400"
                      total={data?.overdueCount || 1}
                    />
                    <OverdueRow
                      label="4-7 Days"
                      count={data?.overdueDistribution?.["4-7 Days"] ?? 0}
                      color="bg-orange-500"
                      total={data?.overdueCount || 1}
                    />
                    <OverdueRow
                      label="1-2 Weeks"
                      count={data?.overdueDistribution?.["1-2 Weeks"] ?? 0}
                      color="bg-red-500"
                      total={data?.overdueCount || 1}
                    />
                    <OverdueRow
                      label="2+ Weeks"
                      count={data?.overdueDistribution?.["2+ Weeks"] ?? 0}
                      color="bg-gray-900"
                      total={data?.overdueCount || 1}
                    />
                  </div>
                </div>
              </div>

              {/* Priority Follow-ups with Inline Button */}
              <div className="lg:col-span-2 pt-6 border-t border-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-500" />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Priority Follow-ups
                    </h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <PriorityItem
                    name="Ahmed Zayan"
                    book="Deep Work"
                    days={16}
                    fine="Rs.120"
                  />
                  <PriorityItem
                    name="Fathima Fidha"
                    book="Atomic Habits"
                    days={12}
                    fine="Rs.80"
                  />
                  <PriorityItem
                    name="Mohamed Yamin"
                    book="Clean Code"
                    days={10}
                    fine="Rs.60"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <DateFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilter}
        initialMonth={reportDate.month - 1}
        initialYear={reportDate.year}
      />
    </MainLayout>
  );
};

/* --- Helper Components --- */

const PriorityItem = ({ name, book, days, fine }: any) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-100 transition-colors group cursor-pointer">
    <div className="space-y-1">
      <p className="text-sm font-bold text-gray-900">{name}</p>
      <p className="text-[10px] text-gray-500 font-medium truncate w-24">
        {book}
      </p>
    </div>
    <div className="text-right">
      <p className="text-xs font-black text-red-600">{days}d</p>
      <p className="text-[9px] font-bold text-gray-400">{fine}</p>
    </div>
    <ChevronRight
      size={14}
      className="text-gray-300 group-hover:text-blue-500 transition-colors ml-1"
    />
  </div>
);

const ReportMiniCard = ({ title, value, trend, isUp, icon }: any) => (
  <Card className="p-6 border-gray-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start">
      <div className="p-2.5 bg-gray-50 rounded-xl">{icon}</div>
      <div
        className={`flex items-center text-xs font-bold ${isUp ? "text-green-500" : "text-red-500"}`}
      >
        {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{" "}
        {trend}
      </div>
    </div>
    <div className="mt-4">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
        {title}
      </p>
      <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
    </div>
  </Card>
);

const GenreLegendItem = ({ label, percent, color }: any) => (
  <div className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
    <div className="flex items-center gap-3">
      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-xs font-bold text-gray-600">{label}</span>
    </div>
    <span className="text-xs font-black text-gray-900">{percent}</span>
  </div>
);

const ProgressBlock = ({ label, amount, percent, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-xs font-bold text-gray-500">{label}</span>
      <span
        className={`text-xs font-black ${percent > 50 ? "text-blue-600" : "text-orange-600"}`}
      >
        {amount}
      </span>
    </div>
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full`}
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);

const OverdueRow = ({ label, count, color, total }: any) => (
  <div className="flex items-center gap-4">
    <div className="w-20 text-[10px] font-black text-gray-400 uppercase">
      {label}
    </div>
    <div className="flex-1 h-5 bg-gray-50 rounded-lg flex items-center px-1">
      <div
        className={`h-3 ${color} rounded-md transition-all duration-700`}
        style={{ width: `${(count / total) * 100}%` }}
      />
    </div>
    <div className="w-6 text-xs font-black text-gray-900 text-right">
      {count}
    </div>
  </div>
);
