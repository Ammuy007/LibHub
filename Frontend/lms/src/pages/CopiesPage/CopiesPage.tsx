import React, { useState, useMemo } from "react";
import {
  BookCopy,
  CheckCircle,
  CircleDot,
  Clock3,
  Download,
  Plus,
} from "lucide-react";

// Layout & UI Components
import { MainLayout } from "../../components/ui/layout/MainLayout";
import { Modal } from "../../components/modals/Register/Modal";
import { Input } from "../../components/ui/Input/Input";
import { Button } from "../../components/ui/Button/Button";
import { SearchBar } from "../../components/ui/SearchBar/SearchBar";
import { DataTable, TableCell } from "../../components/ui/Table/Table";
import { FilterSelect } from "../../components/ui/FilterSelect/FilterSelect";
import { exportToCsv } from "../../utils/exportToCsv";
import { StatCard } from "../../components/ui/StatCard/StatCard";

// --- Static Data ---
const copyRows = [
  {
    id: "LMS-BK-001-A",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    holder: "Library Shelf",
    status: "Available",
    statusType: "available",
  },
  {
    id: "LMS-BK-001-B",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    holder: "Sarah Jenkins",
    status: "Issued",
    statusType: "issued",
  },
  {
    id: "LMS-BK-552-C",
    title: "Introduction to Algorithms",
    author: "Cormen et al.",
    holder: "Amrutha P",
    status: "Issued",
    statusType: "issued",
  },
  {
    id: "LMS-BK-112-A",
    title: "Clean Code",
    author: "Robert C. Martin",
    holder: "Library-Shelf",
    status: "Available",
    statusType: "available",
  },
  {
    id: "LMS-BK-088-A",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    holder: "Shelly Sharma",
    status: "Issued",
    statusType: "issued",
  },
];

export const CopiesPage: React.FC = () => {
  // --- States ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [bookName, setBookName] = useState("");
  const [copiesCount, setCopiesCount] = useState("1");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Status");
  const statuses = ["Status", "Available", "Issued"];
  // --- Handlers ---
  const handleAddCopies = () => {
    if (!bookName.trim()) return;
    const count = Number.parseInt(copiesCount, 10);
    if (Number.isNaN(count) || count <= 0) return;

    // Logic for adding copies would go here
    setIsAddModalOpen(false);
    setBookName("");
    setCopiesCount("1");
  };

  // --- Search & Status Filtering Logic ---
  const filteredCopyRows = useMemo(() => {
    const q = search.toLowerCase().trim();

    return copyRows.filter((r) => {
      // 1. Search Logic
      const matchesSearch = !q ||
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        r.holder.toLowerCase().includes(q);

      // 2. Dropdown Logic
      const matchesStatus =
        statusFilter === "Status" ||
        r.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);// Re-run when search or statusFilter changes

  return (
    <MainLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
              Inventory / Copies Management
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">
              Copy Inventory
            </h1>
            <p className="mt-1 text-sm text-gray-500">Monitor the book stock</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() =>
                exportToCsv(
                  "copies",
                  ["Copy ID", "Book Title", "Author", "Current Holder", "Status"],
                  filteredCopyRows.map((r) => [r.id, r.title, r.author, r.holder, r.status])
                )
              }
            >
              <Download size={13} />
              Export Data
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus size={14} />
              Add New Copies
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
          <StatCard
            title="Total Inventory"
            value="12,312"
            subtitle="+140 this month"

            icon={<BookCopy size={16} />}
            color="blue"

          />
          <StatCard
            title="Currently Available"
            value="8,210"
            subtitle="65.7% of total"
            icon={<CheckCircle size={16} />}
            color="green"
          />
          <StatCard
            title="On Loan"
            value="4,102"
            subtitle="12 overdue currently"
            icon={<Clock3 size={16} />}
            color="red"
          />
        </div>

        {/* Main Content Area */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-5 space-y-4 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Asset Database</h2>
              <p className="text-xs text-gray-500">Comprehensive list of every physical volume.</p>
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto">
              {/* The New Dropdown */}
              <FilterSelect
                label={statusFilter}
                options={statuses}
                onSelect={setStatusFilter}
              />

              <SearchBar
                placeholder="Search by Copy ID or Book Title"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Data Table */}
          <DataTable headers={["Copy ID", "Book Title & Author", "Current Holder", "Status"]}>
            {filteredCopyRows.length > 0 ? (
              filteredCopyRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-black bg-blue-50 text-blue-700">
                      {row.id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <p className="font-bold text-gray-900">{row.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{row.author}</p>
                  </TableCell>
                  <TableCell center>
                    <span className="text-gray-700">{row.holder}</span>
                  </TableCell>
                  <TableCell center>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black ${row.statusType === "available"
                      ? "bg-green-50 text-green-700"
                      : "bg-blue-50 text-blue-700"
                      }`}>
                      <CircleDot size={11} />
                      {row.status}
                    </span>
                  </TableCell>
                </tr>
              ))
            ) : (
              <tr>
                <TableCell colSpan={4} center>
                  <div className="py-10 text-gray-400 italic">No copies found matching "{search}"</div>
                </TableCell>
              </tr>
            )}
          </DataTable>

          {/* Pagination Footer */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-gray-500 border-t pt-4">
            <p>
              Showing {filteredCopyRows.length} of {search ? filteredCopyRows.length : "12,482"} copies
            </p>
            <div className="flex items-center gap-2">
              <button className="h-8 px-3 rounded border border-gray-200 bg-white hover:bg-gray-50">Previous</button>
              <button className="h-8 min-w-8 px-2 rounded border border-blue-200 bg-blue-50 text-blue-600 font-semibold">1</button>
              <button className="h-8 min-w-8 px-2 rounded border border-gray-200 bg-white hover:bg-gray-50">2</button>
              <button className="h-8 px-3 rounded border border-gray-200 bg-white hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Copies Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Copies"
        icon={<BookCopy size={18} />}
        maxWidthClassName="max-w-md"
        variant="branded"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" className="h-9 px-4 text-sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCopies}>Add Copies</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Book Name"
            placeholder="Enter book title"
            value={bookName}
            onChange={(event) => setBookName(event.target.value)}
            labelClassName="text-xs font-semibold text-gray-700"
            className="h-10 text-sm"
          />
          <Input
            label="Number of Copies"
            type="number"
            min={1}
            placeholder="1"
            value={copiesCount}
            onChange={(event) => setCopiesCount(event.target.value)}
            labelClassName="text-xs font-semibold text-gray-700"
            className="h-10 text-sm"
          />
        </div>
      </Modal>
    </MainLayout>
  );
};

