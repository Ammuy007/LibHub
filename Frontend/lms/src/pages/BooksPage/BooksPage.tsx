import React, { useMemo, useState } from "react";
import {
  BookPlus,
  Download,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../../components/ui/layout/MainLayout";
import { Modal } from "../../components/modals/Register/Modal";
import { Input } from "../../components/ui/Input/Input";
import { Button } from "../../components/ui/Button/Button";
import { SearchBar } from "../../components/ui/SearchBar/SearchBar";
import { FilterSelect } from "../../components/ui/FilterSelect/FilterSelect";
import { DataTable, TableCell } from "../../components/ui/Table/Table";
import { exportToCsv } from "../../utils/exportToCsv";

// --- Static Data ---
const books = [
  { title: "The Midnight Library", author: "Matt Haig", category: "Contemporary Fiction", publisher: "Canongate Books", isbn: "978-1786892706", inventory: "8 / 12", status: "In Stock", statusType: "ok" },
  { title: "Atomic Habits", author: "James Clear", category: "Self-Help", publisher: "Penguin Random House", isbn: "978-0735211292", inventory: "0 / 25", status: "Out of Stock", statusType: "out" },
  { title: "Project Hail Mary", author: "Andy Weir", category: "Fiction", publisher: "Ballantine Books", isbn: "978-0593135204", inventory: "14 / 15", status: "In Stock", statusType: "ok" },
  { title: "The Silent Patient", author: "Alex Michaelides", category: "Thriller", publisher: "Celadon Books", isbn: "978-1250301697", inventory: "2 / 10", status: "In Stock", statusType: "ok" },
  { title: "Dune", author: "Frank Herbert", category: "Fiction", publisher: "Chilton Books", isbn: "978-0441172719", inventory: "18 / 20", status: "In Stock", statusType: "ok" },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Classic", publisher: "Charles Scribner's Sons", isbn: "978-0743273565", inventory: "5 / 8", status: "In Stock", statusType: "ok" },
  { title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", category: "Non-Fiction", publisher: "Harper", isbn: "978-0062316097", inventory: "12 / 18", status: "In Stock", statusType: "ok" },
];

// Helper to get unique categories for the filter
const categories = ["Categories", ...Array.from(new Set(books.map((b) => b.category)))];
const statuses = ["Status", "In Stock", "Out of Stock"];

export const BooksPage: React.FC = () => {
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [search, setSearch] = useState("");

  // --- Filter States ---
  const [selectedCategory, setSelectedCategory] = useState("Categories");
  const [selectedStatus, setSelectedStatus] = useState("Status");

  const navigate = useNavigate();

  // --- Filtering Logic ---
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchesSearch =
        !search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        b.isbn.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "Categories" ||
        b.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "Status" ||
        b.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, selectedCategory, selectedStatus]);

  return (
    <MainLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Books Catalog</h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage and organize the complete library inventory.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline"
              onClick={() =>
                exportToCsv(
                  "books",
                  ["Title", "Author", "Category", "Status"],
                  filteredBooks.map((b) => [b.title, b.author, b.category, b.status])
                )
              }
            >
              <Download size={14} /> Export Data
            </Button>
            <Button onClick={() => setIsAddBookOpen(true)}>
              <Plus size={14} /> Add New Book
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <Stat label="Total Titles" value="1,248" valueClassName="text-blue-600" />
          <Stat label="Total Copies" value="4,820" />
          <Stat label="Out of Stock" value="42" valueClassName="text-red-600" />
          <Stat label="Active Categories" value="24" />
        </div>

        {/* Main Section */}
        <section className="rounded-xl border border-gray-200 bg-white p-4 md:p-5 space-y-4 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <SearchBar
                placeholder="Filter by title, author, or ISBN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category Dropdown */}
            <FilterSelect
              label={selectedCategory}
              options={categories}
              onSelect={setSelectedCategory}
            />

            {/* Status Dropdown */}
            <FilterSelect
              label={selectedStatus}
              options={statuses}
              onSelect={setSelectedStatus}
            />
          </div>

          <DataTable headers={["Book Title & Author", "Category", "Publisher & ISBN", "Inventory", "Status"]}>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <tr
                  key={book.isbn}
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/books/${encodeURIComponent(book.title)}`)}
                >
                  <TableCell>
                    <p className="font-bold text-gray-900">{book.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">by {book.author}</p>
                  </TableCell>
                  <TableCell center>
                    <span className="inline-flex px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-600">
                      {book.category}
                    </span>
                  </TableCell>
                  <TableCell center>
                    <p className="font-semibold text-gray-800">{book.publisher}</p>
                    <p className="text-xs font-mono text-gray-400 mt-0.5">{book.isbn}</p>
                  </TableCell>
                  <TableCell center>
                    <span className="font-black text-gray-900">{book.inventory}</span>
                  </TableCell>
                  <TableCell center>
                    <span
                      className={`inline-flex px-3 py-1 rounded-lg text-xs font-black ${book.statusType === "out" ? "bg-red-50 text-red-600" :
                        book.statusType === "low" ? "bg-orange-50 text-orange-600" :
                          "bg-green-50 text-green-700"
                        }`}
                    >
                      {book.status}
                    </span>
                  </TableCell>
                </tr>
              ))
            ) : (
              <tr>
                <TableCell colSpan={5} center>
                  <div className="py-20 text-gray-400 italic">No books match your current filters.</div>
                </TableCell>
              </tr>
            )}
          </DataTable>
        </section>
      </div>

      {/* Register New Book Modal */}
      <Modal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
        title="Register New Book"
        icon={<BookPlus size={18} />}
        variant="branded"
        maxWidthClassName="max-w-3xl"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" className="h-9 px-4 text-sm" onClick={() => setIsAddBookOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddBookOpen(false)}>Save Book to Catalog</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Book Title *" placeholder="e.g. The Midnight Library" labelClassName="text-xs font-semibold text-gray-700" className="h-10 text-sm" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="ISBN-13" placeholder="978-XXXXXXXXXX" labelClassName="text-xs font-semibold text-gray-700" className="h-10 text-sm" />
            <div className="flex flex-col space-y-3">
              <label className="text-xs font-semibold text-gray-700">Category</label>
              <FilterSelect label="Select category" options={categories.slice(1)} onSelect={() => { }} />
            </div>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};
const Stat = ({ label, value, valueClassName = "text-gray-900" }: { label: string; value: string; valueClassName?: string }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
    <p className={`mt-2 text-4xl font-bold leading-none ${valueClassName}`}>{value}</p>
  </div>
);