import React, { useEffect, useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { MainLayout } from "../../components/ui/layout/MainLayout";
import { UserLayout } from "../../components/ui/layout/UserLayout";
import { Button } from "../../components/ui/Button/Button";
import { SearchBar } from "../../components/ui/SearchBar/SearchBar";
import { FilterSelect } from "../../components/ui/FilterSelect/FilterSelect";
import { DataTable, TableCell } from "../../components/ui/Table/Table";
import { AddBookModal } from "../../components/modals/QuickLinks/AddBookModal/AddBookModal";
import { exportToCsv } from "../../utils/exportToCsv";
import { api } from "../../services/api";
import type { BookResponse, CopyResponse } from "../../services/api";

const statuses = ["Status", "In Stock", "Out of Stock"];

export const BooksPage: React.FC = () => {
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<BookResponse[]>([]);
  const [copies, setCopies] = useState<CopyResponse[]>([]);
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const pageSize = 10;

  // --- Filter States ---
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("Status");

  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname === "/books";
  const Layout = isAdmin ? MainLayout : UserLayout;

  useEffect(() => {
    let isMounted = true;

    const fetchAllCategories = async () => {
      try {
        const pageSize = 100;
        let page = 0;
        let all: string[] = [];
        while (true) {
          const res = await api.getCategories({ page, size: pageSize });
          all = all.concat(res.content.map((c) => c.category_name));
          if (res.number + 1 >= res.totalPages) break;
          page += 1;
        }
        return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b));
      } catch (err) {
        return [];
      }
    };

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [booksResponse, copiesResponse, categoriesResponse] =
          await Promise.all([
            api.getBooks(),
            api.getCopies().catch(() => [] as CopyResponse[]),
            fetchAllCategories(),
          ]);
        if (!isMounted) return;
        setBooks(booksResponse);
        setCopies(copiesResponse);
        setDbCategories(categoriesResponse);
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to load books", err);
        setError("Unable to load books right now.");
        setBooks([]);
        setCopies([]);
        setDbCategories([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const inventoryByBookId = useMemo(() => {
    return copies.reduce<Record<number, { total: number; available: number }>>(
      (acc, copy) => {
        const entry = acc[copy.bookId] ?? { total: 0, available: 0 };
        entry.total += 1;
        if (copy.status?.toLowerCase() === "available") entry.available += 1;
        acc[copy.bookId] = entry;
        return acc;
      },
      {},
    );
  }, [copies]);

  const mappedBooks = useMemo(() => {
    return books.map((book) => {
      const stats = inventoryByBookId[book.book_id] ?? {
        total: 0,
        available: 0,
      };
      const statusType =
        stats.available === 0 ? "out" : stats.available <= 2 ? "low" : "ok";
      const rawCategories = Array.isArray(book.categories)
        ? book.categories.filter(Boolean)
        : [];
      const safeCategories = rawCategories.length
        ? rawCategories
        : ["Uncategorized"];
      return {
        title: book.title,
        author: book.author ?? "Unknown",
        categories: safeCategories,
        categoryDisplay: safeCategories.slice(0, 3).join(" | "),
        publisher: book.publisher ?? "-",
        isbn: book.isbn ?? "-",
        inventory: `${stats.available} / ${stats.total}`,
        status: stats.available === 0 ? "Out of Stock" : "In Stock",
        statusType,
      };
    });
  }, [books, inventoryByBookId]);

  const categories = useMemo(() => {
    return ["All Categories", ...dbCategories];
  }, [dbCategories]);

  // --- Filtering Logic ---
  const filteredBooks = useMemo(() => {
    return mappedBooks.filter((b) => {
      const matchesSearch =
        !search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        b.isbn.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" ||
        b.categories.includes(selectedCategory);

      const matchesStatus =
        selectedStatus === "Status" || b.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, selectedCategory, selectedStatus, mappedBooks]);

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / pageSize));
  const paginatedBooks = useMemo(() => {
    const start = page * pageSize;
    return filteredBooks.slice(start, start + pageSize);
  }, [filteredBooks, page, pageSize]);

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
    <Layout>
      <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-700">
        {/* Page Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              {isAdmin ? "Books Catalog" : "Library Books"}
            </h1>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              {isAdmin
                ? "Manage and organize the complete library inventory."
                : "Explore our collection and find your next favorite read."}
            </p>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() =>
                  exportToCsv(
                    "books",
                    ["Title", "Author", "Category", "Status"],
                    filteredBooks.map((b) => [
                      b.title,
                      b.author,
                      b.categoryDisplay,
                      b.status,
                    ]),
                  )
                }
              >
                <Download size={14} /> Export Data
              </Button>
              <Button onClick={() => setIsAddBookOpen(true)}>
                <Plus size={14} /> Add New Book
              </Button>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <Stat
            label="Total Titles"
            value={isLoading ? "—" : String(mappedBooks.length)}
            valueClassName="text-blue-600"
          />
          <Stat
            label="Total Copies"
            value={isLoading ? "—" : String(copies.length)}
          />
          <Stat
            label="Out of Stock"
            value={
              isLoading
                ? "—"
                : String(
                    mappedBooks.filter((b) => b.status === "Out of Stock")
                      .length,
                  )
            }
            valueClassName="text-red-600"
          />
          <Stat
            label="Active Categories"
            value={isLoading ? "—" : String(categories.length - 1)}
          />
        </div>

        {/* Main Section */}
        <section className="rounded-xl border border-gray-200 bg-white p-4 md:p-5 space-y-4 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <SearchBar
                placeholder="Filter by title, author, or ISBN..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
              />
            </div>

            {/* Category Dropdown */}
            <FilterSelect
              label={selectedCategory}
              options={categories}
              onSelect={(val) => {
                setSelectedCategory(val);
                setPage(0);
              }}
              searchable
              searchPlaceholder="Search categories..."
            />

            {/* Status Dropdown */}
            <FilterSelect
              label={selectedStatus}
              options={statuses}
              onSelect={(val) => {
                setSelectedStatus(val);
                setPage(0);
              }}
            />
          </div>

          <DataTable
            headers={[
              "Book Title & Author",
              "Category",
              "Publisher & ISBN",
              "Inventory",
              "Status",
            ]}
          >
            {isLoading ? (
              <tr>
                <TableCell colSpan={5} center>
                  <div className="py-20 text-gray-400 italic">
                    Loading books...
                  </div>
                </TableCell>
              </tr>
            ) : error ? (
              <tr>
                <TableCell colSpan={5} center>
                  <div className="py-20 text-red-500 italic">{error}</div>
                </TableCell>
              </tr>
            ) : paginatedBooks.length > 0 ? (
              paginatedBooks.map((book) => (
                <tr
                  key={`${book.title}-${book.isbn}`}
                  className={`hover:bg-gray-50/50 transition-colors ${isAdmin ? "cursor-pointer" : ""}`}
                  onClick={() =>
                    isAdmin
                      ? navigate(`/books/${encodeURIComponent(book.title)}`)
                      : undefined
                  }
                >
                  <TableCell>
                    <p className="font-bold text-gray-900">{book.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      by {book.author}
                    </p>
                  </TableCell>
                  <TableCell center>
                    <span className="inline-flex px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-600">
                      {book.categoryDisplay}
                    </span>
                  </TableCell>
                  <TableCell center>
                    <p className="font-semibold text-gray-800">
                      {book.publisher}
                    </p>
                    <p className="text-xs font-mono text-gray-400 mt-0.5">
                      {book.isbn}
                    </p>
                  </TableCell>
                  <TableCell center>
                    <span className="font-black text-gray-900">
                      {book.inventory}
                    </span>
                  </TableCell>
                  <TableCell center>
                    <span
                      className={`inline-flex px-3 py-1 rounded-lg text-xs font-black ${
                        book.statusType === "out"
                          ? "bg-red-50 text-red-600"
                          : book.statusType === "low"
                            ? "bg-green-50 text-green-700"
                            : "bg-green-50 text-green-700"
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
                  <div className="py-20 text-gray-400 italic">
                    No books match your current filters.
                  </div>
                </TableCell>
              </tr>
            )}
          </DataTable>

          {/* Pagination Controls */}
          {filteredBooks.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-gray-50/30 -mx-4 md:-mx-5 -mb-4 md:-mb-5 rounded-b-xl">
              <p>
                Page {page + 1} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  className="h-8 px-3 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {paginationItems.map((item, idx) =>
                  item === "ellipsis" ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 text-gray-400"
                    >
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
                  className="h-8 px-3 rounded border border-gray-200 bg-white hover:bg-gray-50 font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      <AddBookModal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
        onCreated={async () => {
          setIsAddBookOpen(false);
          setIsLoading(true);
          setError(null);
          try {
            const pageSize = 100;
            let page = 0;
            let all: string[] = [];
            while (true) {
              const res = await api.getCategories({ page, size: pageSize });
              all = all.concat(res.content.map((c) => c.category_name));
              if (res.number + 1 >= res.totalPages) break;
              page += 1;
            }
            const [booksResponse, copiesResponse] = await Promise.all([
              api.getBooks(),
              api.getCopies().catch(() => [] as CopyResponse[]),
            ]);
            setBooks(booksResponse);
            setCopies(copiesResponse);
            setDbCategories(
              Array.from(new Set(all)).sort((a, b) => a.localeCompare(b)),
            );
          } catch (err) {
            console.error("Failed to refresh after book creation", err);
          } finally {
            setIsLoading(false);
          }
        }}
      />
    </Layout>
  );
};
const Stat = ({
  label,
  value,
  valueClassName = "text-gray-900",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
      {label}
    </p>
    <p className={`mt-2 text-4xl font-bold leading-none ${valueClassName}`}>
      {value}
    </p>
  </div>
);
