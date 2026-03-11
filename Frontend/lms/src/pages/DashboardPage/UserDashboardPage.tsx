import React, { useEffect, useMemo, useState } from "react";
import { UserLayout } from "../../components/ui/layout/UserLayout";
import { Mail, Phone, MapPin, Clock, BookOpen, Edit2 } from "lucide-react";
import { Button } from "../../components/ui/Button/Button";
import { EditProfileModal } from "../../components/modals/User/EditProfileModal";
import { api } from "../../services/api";
import type {
  BookResponse,
  LoanResponse,
  MemberResponse,
} from "../../services/api";
import { formatDueIn, formatMemberId, isOverdue } from "../../services/format";

export const UserDashboard: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [member, setMember] = useState<MemberResponse | null>(null);
  const [loans, setLoans] = useState<LoanResponse[]>([]);
  const [booksByTitle, setBooksByTitle] = useState<
    Record<string, BookResponse>
  >({});
  const [activeLoanPage, setActiveLoanPage] = useState(0);
  const activeLoanPageSize = 10;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadDashboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const me = await api.getMe();
        const [memberPage, loansPage, books] = await Promise.all([
          api.getMembers({ id: me.memberId, page: 0, size: 1 }),
          api.getLoans({ page: 0, size: 500 }),
          api.getBooks(),
        ]);
        if (!isMounted) return;
        setMember(memberPage.content[0] ?? null);
        setLoans(loansPage.content);
        const byTitle = books.reduce<Record<string, BookResponse>>(
          (acc, book) => {
            acc[book.title] = book;
            return acc;
          },
          {},
        );
        setBooksByTitle(byTitle);
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to load dashboard", err);
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

  const userProfile = {
    name: member?.name ?? "Member",
    email: member?.email ?? "-",
    phone: member?.phone ?? "-",
    location: member?.address ?? "-",
    id: member?.id
      ? formatMemberId(member.id, member.membershipStart)
      : "MEM-0000-0000",
  };

  const editProfileData = {
    name: userProfile.name,
    phone: userProfile.phone,
    location: userProfile.location,
  };

  const activeLoans = useMemo(() => {
    const active = loans.filter((loan) => !loan.returnDate);
    const start = activeLoanPage * activeLoanPageSize;
    return active.slice(start, start + activeLoanPageSize).map((loan) => {
      const book = booksByTitle[loan.bookTitle];
      const isbn = book?.isbn ?? "";
      const cover = isbn
        ? `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(isbn)}-M.jpg`
        : "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300";
      return {
        title: loan.bookTitle,
        author: book?.author ?? "Unknown",
        dueDate: formatDueIn(loan.dueDate),
        cover,
      };
    });
  }, [loans, booksByTitle, activeLoanPage]);

  const activeLoanTotalPages = useMemo(() => {
    const total = loans.filter((loan) => !loan.returnDate).length;
    return Math.max(1, Math.ceil(total / activeLoanPageSize));
  }, [loans]);

  const activeLoanPaginationItems = useMemo(() => {
    if (activeLoanTotalPages <= 1) return [0];
    const current = activeLoanPage;
    const last = activeLoanTotalPages - 1;
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
  }, [activeLoanPage, activeLoanTotalPages]);

    const recommendedBooks = useMemo(() => {
        const loanedTitles = new Set(loans.map((loan) => loan.bookTitle));
        const categoryCounts = new Map<string, number>();
        loans.forEach((loan) => {
            const book = booksByTitle[loan.bookTitle];
            (book?.categories ?? []).forEach((cat) => {
                if (!cat) return;
                categoryCounts.set(cat, (categoryCounts.get(cat) ?? 0) + 1);
            });
        });
        const topCategories = [...categoryCounts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([cat]) => cat);

        const byCategory = Object.values(booksByTitle).filter((book) =>
            (book.categories ?? []).some((cat) => topCategories.includes(cat)),
        );

        const unique = byCategory.filter((book) => !loanedTitles.has(book.title));
        const fallback = Object.values(booksByTitle).filter(
            (book) => !loanedTitles.has(book.title),
        );
        const merged = [...unique, ...fallback];
        return merged.slice(0, 10);
    }, [booksByTitle, loans]);

  const overdueCount = loans.filter((loan) =>
    isOverdue(loan.dueDate, loan.returnDate),
  ).length;

  return (
    <UserLayout>
      <div className=" mx-auto space-y-10 animate-in fade-in duration-700 pb-12">
        {/* 1. Profile Header & Annual Count */}
        <section className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm flex flex-col lg:flex-row justify-between gap-8">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  {userProfile.name}
                </h1>
                <p className="text-blue-500 font-bold text-sm mt-1">
                  Member ID: {userProfile.id}
                </p>
              </div>
              <Button
                variant="primary"
                className="h-9 text-xs font-bold"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit2 size={12} /> Edit Profile
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-50">
                <Mail size={16} className="text-blue-500" />
                <span className="text-sm font-semibold truncate">
                  {userProfile.email}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-50">
                <Phone size={16} className="text-blue-500" />
                <span className="text-sm font-semibold">
                  {userProfile.phone}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-50">
                <MapPin size={16} className="text-blue-500" />
                <span className="text-sm font-semibold truncate">
                  {userProfile.location}
                </span>
              </div>
            </div>
          </div>

          {/* Books Read This Year Statistic */}
          <div className="lg:w-48 bg-blue-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-blue-100">
            <BookOpen className="text-blue-500 mb-2" size={24} />
            <span className="text-3xl font-black text-blue-600">
              {isLoading
                ? "—"
                : loans.filter((loan) => {
                    if (!loan.returnDate) return false;
                    const year = new Date(loan.returnDate).getFullYear();
                    return year === new Date().getFullYear();
                  }).length}
            </span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mt-1">
              Books Read in {new Date().getFullYear()}
            </p>
          </div>
        </section>

        {/* 2. Active Loans (Maximum 3) */}
        <section>
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-[2px] mb-4">
            Current Loans
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="text-sm text-gray-400 italic">
                Loading loans...
              </div>
            ) : error ? (
              <div className="text-sm text-red-500 italic">{error}</div>
            ) : activeLoans.length === 0 ? (
              <div className="text-sm text-gray-400 italic">
                No active loans found.
              </div>
            ) : (
              activeLoans.map((loan, index) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm flex gap-4 hover:border-blue-100 transition-colors"
                >
                  <div className="w-20 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                    <img
                      src={loan.cover}
                      alt={loan.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="text-sm font-bold text-gray-900 leading-tight mb-1">
                      {loan.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-medium mb-3">
                      {loan.author}
                    </p>
                    <div className="flex items-center gap-1.5 text-orange-500 font-bold text-[10px] bg-orange-50 w-fit px-2 py-1 rounded-md">
                      <Clock size={12} />{" "}
                      {loan.dueDate === "Overdue"
                        ? "Overdue"
                        : `Due in ${loan.dueDate}`}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {activeLoanTotalPages > 1 && (
            <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
              <button
                disabled={activeLoanPage === 0}
                onClick={() => setActiveLoanPage(activeLoanPage - 1)}
                className="h-8 px-3 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {activeLoanPaginationItems.map((item, idx) =>
                item === "ellipsis" ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                    …
                  </span>
                ) : (
                  <button
                    key={`page-${item}`}
                    onClick={() => setActiveLoanPage(item)}
                    className={`h-8 min-w-8 px-2 rounded border ${
                      item === activeLoanPage
                        ? "border-blue-200 bg-blue-50 text-blue-600 font-semibold"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item + 1}
                  </button>
                ),
              )}
              <button
                disabled={activeLoanPage >= activeLoanTotalPages - 1}
                onClick={() => setActiveLoanPage(activeLoanPage + 1)}
                className="h-8 px-3 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </section>

        {/* 3. Recommended Books (Larger Display) */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-lg font-black text-gray-900">
              Recommended for You
            </h3>
          </div>
          <div className="flex gap-8 overflow-x-auto pb-6 no-scrollbar">
            {(recommendedBooks.length
              ? recommendedBooks
              : [1, 2, 3, 4, 5, 6]
            ).map((item, index) => {
              const isbn = typeof item === "number" ? "" : item.isbn ?? "";
              const coverUrl = isbn
                ? `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(isbn)}-M.jpg`
                : "";
              return (
                <div
                  key={typeof item === "number" ? item : (item.book_id ?? index)}
                  className="flex-shrink-0 w-44 group cursor-pointer"
                >
                  <div className="aspect-[2/3] bg-gray-100 rounded-[24px] mb-4 shadow-sm group-hover:-translate-y-2 group-hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={typeof item === "number" ? "Cover" : item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-300 uppercase tracking-widest">
                      {typeof item === "number" ? `Cover ${item}` : "Cover"}
                    </div>
                  </div>
                  <h4 className="text-sm font-black text-gray-900 truncate px-1">
                    {typeof item === "number"
                      ? `Library Collection ${item}`
                      : item.title}
                  </h4>
                </div>
              );
            })}
          </div>
        </section>

        {overdueCount > 0 && (
          <section className="space-y-4">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[2px]">
              Notifications
            </h3>
            <div className="bg-red-50/40 border border-red-100/50 p-5 rounded-2xl flex justify-between items-center">
              <div className="flex gap-4">
                <Clock className="text-red-500" size={20} />
                <div>
                  <p className="text-sm font-bold text-red-900">
                    Return Overdue Soon
                  </p>
                  <p className="text-[11px] text-red-700/70 font-medium">
                    {`You have ${overdueCount} overdue item${overdueCount > 1 ? "s" : ""}. Please return or renew them soon.`}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={editProfileData}
        onSave={async (data) => {
          if (!member?.id) return;
          const updated = await api.updateMember(member.id, {
            name: data.name,
            phone: data.phone,
            address: data.location,
          });
          setMember(updated);
        }}
      />
    </UserLayout>
  );
};
