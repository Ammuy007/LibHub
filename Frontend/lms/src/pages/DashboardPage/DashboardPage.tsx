import React, { useState } from "react";
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

export const DashboardPage: React.FC = () => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const navigate = useNavigate();

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
            value="12,482"
            subtitle="45 titles added this month"
            icon={<Book size={20} />}
            color="blue"
          />
          <StatCard
            title="Copies Available"
            value="8,210"
            subtitle="65% of total inventory"
            icon={<CheckCircle size={20} />}
            color="green"
          />
          <StatCard
            title="Issued Books"
            value="4,272"
            subtitle="120+ checkouts today"
            icon={<ArrowUpRight size={20} />}
            color="orange"
          />
          <StatCard
            title="Overdue Loans"
            value="148"
            subtitle="12 require immediate action"
            icon={<AlertCircle size={20} />}
            color="red"
          />
          <StatCard
            title="Unpaid Fines"
            value="18,450"
            subtitle="24 pending payments"
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
                {[
                  {
                    title: "The Great Gatsby",
                    user: "Sarah Jenkins",
                    time: "12 mins ago",
                    status: "Issued",
                  },
                  {
                    title: "Advanced Quantum Physics",
                    user: "Ananya Pramod",
                    time: "45 mins ago",
                    status: "Returned",
                  },
                  {
                    title: "Introduction to DSA",
                    user: "Siya Romeo",
                    time: "1 hour ago",
                    status: "Issued",
                  },
                  {
                    title: "Modern Art History",
                    user: "Liam Smith",
                    time: "2 hours ago",
                    status: "Returned",
                  },
                  {
                    title: "Data Structures in Python",
                    user: "Emily Davis",
                    time: "3 hours ago",
                    status: "Issued",
                  },
                  {
                    title: "World War II Chronicles",
                    user: "Michael Brown",
                    time: "5 hours ago",
                    status: "Returned",
                  },
                ].map((act, i) => (
                  <div
                    key={i}
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
                ))}
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
