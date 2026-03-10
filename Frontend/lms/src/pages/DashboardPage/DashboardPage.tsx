import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../../components/ui/layout/MainLayout";
import { StatCard } from "../../components/ui/StatCard/StatCard";
import { Card } from "../../components/ui/Card/Card";
import { AddMemberModal } from "../../components/modals/QuickLinks/AddMemberModal/AddMemberModal";
import { AddBookModal } from "../../components/modals/QuickLinks/AddBookModal/AddBookModal";

import {
  Book,
  CheckCircle,
  ArrowUpRight,
  AlertCircle,
  Wallet,
  UserPlus,
  PlusCircle,
  BarChart3,
  ChevronRight,
  Eye,
} from "lucide-react";
import { api } from "../../services/api";
import type { LoanResponse } from "../../services/api";
import { formatRelativeTime } from "../../services/format";

export const DashboardPage: React.FC = () => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loans, setLoans] = useState<LoanResponse[]>([]);
  const [priorityFollowUps, setPriorityFollowUps] = useState<LoanResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadDashboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [statsResponse, loansPage, priorityResponse] = await Promise.all([
          api.getDashboardStats(),
          api.getLoans({ page: 0, size: 6 }), // For recent activity
          api.getPriorityFollowUps(),
        ]);
        if (!isMounted) return;
        setStats(statsResponse);
        setLoans(loansPage.content);
        setPriorityFollowUps(priorityResponse);
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to load dashboard data", err);
        setError("Unable to load dashboard data.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);


  const recentActivity = useMemo(() => {
    return [...loans]
      .sort((a, b) => {
        const aTime = new Date(a.createdAt ?? a.issueDate).getTime();
        const bTime = new Date(b.createdAt ?? b.issueDate).getTime();
        return bTime - aTime;
      })
      .slice(0, 6)
      .map((loan) => ({
        title: loan.bookTitle,
        user: loan.memberName,
        time: formatRelativeTime(loan.createdAt ?? loan.issueDate),
        status: loan.returnDate ? "Returned" : "Issued",
      }));
  }, [loans]);

  return (
    <MainLayout>
      <div className="max-w-[1600px] mx-auto space-y-8">

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900">Welcome!</h1>
          <p className="text-gray-500">
            Here is what's happening in the library today.
          </p>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 ">
          <StatCard
            title="Total Books"
            value={isLoading ? "—" : String(stats?.totalBooks ?? 0)}
            subtitle="Library collection size"
            icon={<Book size={20} />}
            color="blue"
          />
          <StatCard
            title="Copies Available"
            value={isLoading ? "—" : String(stats?.availableCopies ?? 0)}
            subtitle="Ready for checkout"
            icon={<CheckCircle size={20} />}
            color="green"
          />
          <StatCard
            title="Issued Books"
            value={isLoading ? "—" : String(stats?.issuedBooks ?? 0)}
            subtitle="Currently with members"
            icon={<ArrowUpRight size={20} />}
            color="orange"
          />
          <StatCard
            title="Overdue Loans"
            value={isLoading ? "—" : String(stats?.overdueLoans ?? 0)}
            subtitle={`${priorityFollowUps.length} priority items (>14d)`}
            icon={<AlertCircle size={20} />}
            color="red"
          />
          <StatCard
            title="Unpaid Fines"
            value={isLoading ? "—" : `Rs.${Math.round(stats?.unpaidFines ?? 0)}`}
            subtitle="Pending collection"
            icon={<Wallet size={20} />}
            color="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">
                Recent Activity
              </h2>
            </div>

            <Card className="p-0 overflow-hidden border-gray-100">
              <div className="divide-y divide-gray-50">
                {isLoading ? (
                  <div className="p-4 text-sm text-gray-400 italic">Loading activity...</div>
                ) : error ? (
                  <div className="p-4 text-sm text-red-500 italic">{error}</div>
                ) : (
                  recentActivity.map((act, i) => (
                    <div
                      key={`${act.title}-${i}`}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                          <Book size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {act.title}
                          </p>
                          <p className="text-xs text-gray-500">{act.user}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{act.time}</p>
                        <span
                          className={`text-[10px] font-bold uppercase mt-1 px-2 py-0.5 rounded ${act.status === "Issued"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                            }`}
                        >
                          {act.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 uppercase text-xs tracking-wider text-gray-400">
                Quick Links
              </h2>

              <div className="grid grid-cols-1 gap-3">
                <QuickLinkItem
                  icon={<UserPlus size={18} />}
                  title="Add Member"
                  subtitle="Register new reader"

                  onClick={() => setIsAddMemberOpen(true)}
                />
                <QuickLinkItem
                  icon={<PlusCircle size={18} />}
                  title="Add Book"
                  subtitle="Catalog new title"
                  onClick={() => setIsAddBookOpen(true)}
                />
                <QuickLinkItem
                  icon={<BarChart3 size={18} />}
                  title="View Reports"
                  subtitle="System analytics"
                  onClick={() => navigate('/reports')}
                />
                <QuickLinkItem
                  icon={<Eye size={18} />}
                  title="View Overdue Items"
                  subtitle="Check pending returns"
                  onClick={() => navigate('/overdueitems')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
      />
      <AddBookModal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
      />
    </MainLayout>
  );
};

// Simple helper for the Quick Links
const QuickLinkItem = ({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: any;
  title: string;
  subtitle: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center justify-between w-full p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all text-left group"
  >
    <div className="flex items-center gap-4">
      <div className="text-blue-600 bg-blue-50 p-2 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm font-bold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
    <ChevronRight
      size={16}
      className="text-gray-300 group-hover:text-blue-500 transition-colors"
    />
  </button>
);
