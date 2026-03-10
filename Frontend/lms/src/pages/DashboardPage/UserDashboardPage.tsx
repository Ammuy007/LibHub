import React, { useEffect, useMemo, useState } from "react";
import { UserLayout } from "../../components/ui/layout/UserLayout";
import { Mail, Phone, MapPin, Clock, BookOpen, Edit2 } from "lucide-react";
import { Button } from "../../components/ui/Button/Button";
import { EditProfileModal } from "../../components/modals/User/EditProfileModal";
import { api } from "../../services/api";
import type { BookResponse, LoanResponse, MemberResponse } from "../../services/api";
import { formatDueIn, formatMemberId, isOverdue } from "../../services/format";

export const UserDashboard: React.FC = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [member, setMember] = useState<MemberResponse | null>(null);
    const [loans, setLoans] = useState<LoanResponse[]>([]);
    const [booksByTitle, setBooksByTitle] = useState<Record<string, BookResponse>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const loadDashboard = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [memberPage, loansPage, books] = await Promise.all([
                    api.getMembers({ page: 0, size: 1 }),
                    api.getLoans({ page: 0, size: 50 }),
                    api.getBooks(),
                ]);
                if (!isMounted) return;
                setMember(memberPage.content[0] ?? null);
                setLoans(loansPage.content);
                const byTitle = books.reduce<Record<string, BookResponse>>((acc, book) => {
                    acc[book.title] = book;
                    return acc;
                }, {});
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
        id: member?.id ? formatMemberId(member.id) : "LC-000000"
    };

    const activeLoans = useMemo(() => {
        return loans
            .filter((loan) => !loan.returnDate)
            .slice(0, 3)
            .map((loan) => {
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
    }, [loans, booksByTitle]);

    const recommendedBooks = useMemo(() => {
        return Object.values(booksByTitle).slice(0, 5);
    }, [booksByTitle]);

    const overdueCount = loans.filter((loan) => isOverdue(loan.dueDate, loan.returnDate)).length;

    return (
        <UserLayout>
            <div className=" mx-auto space-y-10 animate-in fade-in duration-700 pb-12">

                {/* 1. Profile Header & Annual Count */}
                <section className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm flex flex-col lg:flex-row justify-between gap-8">
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight">{userProfile.name}</h1>
                                <p className="text-blue-500 font-bold text-sm mt-1">Member ID: {userProfile.id}</p>
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
                                <span className="text-sm font-semibold truncate">{userProfile.email}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-50">
                                <Phone size={16} className="text-blue-500" />
                                <span className="text-sm font-semibold">{userProfile.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-50">
                                <MapPin size={16} className="text-blue-500" />
                                <span className="text-sm font-semibold truncate">{userProfile.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Books Read This Year Statistic */}
                    <div className="lg:w-48 bg-blue-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-blue-100">
                        <BookOpen className="text-blue-500 mb-2" size={24} />
                        <span className="text-3xl font-black text-blue-600">
                            {isLoading ? "—" : loans.filter((loan) => loan.returnDate && loan.returnDate.startsWith(new Date().getFullYear().toString())).length}
                        </span>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mt-1">Books Read in 2026</p>
                    </div>
                </section>

                {/* 2. Active Loans (Maximum 3) */}
                <section>
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[2px] mb-4">Current Loans</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {isLoading ? (
                            <div className="text-sm text-gray-400 italic">Loading loans...</div>
                        ) : error ? (
                            <div className="text-sm text-red-500 italic">{error}</div>
                        ) : activeLoans.length === 0 ? (
                            <div className="text-sm text-gray-400 italic">No active loans found.</div>
                        ) : (
                            activeLoans.map((loan, index) => (
                                <div key={index} className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm flex gap-4 hover:border-blue-100 transition-colors">
                                    <div className="w-20 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                                        <img src={loan.cover} alt={loan.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h4 className="text-sm font-bold text-gray-900 leading-tight mb-1">{loan.title}</h4>
                                        <p className="text-[11px] text-gray-400 font-medium mb-3">{loan.author}</p>
                                        <div className="flex items-center gap-1.5 text-orange-500 font-bold text-[10px] bg-orange-50 w-fit px-2 py-1 rounded-md">
                                            <Clock size={12} /> {loan.dueDate === "Overdue" ? "Overdue" : `Due in ${loan.dueDate}`}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* 3. Recommended Books (Larger Display) */}
                <section>
                    <div className="flex justify-between items-end mb-6">
                        <h3 className="text-lg font-black text-gray-900">Recommended for You</h3>

                    </div>
                    <div className="flex gap-8 overflow-x-auto pb-6 no-scrollbar">
                        {(recommendedBooks.length ? recommendedBooks : [1, 2, 3, 4, 5]).map((item, index) => (
                            <div key={typeof item === "number" ? item : item.book_id ?? index} className="flex-shrink-0 w-44 group cursor-pointer">
                                <div className="aspect-[2/3] bg-gray-100 rounded-[24px] mb-4 shadow-sm group-hover:-translate-y-2 group-hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-300 uppercase tracking-widest">
                                        {typeof item === "number" ? `Cover ${item}` : "Cover"}
                                    </div>
                                </div>
                                <h4 className="text-sm font-black text-gray-900 truncate px-1">
                                    {typeof item === "number" ? `Library Collection ${item}` : item.title}
                                </h4>
                                <p className="text-xs text-gray-400 font-bold px-1">Premium Choice</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Important Notifications */}
                <section className="space-y-4">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[2px]">Notifications</h3>
                    <div className="bg-red-50/40 border border-red-100/50 p-5 rounded-2xl flex justify-between items-center">
                        <div className="flex gap-4">
                            <Clock className="text-red-500" size={20} />
                            <div>
                                <p className="text-sm font-bold text-red-900">Return Overdue Soon</p>
                                <p className="text-[11px] text-red-700/70 font-medium">
                                    {overdueCount > 0
                                        ? `You have ${overdueCount} overdue item${overdueCount > 1 ? "s" : ""}. Please return or renew them soon.`
                                        : "Please return or renew items before the due date to avoid service suspension."}
                                </p>
                            </div>
                        </div>

                    </div>
                </section>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={userProfile}
            />
        </UserLayout>
    );
};
