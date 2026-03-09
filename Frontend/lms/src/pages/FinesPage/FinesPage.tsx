import React, { useMemo, useState } from "react";
import { Download, Search, Plus, X, Receipt } from "lucide-react";
import { MainLayout } from "../../components/ui/layout/MainLayout";
import { Modal } from "../../components/modals/Register/Modal";
import { Input } from "../../components/ui/Input/Input";
import { Button } from "../../components/ui/Button/Button";
import { DataTable, TableCell } from "../../components/ui/Table/Table";
import { exportToCsv } from "../../utils/exportToCsv";

type FineStatus = "Unpaid" | "Paid";

type FineRecord = {
  id: string;
  member: string;
  memberId: string;
  book: string;
  loanId: string;
  dueDate: string;
  returnedDate: string;
  overdueDays: number;
  ratePerDay: number;
  amount: number;
  status: FineStatus;
};

const initialFines: FineRecord[] = [
  {
    id: "F-1001",
    member: "Sarah Jenkins",
    memberId: "M-5021",
    book: "The Midnight Library",
    loanId: "L-8820",
    dueDate: "2024-05-10",
    returnedDate: "2024-05-22",
    overdueDays: 10,
    ratePerDay: 10,
    amount: 100,
    status: "Unpaid",
  },
  {
    id: "F-1002",
    member: "Michael Chen",
    memberId: "M-3312",
    book: "Atomic Habits",
    loanId: "L-7331",
    dueDate: "2024-05-18",
    returnedDate: "2024-05-22",
    overdueDays: 4,
    ratePerDay: 25,
    amount: 100,
    status: "Unpaid",
  },
  {
    id: "F-1003",
    member: "Elena Rodriguez",
    memberId: "M-4480",
    book: "Project Hail Mary",
    loanId: "L-2262",
    dueDate: "2024-04-26",
    returnedDate: "2024-05-10",
    overdueDays: 14,
    ratePerDay: 10,
    amount: 140,
    status: "Paid",
  },
  {
    id: "F-1004",
    member: "David Smith",
    memberId: "M-1209",
    book: "Dune: Part One",
    loanId: "L-4152",
    dueDate: "2024-05-01",
    returnedDate: "2024-05-26",
    overdueDays: 25,
    ratePerDay: 5,
    amount: 125,
    status: "Unpaid",
  },
  {
    id: "F-1005",
    member: "Aisha Khan",
    memberId: "M-6071",
    book: "The Alchemist",
    loanId: "L-1023",
    dueDate: "2024-05-14",
    returnedDate: "2024-05-19",
    overdueDays: 5,
    ratePerDay: 5,
    amount: 25,
    status: "Unpaid",
  },
];

export const FinesPage: React.FC = () => {
  const [fines, setFines] = useState<FineRecord[]>(initialFines);
  const [tab, setTab] = useState<"all" | "unpaid" | "paid">("all");
  const [search, setSearch] = useState("");
  const [selectedFineId, setSelectedFineId] = useState<string | null>(null);
  const [isManualFineOpen, setIsManualFineOpen] = useState(false);

  const filteredFines = useMemo(() => {
    return fines.filter((fine) => {
      const matchesTab =
        tab === "all" ||
        (tab === "unpaid" && fine.status === "Unpaid") ||
        (tab === "paid" && fine.status === "Paid");

      const matchesSearch =
        !search ||
        fine.member.toLowerCase().includes(search.toLowerCase()) ||
        fine.memberId.toLowerCase().includes(search.toLowerCase()) ||
        fine.book.toLowerCase().includes(search.toLowerCase()) ||
        fine.id.toLowerCase().includes(search.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [fines, tab, search]);

  const selectedFine = selectedFineId
    ? fines.find((fine) => fine.id === selectedFineId) || null
    : null;

  const totalFineAmount = fines.reduce((sum, fine) => sum + fine.amount, 0);
  const pendingCount = fines.filter((fine) => fine.status === "Unpaid").length;

  const markAsPaid = () => {
    if (!selectedFine || selectedFine.status === "Paid") {
      return;
    }
    setFines((prev) =>
      prev.map((fine) =>
        fine.id === selectedFine.id ? { ...fine, status: "Paid" } : fine,
      ),
    );
  };

  return (
    <MainLayout>
      <div
        className={`max-w-[1600px] mx-auto transition-all duration-300 ${selectedFine ? "grid grid-cols-1 xl:grid-cols-12 gap-6" : "space-y-6"}`}
      >
        <div className={`space-y-6 ${selectedFine ? "xl:col-span-8" : ""}`}>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Fines Management
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Track and process overdue book penalties and payments.
              </p>
            </div>
            {/* {add gap between export and } */}
            <div className="flex gap-3">

              <Button
                variant="outline"
                onClick={() =>
                  exportToCsv(
                    `fines_${tab}`,
                    ["ID", "Member", "Member ID", "Book", "Loan ID", "Due Date", "Returned Date", "Overdue Days", "Rate/Day", "Amount", "Status"],
                    filteredFines.map((f) => [
                      f.id, f.member, f.memberId, f.book, f.loanId,
                      f.dueDate, f.returnedDate,
                      String(f.overdueDays), String(f.ratePerDay),
                      String(f.amount), f.status,
                    ])
                  )
                }
              >
                <Download size={13} />
                Export Data
              </Button>
              <Button
                className="whitespace-nowrap"
                onClick={() => setIsManualFineOpen(true)}
              >
                <Plus size={14} />
                Manual Fine Entry
              </Button>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
            <StatCard
              title="Total Fine"
              value={`Rs. ${totalFineAmount.toFixed(2)}`}
            />
            <StatCard title="Pending Records" value={String(pendingCount)} />
          </div>

          <section className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <TabButton
                  active={tab === "all"}
                  label="All Fines"
                  onClick={() => setTab("all")}
                />
                <TabButton
                  active={tab === "unpaid"}
                  label="Unpaid"
                  onClick={() => setTab("unpaid")}
                />
                <TabButton
                  active={tab === "paid"}
                  label="Resolved"
                  onClick={() => setTab("paid")}
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:min-w-64">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    className="h-10 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                    placeholder="Search member or book..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>


              </div>
            </div>

            <DataTable headers={["ID", "Member", "Book Item", "Overdue", "Amount", "Status"]}>
              {filteredFines.map((fine) => (
                <tr
                  key={fine.id}
                  className={`cursor-pointer transition-colors ${selectedFine?.id === fine.id ? "bg-blue-50" : "hover:bg-gray-50/50"
                    }`}
                  onClick={() => setSelectedFineId(selectedFine?.id === fine.id ? null : fine.id)}
                >
                  <TableCell>
                    <span className="text-xs font-mono text-gray-400">{fine.id}</span>
                  </TableCell>
                  <TableCell>
                    <p className="font-bold text-gray-900">{fine.member}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{fine.memberId}</p>
                  </TableCell>
                  <TableCell center>
                    <span className="text-gray-800">{fine.book}</span>
                  </TableCell>
                  <TableCell center>
                    <span className={fine.overdueDays >= 10 ? "font-black text-red-600" : "text-gray-700"}>
                      {fine.overdueDays}d
                    </span>
                  </TableCell>
                  <TableCell center>
                    <span className="font-black text-gray-900">Rs. {fine.amount.toFixed(2)}</span>
                  </TableCell>
                  <TableCell center>
                    <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-black ${fine.status === "Paid" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                      }`}>
                      {fine.status}
                    </span>
                  </TableCell>
                </tr>
              ))}
            </DataTable>
            {filteredFines.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm">
                No fines found.
              </div>
            )}
          </section>
        </div>

        {selectedFine && (
          <aside className="xl:col-span-4 space-y-4">
            <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm relative sticky top-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Fine Details
                  </h2>
                  <span className="text-xs text-gray-500">
                    {selectedFine.id}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedFineId(null)}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-5 rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="font-semibold text-gray-900">
                  {selectedFine.member}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  ID: {selectedFine.memberId}
                </p>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <h3 className="text-[11px] uppercase tracking-wider font-bold text-gray-400">
                  Associated Loan
                </h3>
                <p className="font-semibold text-gray-900">
                  {selectedFine.book}
                </p>
                <div className="space-y-2 mt-2">
                  <p className="flex justify-between items-center text-gray-600">
                    <span className="text-xs">Loan ID</span>
                    <span className="font-medium text-gray-900">
                      {selectedFine.loanId}
                    </span>
                  </p>
                  <p className="flex justify-between items-center text-gray-600">
                    <span className="text-xs">Due Date</span>
                    <span className="font-medium text-gray-900">
                      {selectedFine.dueDate}
                    </span>
                  </p>
                  <p className="flex justify-between items-center text-gray-600">
                    <span className="text-xs">Returned</span>
                    <span className="font-medium text-gray-900">
                      {selectedFine.returnedDate}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-gray-100 p-4 space-y-3 bg-white">
                <h3 className="text-[11px] uppercase tracking-wider font-bold text-gray-400">
                  Calculation
                </h3>
                <p className="flex justify-between items-center text-sm text-gray-600">
                  <span className="text-xs">Overdue Days</span>
                  <span className="font-medium text-gray-900">
                    {selectedFine.overdueDays} days
                  </span>
                </p>
                <p className="flex justify-between items-center text-sm text-gray-600">
                  <span className="text-xs">Rate</span>
                  <span className="font-medium text-gray-900">
                    Rs. {selectedFine.ratePerDay} / day
                  </span>
                </p>
                <div className="border-t border-gray-100 pt-3 mt-1 flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-900">
                    Total Fine
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    Rs. {selectedFine.amount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  className={`w-full h-11 rounded-lg text-sm font-semibold transition-colors ${selectedFine.status === "Paid"
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                    }`}
                  onClick={markAsPaid}
                  disabled={selectedFine.status === "Paid"}
                >
                  {selectedFine.status === "Paid"
                    ? "Already Paid"
                    : "Mark as Paid"}
                </button>
              </div>
            </section>
          </aside>
        )}
      </div>

      <Modal
        isOpen={isManualFineOpen}
        onClose={() => setIsManualFineOpen(false)}
        title="Manual Fine Entry"
        icon={<Receipt size={18} />}
        variant="branded"
        maxWidthClassName="max-w-2xl"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              className="h-9 px-4 text-sm"
              onClick={() => setIsManualFineOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => setIsManualFineOpen(false)}
            >
              Issue Fine
            </Button>
          </div>
        }
      >
        <div className="space-y-5 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Member ID *"
              placeholder="e.g. M-5021"
              labelClassName="text-xs font-semibold text-gray-700"
              className="h-10 text-sm"
            />
            <Input
              label="Copy ID / Loan ID *"
              placeholder="e.g. L-8820"
              labelClassName="text-xs font-semibold text-gray-700"
              className="h-10 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Fine Amount (Rs.) *"
              placeholder="e.g. 100"
              type="number"
              labelClassName="text-xs font-semibold text-gray-700"
              className="h-10 text-sm"
            />
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-semibold text-gray-700">
                Reason for Fine
              </label>
              <select className="h-10 border border-gray-300 rounded-md px-3 text-sm text-gray-900 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 bg-white">
                <option>Overdue Return</option>
                <option>Book Damage</option>
                <option>Lost Book</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div>
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-semibold text-gray-700">
                Additional Comments
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 min-h-[80px]"
                placeholder="Any special notes regarding this fine..."
              ></textarea>
            </div>
          </div>
          <p className="text-xs text-gray-500 pt-2 border-t border-gray-100">
            Fields marked with * are mandatory to issue a fine.
          </p>
        </div>
      </Modal>
    </MainLayout>
  );
};

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <p className="text-xs uppercase tracking-wider font-bold text-gray-400">
      {title}
    </p>
    <p className="text-3xl font-bold text-gray-900 mt-2 leading-none">
      {value}
    </p>
  </div>
);

const TabButton = ({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    className={`h-9 px-4 rounded-lg text-xs font-semibold transition-colors ${active
      ? "bg-blue-500 text-white shadow-sm"
      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    onClick={onClick}
  >
    {label}
  </button>
);
