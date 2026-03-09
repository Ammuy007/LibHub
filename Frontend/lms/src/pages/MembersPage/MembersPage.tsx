import React, { useMemo, useState } from "react";
import { Download, Plus, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../../components/ui/layout/MainLayout";
import { Modal } from "../../components/modals/Register/Modal";
import { Input } from "../../components/ui/Input/Input";
import { Button } from "../../components/ui/Button/Button";
import { DataTable, TableCell } from "../../components/ui/Table/Table";
import { exportToCsv } from "../../utils/exportToCsv";
import { SearchBar } from "../../components/ui/SearchBar/SearchBar";

const members = [
  {
    name: "Alexander Thorne",
    memberId: "MEM-2024-001",
    email: "a.thorne@example.com",
    status: "Active",
    activeLoans: 3,
  },
  {
    name: "Sarah Jenkins",
    memberId: "MEM-2024-003",
    email: "s.jenkins@example.com",
    status: "Active",
    activeLoans: 3,
  },
  {
    name: "Marcus Vane",
    memberId: "MEM-2024-103",
    email: "marcus@example.com",
    status: "Active",
    activeLoans: 3,
  },
  {
    name: "Elena Jacob",
    memberId: "MEM-2024-656",
    email: "elena@example.com",
    status: "Active",
    activeLoans: 2,
  },
  {
    name: "David Chen",
    memberId: "MEM-2023-014",
    email: "d.chen@academy.edu",
    status: "Inactive",
    activeLoans: 0,
  },
  {
    name: "Priya Singh",
    memberId: "MEM-2023-078",
    email: "priya.singh@example.com",
    status: "Active",
    activeLoans: 3,
  },
  {
    name: "Liam O'Connor",
    memberId: "MEM-2024-210",
    email: "liam.oc@example.com",
    status: "Active",
    activeLoans: 1,
  },
  {
    name: "Sophia Martinez",
    memberId: "MEM-2024-211",
    email: "sophia.m@example.com",
    status: "Active",
    activeLoans: 3,
  },
  {
    name: "Ethan Wright",
    memberId: "MEM-2024-212",
    email: "ethan.wright@example.com",
    status: "Active",
    activeLoans: 2,
  },
  {
    name: "Olivia Brown",
    memberId: "MEM-2024-213",
    email: "olivia.brown@example.com",
    status: "Active",
    activeLoans: 1,
  },
];

export const MembersPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredMembers = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.memberId.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.status.toLowerCase().includes(q)
    );
  }, [search]);

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
                  filteredMembers.map((m) => [m.name, m.memberId, m.email, m.status, String(m.activeLoans)])
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
              onChange={(e) => setSearch(e.target.value)}

            />
          </div>

          <DataTable headers={["Member Name", "Member ID", "Email Address", "Status", "Active Loans"]}>
            {filteredMembers.map((member) => (
              <tr
                key={member.memberId}
                className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/members/${member.memberId}`)}
              >
                <TableCell>
                  <span className="font-bold text-gray-900">{member.name}</span>
                </TableCell>
                <TableCell center>
                  <span className="text-xs font-mono text-gray-400">{member.memberId}</span>
                </TableCell>
                <TableCell center>
                  <span className="text-gray-600">{member.email}</span>
                </TableCell>
                <TableCell center>
                  <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-black ${member.status === "Active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                    {member.status}
                  </span>
                </TableCell>
                <TableCell center>
                  <span className={`font-black ${member.activeLoans > 0 ? "text-blue-600" : "text-gray-400"
                    }`}>
                    {member.activeLoans}
                  </span>
                </TableCell>
              </tr>
            ))}
          </DataTable>

          <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-gray-500">
            <p>Showing 1-10 of 1,248 library members</p>
            <div className="flex items-center gap-2">
              <button className="h-8 px-3 rounded border border-gray-200 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="h-8 min-w-8 px-2 rounded border border-blue-200 bg-blue-50 text-blue-600 font-semibold">
                1
              </button>
              <button className="h-8 min-w-8 px-2 rounded border border-gray-200 bg-white hover:bg-gray-50">
                2
              </button>
              <button className="h-8 min-w-8 px-2 rounded border border-gray-200 bg-white hover:bg-gray-50">
                3
              </button>
              <span className="px-1">...</span>
              <button className="h-8 min-w-8 px-2 rounded border border-gray-200 bg-white hover:bg-gray-50">
                24
              </button>
              <button className="h-8 px-3 rounded border border-gray-200 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </section>
      </div>

      <Modal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        title="Register New Member"
        subtitle="Enter the details of the new member"
        variant="branded"
        icon={<UserPlus size={18} />}
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              className="h-9 px-4 text-sm"
              onClick={() => setIsAddMemberOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => setIsAddMemberOpen(false)}
            >
              Save Details
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Name *"
            placeholder="e.g. Alex Adams"
            labelClassName="text-xs font-semibold text-gray-700"
            className="h-10 text-sm"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="alex@gmail.com"
              labelClassName="text-xs font-semibold text-gray-700"
              className="h-10 text-sm"
            />
            <Input
              label="Phone Number"
              placeholder="XXXXXXXXXX"
              labelClassName="text-xs font-semibold text-gray-700"
              className="h-10 text-sm"
            />
          </div>
          <p className="text-xs text-gray-400">
            Fields marked with * are mandatory for registration.
          </p>
        </div>
      </Modal>
    </MainLayout>
  );
};
