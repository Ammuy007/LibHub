import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CircleAlert,
  Clock3,

  AlertCircle,
  Mail,
  MapPin,
  Phone,
  CheckCircle2,
  ReceiptIndianRupee,

} from "lucide-react";

// Layout & UI Components
import { MainLayout } from "../../components/ui/layout/MainLayout";
import { Button } from "../../components/ui/Button/Button";
import { DataTable, TableCell } from "../../components/ui/Table/Table";
import { SearchBar } from "../../components/ui/SearchBar/SearchBar";

// Modals
import { EditMemberModal } from "../../components/modals/EditMember/EditMemberModal";

// --- Types ---
type TabType = "active" | "history" | "fines";

interface LoanRecord {
  id: string;
  title: string;
  isbn: string;
  issuedOn: string;
  dueDate: string;
  returnDate?: string; // Only for history
  status: string;
  statusType: "due" | "overdue" | "returned";
}

interface FineRecord {
  id: string;
  title: string;
  copyId: string;
  issueDate: string;
  dueDate: string;
  amount: string;
  status: string;
}

// --- Static Data ---
const membersById: Record<string, { name: string; email: string; phone: string; address: string }> = {
  "MEM-2024-001": {
    name: "Alexander Thorne",
    email: "a.thorne@example.com",
    phone: "+1 (555) 098-1234",
    address: "451 Library Ave, Booktown, BK 101",
  }
};

const activeLoans: LoanRecord[] = [
  { id: "L-1024", title: "The Great Gatsby", isbn: "978-0743273565", issuedOn: "2024-05-01", dueDate: "2024-05-15", status: "Due Soon", statusType: "due" },
  { id: "L-1025", title: "Principles of Physics", isbn: "978-1118230725", issuedOn: "2024-04-20", dueDate: "2024-05-04", status: "Overdue", statusType: "overdue" },
  { id: "L-1028", title: "Modern Operating Systems", isbn: "978-0133591620", issuedOn: "2024-05-05", dueDate: "2024-05-19", status: "Due Soon", statusType: "due" },
];

const loanHistory: LoanRecord[] = [
  ...activeLoans,
  { id: "L-0912", title: "The Catcher in the Rye", isbn: "978-0316769488", issuedOn: "2024-01-10", dueDate: "2024-01-24", returnDate: "2024-01-22", status: "Returned", statusType: "returned" },
  { id: "L-0855", title: "Clean Code", isbn: "978-0132350884", issuedOn: "2023-12-05", dueDate: "2023-12-19", returnDate: "2023-12-20", status: "Returned Late", statusType: "returned" },
];

const finesData: FineRecord[] = [
  { id: "F-501", title: "Principles of Physics", copyId: "C-202", issueDate: "2024-04-20", dueDate: "2024-05-04", amount: "250.00", status: "Unpaid" },
  { id: "F-488", title: "Clean Code", copyId: "C-105", issueDate: "2023-12-05", dueDate: "2023-12-19", amount: "100.00", status: "Unpaid" },
];

// --- Main Component ---
export const MemberProfilePage: React.FC = () => {
  const { memberId = "MEM-2024-001" } = useParams();

  // States
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [isActive, setIsActive] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const member = membersById[memberId] || membersById["MEM-2024-001"];

  const handleConfirmToggle = () => {
    setIsActive((prev) => !prev);
    setIsConfirmModalOpen(false);
  };

  const filteredActiveLoans = useMemo(() => {
    const q = search.toLowerCase();
    return activeLoans.filter(l =>
      l.title.toLowerCase().includes(q) ||
      l.id.toLowerCase().includes(q) ||
      l.isbn.toLowerCase().includes(q)
    );
  }, [search]);

  const filteredLoanHistory = useMemo(() => {
    const q = search.toLowerCase();
    return loanHistory.filter(l =>
      l.title.toLowerCase().includes(q) ||
      l.id.toLowerCase().includes(q) ||
      l.isbn.toLowerCase().includes(q)
    );
  }, [search]);

  const filteredFines = useMemo(() => {
    const q = search.toLowerCase();
    return finesData.filter(f =>
      f.title.toLowerCase().includes(q) ||
      f.id.toLowerCase().includes(q) ||
      f.copyId.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <MainLayout>
      <div className="max-w-[1600px] mx-auto space-y-5">

        <div className="text-xs text-gray-500">
          <Link to="/members" className="hover:text-blue-600">Members</Link> / Profile View
        </div>


        <div className="flex items-start justify-between">
          <h1 className="text-4xl font-bold text-gray-900 leading-none">Member Profile</h1>
          <Button
            className={`transition-all duration-300 ${isActive ? "!bg-red-500 hover:!bg-red-600" : "!bg-green-600 hover:!bg-green-700"} !text-white flex items-center gap-2 mr-7`}
            onClick={() => setIsConfirmModalOpen(true)}
          >
            {isActive ? "Deactivate" : "Activate"}
          </Button>
        </div>

        {/* Deactivation Modal */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsConfirmModalOpen(false)} />
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-3 rounded-full ${isActive ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  <AlertCircle size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Confirm {isActive ? "Deactivation" : "Activation"}</h3>
                  <p className="text-sm text-gray-500 mt-2">Are you sure you want to {isActive ? "deactivate" : "activate"} <strong>{member.name}</strong>?</p>
                </div>
                <div className="flex gap-3 w-full pt-2">
                  <button className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl font-bold" onClick={() => setIsConfirmModalOpen(false)}>Cancel</button>
                  <button className={`flex-1 px-4 py-2.5 text-white rounded-xl font-bold ${isActive ? 'bg-red-500' : 'bg-green-600'}`} onClick={handleConfirmToggle}>Confirm</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Details Card */}
        <section className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-gray-900">{member.name}</h2>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {isActive ? "Active Member" : "Deactivated"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Member ID: #{memberId}</p>
              </div>
              <Button onClick={() => setIsEditModalOpen(true)}>Edit Profile</Button>
            </div>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <InfoItem icon={<Mail size={14} />} label="Email Address" value={member.email} />
              <InfoItem icon={<Phone size={14} />} label="Phone Number" value={member.phone} />
              <InfoItem icon={<MapPin size={14} />} label="Address" value={member.address} />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-3 border-b border-gray-100">
            <StatItem label="Join Date" value="Jan 12, 2024" />
            <StatItem label="Total Loans" value="48 Books" />
            <StatItem label="Active Fines" value="₹ 350.00" valueClass="text-red-600" />
          </div>

          {/* Tabs and Search */}
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <TabItem label="Active Loans" active={activeTab === "active"} onClick={() => setActiveTab("active")} />
              <TabItem label="Loan History" active={activeTab === "history"} onClick={() => setActiveTab("history")} />
              <TabItem label="Fines & Payments" badge="2" active={activeTab === "fines"} onClick={() => setActiveTab("fines")} />
            </div>
            <div className="relative w-full lg:w-72">
              <SearchBar placeholder="Search books..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          {/* Dynamic Table Section */}
          <div className="p-6">
            {activeTab === "active" && (
              <>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Current Active Loans</h3>
                  <p className="text-sm text-gray-500">Books currently held by the member.</p>
                </div>
                <DataTable headers={["ID", "Book Title", "ISBN", "Issued On", "Due Date", "Status"]}>
                  {filteredActiveLoans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-gray-50/50">
                      <TableCell><span className="text-xs font-mono text-gray-400">{loan.id}</span></TableCell>
                      <TableCell><span className="font-bold text-gray-900">{loan.title}</span></TableCell>
                      <TableCell center><span className="text-xs font-mono text-gray-400">{loan.isbn}</span></TableCell>
                      <TableCell center>{loan.issuedOn}</TableCell>
                      <TableCell center>{loan.dueDate}</TableCell>
                      <TableCell center><StatusBadge type={loan.statusType} label={loan.status} /></TableCell>
                    </tr>
                  ))}
                </DataTable>
              </>
            )}

            {activeTab === "history" && (
              <>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Loan History</h3>
                  <p className="text-sm text-gray-500">Historical record of all issued books.</p>
                </div>
                <DataTable headers={["ID", "Book Title", "ISBN", "Issued On", "Due Date", "Returned On", "Status"]}>
                  {filteredLoanHistory.map((loan) => (
                    <tr key={loan.id} className="hover:bg-gray-50/50">
                      <TableCell><span className="text-xs font-mono text-gray-400">{loan.id}</span></TableCell>
                      <TableCell><span className="font-bold text-gray-900">{loan.title}</span></TableCell>
                      <TableCell center><span className="text-xs font-mono text-gray-400">{loan.isbn}</span></TableCell>
                      <TableCell center>{loan.issuedOn}</TableCell>
                      <TableCell center>{loan.dueDate}</TableCell>
                      <TableCell center>{loan.returnDate || "N/A"}</TableCell>
                      <TableCell center><StatusBadge type={loan.statusType} label={loan.status} /></TableCell>
                    </tr>
                  ))}
                </DataTable>
              </>
            )}

            {activeTab === "fines" && (
              <>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Fines & Payments</h3>
                  <p className="text-sm text-gray-500">Outstanding charges for overdue or damaged items.</p>
                </div>
                <DataTable headers={["Fine ID", "Book Title / Copy", "Issue Date", "Due Date", "Amount", "Status"]}>
                  {filteredFines.map((fine) => (
                    <tr key={fine.id} className="hover:bg-gray-50/50">
                      <TableCell><span className="text-xs font-mono text-gray-400">{fine.id}</span></TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{fine.title}</span>
                          <span className="text-[10px] text-gray-400 uppercase">Copy: {fine.copyId}</span>
                        </div>
                      </TableCell>
                      <TableCell center>{fine.issueDate}</TableCell>
                      <TableCell center>{fine.dueDate}</TableCell>
                      <TableCell center><span>₹ {fine.amount}</span></TableCell>
                      <TableCell center>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-black bg-red-50 text-red-600">
                          <ReceiptIndianRupee size={12} /> {fine.status}
                        </span>
                      </TableCell>
                    </tr>
                  ))}
                </DataTable>
              </>
            )}
          </div>
        </section>
      </div>

      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={member}
        onSave={(updated) => console.log(updated)}
      />
    </MainLayout>
  );
};

// --- Helper Components ---
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <span className="mt-1 w-7 h-7 rounded-md bg-gray-100 text-gray-500 flex items-center justify-center">{icon}</span>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

const StatItem = ({ label, value, valueClass = "text-gray-900" }: { label: string; value: string; valueClass?: string }) => (
  <div className="px-6 py-4 border-r border-gray-100 last:border-r-0">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
    <p className={`mt-1 text-2xl font-semibold ${valueClass}`}>{value}</p>
  </div>
);

const TabItem = ({ label, active, badge, onClick }: { label: string; active?: boolean; badge?: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`pb-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${active ? "text-blue-600 border-blue-500" : "text-gray-600 border-transparent hover:text-gray-800"}`}
  >
    {label}
    {badge && <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold">{badge}</span>}
  </button>
);

const StatusBadge = ({ type, label }: { type: string; label: string }) => {
  const config: Record<string, { class: string; icon: React.ReactNode }> = {
    overdue: { class: "bg-red-50 text-red-600", icon: <CircleAlert size={12} /> },
    due: { class: "bg-gray-100 text-gray-600", icon: <Clock3 size={12} /> },
    returned: { class: "bg-green-50 text-green-600", icon: <CheckCircle2 size={12} /> },
  };
  const activeConfig = config[type] || config.due;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black ${activeConfig.class}`}>
      {activeConfig.icon} {label}
    </span>
  );
};