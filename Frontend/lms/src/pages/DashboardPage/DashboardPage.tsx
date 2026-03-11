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
import type {
  BookResponse,
  LoanResponse,
  MemberResponse,
} from "../../services/api";
import { formatRelativeTime } from "../../services/format";

export const DashboardPage: React.FC = () => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loans, setLoans] = useState<LoanResponse[]>([]);
  const [books, setBooks] = useState<BookResponse[]>([]);
  const [members, setMembers] = useState<MemberResponse[]>([]);
  const [priorityFollowUps, setPriorityFollowUps] = useState<LoanResponse[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadDashboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [
          statsResponse,
          loansPage,
          priorityResponse,
          booksResponse,
          membersPage,
        ] = await Promise.all([
          api.getDashboardStats(),
          api.getLoans({ page: 0, size: 200 }),
          api.getPriorityFollowUps(),
          api.getBooks(),
          api.getMembers({ page: 0, size: 200 }),
        ]);
        if (!isMounted) return;
        setStats(statsResponse);
        setLoans(loansPage.content);
        setPriorityFollowUps(priorityResponse);
        setBooks(booksResponse);
        setMembers(membersPage.content);
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
    const items: Array<{
      title: string;
      user: string;
      timeLabel: string;
      status: "NEW" | "Issued" | "Returned";
      sortTime: number;
    }> = [];

    loans.forEach((loan) => {
      const isReturned = !!loan.returnDate;
      const timeLabel = loan.returnDate ?? loan.createdAt ?? loan.issueDate;
      items.push({
        title: loan.bookTitle,
        user: loan.memberName,
        timeLabel,
        status: isReturned ? "Returned" : "Issued",
        sortTime: timeLabel ? new Date(timeLabel).getTime() : 0,
      });
    });

    books.forEach((book) => {
      const timeLabel = book.createdAt ?? "";
      items.push({
        title: book.title,
        user: "Newly Registered Book",
        timeLabel,
        status: "NEW",
        sortTime: timeLabel ? new Date(timeLabel).getTime() : 0,
      });
    });

    members.forEach((member) => {
      const timeLabel = member.membershipStart ?? "";
      items.push({
        title: member.name,
        user: "Newly Registered Member",
        timeLabel,
        status: "NEW",
        sortTime: timeLabel ? new Date(timeLabel).getTime() : 0,
      });
    });

    return items
      .sort((a, b) => b.sortTime - a.sortTime)
      .slice(0, 6)
      .map((item) => ({
        title: item.title,
        user: item.user,
        time: item.timeLabel ? formatRelativeTime(item.timeLabel) : "—",
        status: item.status,
      }));
  }, [loans, books, members]);

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
            title="Issued Copies"
            value={isLoading ? "—" : String(stats?.issuedBooks ?? 0)}
            subtitle="Copies currently with members"
            icon={<ArrowUpRight size={20} />}
            color="orange"
          />
          <StatCard
            title="Overdue Loans"
            value={isLoading ? "—" : String(stats?.overdueLoans ?? 0)}
            subtitle={"Needs Attention"}
            icon={<AlertCircle size={20} />}
            color="red"
          />
          <StatCard
            title="Unpaid Fines"
            value={
              isLoading ? "—" : `Rs.${Math.round(stats?.unpaidFines ?? 0)}`
            }
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
                  <div className="p-4 text-sm text-gray-400 italic">
                    Loading activity...
                  </div>
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
                          className={`text-[10px] font-bold uppercase mt-1 px-2 py-0.5 rounded ${
                            act.status === "Issued"
                              ? "bg-blue-100 text-blue-700"
                              : act.status === "Returned"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
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
                  onClick={() => navigate("/reports")}
                />
                <QuickLinkItem
                  icon={<Eye size={18} />}
                  title="View Overdue Items"
                  subtitle="Check pending returns"
                  onClick={() => navigate("/overdueitems")}
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
