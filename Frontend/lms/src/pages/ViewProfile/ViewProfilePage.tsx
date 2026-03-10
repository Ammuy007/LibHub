import React, { useEffect, useMemo, useState } from "react";
import { MainLayout } from "../../components/ui/layout/MainLayout";
import { Card } from "../../components/ui/Card/Card";
import {
    User,
    Mail,
    IdCard,
    Calendar,
    BookOpen,
    Users,
    Wallet
} from "lucide-react";
import { api } from "../../services/api";
import type { FineResponse, MemberResponse, LoanResponse } from "../../services/api";

export const ViewProfilePage: React.FC = () => {
    const [admin, setAdmin] = useState<MemberResponse | null>(null);
    const [members, setMembers] = useState<MemberResponse[]>([]);
    const [loans, setLoans] = useState<LoanResponse[]>([]);
    const [fines, setFines] = useState<FineResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const loadProfile = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [membersPage, loansPage, finesPage] = await Promise.all([
                    api.getMembers({ page: 0, size: 200 }),
                    api.getLoans({ page: 0, size: 500 }),
                    api.getFines({ page: 0, size: 500 }),
                ]);
                if (!isMounted) return;
                setMembers(membersPage.content);
                setLoans(loansPage.content);
                setFines(finesPage.content);
                const adminMember = membersPage.content.find((m) => m.role?.toLowerCase() === "admin") ?? null;
                setAdmin(adminMember);
            } catch (err) {
                if (!isMounted) return;
                console.error("Failed to load admin profile", err);
                setError("Unable to load profile.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadProfile();
        return () => {
            isMounted = false;
        };
    }, []);

    const adminStats = useMemo(() => {
        const finesCollected = fines
            .filter((fine) => fine.status?.toLowerCase() === "paid")
            .reduce((sum, fine) => sum + (fine.amount ?? 0), 0);
        return [
            { label: "Checkouts Processed", value: isLoading || error ? "—" : String(loans.length), icon: <BookOpen className="text-blue-600" /> },
            { label: "Members Registered", value: isLoading || error ? "—" : String(members.length), icon: <Users className="text-emerald-600" /> },
            { label: "Fines Collected", value: isLoading || error ? "—" : `Rs. ${finesCollected.toFixed(2)}`, icon: <Wallet className="text-orange-600" /> },
        ];
    }, [fines, loans, members, isLoading, error]);

    return (
        <MainLayout>
            <div className="mx-10 space-y-8 animate-in fade-in duration-500 pb-12">

                {/* Page Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Profile</h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-[2px]">Admin Account Overview</p>
                </div>

                {/* Profile Identity Section */}
                <div className="flex flex-col md:flex-row gap-10 items-start pt-4">
                    {/* Large Avatar Display */}
                    <div className="shrink-0">
                        <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-white shadow-xl">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                alt="Admin Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Primary Info */}
                    <div className="space-y-6 flex-1">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tight">{admin?.name ?? "Admin User"}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                                    System Administrator
                                </span>
                                <span className="flex items-center gap-1 text-xs text-green-600 font-bold ml-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div> Active Now
                                </span>
                            </div>
                        </div>

                        {/* Contact & Professional Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:text-blue-600 transition-colors">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                                    <p className="text-sm font-bold text-gray-900">{admin?.email ?? "-"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:text-blue-600 transition-colors">
                                    <IdCard size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Admin ID</p>
                                    <p className="text-sm font-bold text-gray-900">{admin?.id ? `ADM-${admin.id}` : "-"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:text-blue-600 transition-colors">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Joined Date</p>
                                    <p className="text-sm font-bold text-gray-900">{admin?.membershipStart ?? "-"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:text-blue-600 transition-colors">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account Level</p>
                                    <p className="text-sm font-bold text-gray-900">Super Admin Access</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Section (Impact Overview) */}
                <div className="pt-8">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[2px] mb-6">System Impact Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {adminStats.map((stat, index) => (
                            <Card key={index} className="p-6 border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5">
                                <div className="p-4 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform">
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                                    <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
