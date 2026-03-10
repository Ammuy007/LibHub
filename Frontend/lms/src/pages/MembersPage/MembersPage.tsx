import React, { useEffect, useState } from "react";
import { Download, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../../components/ui/layout/MainLayout";
import { Button } from "../../components/ui/Button/Button";
import { DataTable, TableCell } from "../../components/ui/Table/Table";
import { exportToCsv } from "../../utils/exportToCsv";
import { SearchBar } from "../../components/ui/SearchBar/SearchBar";
import { api } from "../../services/api";
import type { MemberResponse } from "../../services/api";
import { formatMemberId } from "../../services/format";
import { AddMemberModal } from "../../components/modals/QuickLinks/AddMemberModal/AddMemberModal";

export const MembersPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [members, setMembers] = useState<MemberResponse[]>([]);
  const [activeLoanCounts, setActiveLoanCounts] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadMembers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [membersPage, loansPage] = await Promise.all([
          api.getMembers({ page, size: pageSize, name: search }),
          api.getLoans({ page: 0, size: 1000 }), // Get many loans for counts
        ]);
        if (!isMounted) return;
        setMembers(membersPage.content);
        setTotalPages(membersPage.totalPages);

        const activeLoans = loansPage.content.filter((loan) => !loan.returnDate);
        const counts = activeLoans.reduce<Record<number, number>>((acc, loan) => {
          acc[loan.memberId] = (acc[loan.memberId] ?? 0) + 1;
          return acc;
        }, {});
        setActiveLoanCounts(counts);
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Failed to load members", err);
        setError("Unable to load members right now.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadMembers();
    return () => {
      isMounted = false;
    };
  }, [page, search]);

  const filteredMembers = members;

  return (
    <MainLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Members Management
            </h1>
            <p className="mt-2 text-sm text-gray-500 max-w-2xl">
              Manage library subscribers, view membership status, and handle
              account restrictions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline"
              onClick={() =>
                exportToCsv(
                  "members",
                  ["Name", "Member ID", "Email", "Status", "Active Loans"],
                  filteredMembers.map((m) => [
                    m.name,
                    formatMemberId(m.id),
                    m.email ?? "-",
                    m.status ?? "-",
                    String(activeLoanCounts[m.id] ?? 0),
                  ])
                )
              }
            >
              <Download size={14} />
              Export Data
            </Button>
            <Button
              onClick={() => setIsAddMemberOpen(true)}
            >
              <Plus size={14} />
              Add New Member
            </Button>
          </div>
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-4 md:p-5">
          <div className="mb-5">
            <SearchBar
              placeholder="Search by name, ID or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            />
          </div>

          <DataTable headers={["Member Name", "Member ID", "Email Address", "Status", "Active Loans"]}>
            {isLoading ? (
              <tr>
                <TableCell colSpan={5} center>
                  <div className="py-10 text-gray-400 italic">Loading members...</div>
                </TableCell>
              </tr>
            ) : error ? (
              <tr>
                <TableCell colSpan={5} center>
                  <div className="py-10 text-red-500 italic">{error}</div>
                </TableCell>
              </tr>
            ) : (
              filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/members/${formatMemberId(member.id)}`)}
                >
                  <TableCell>
                    <span className="font-bold text-gray-900">{member.name}</span>
                  </TableCell>
                  <TableCell center>
                    <span className="text-xs font-mono text-gray-400">{formatMemberId(member.id)}</span>
                  </TableCell>
                  <TableCell center>
                    <span className="text-gray-600">{member.email ?? "-"}</span>
                  </TableCell>
                  <TableCell center>
                    <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-black ${member.status?.toLowerCase() === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                      {member.status ? member.status.charAt(0).toUpperCase() + member.status.slice(1) : "-"}
                    </span>
                  </TableCell>
                  <TableCell center>
                    <span className={`font-black ${(activeLoanCounts[member.id] ?? 0) > 0 ? "text-blue-600" : "text-gray-400"
                      }`}>
                      {activeLoanCounts[member.id] ?? 0}
                    </span>
                  </TableCell>
                </tr>
              ))
            )}
          </DataTable>

          <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-gray-500">
            <p>Page {page + 1} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="h-8 px-3 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button className="h-8 min-w-8 px-2 rounded border border-blue-200 bg-blue-50 text-blue-600 font-semibold">
                {page + 1}
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="h-8 px-3 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => {
          setIsAddMemberOpen(false);
          // Refresh list if needed (though usually we'd want to just refresh current page)
          // For now, let's just close. If caller wants refresh, they can add it to onClose or a specific success callback.
          // But dashboard does refresh via useEffect.
        }}
      />
    </MainLayout>
  );
};
