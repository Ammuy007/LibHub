import React, { useMemo, useState } from "react";
import {
  BookCopy,
  CircleAlert,
  Clock3,
  ShieldCheck,
  Trash2,

  Plus
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "../../components/ui/layout/MainLayout";
import { Modal } from "../../components/modals/Register/Modal";
import { Button } from "../../components/ui/Button/Button";
import { DataTable, TableCell } from "../../components/ui/Table/Table";

const bookInfoByTitle: Record<string, any> = {
  "The Midnight Library": {
    title: "The Midnight Library",
    author: "Matt Haig",
    isbn: "978-059355947-4",
    publisher: "Viking",
    year: "2020",
    category: "Contemporary Fiction",
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
  },
};

const copies = [
  { id: "CP-001", accessionNo: "LMS-9621", status: "Available", statusType: "ok", dueDate: "-", lastBorrowed: "2024-03-12", currentHolder: "Library Shelf" },
  { id: "CP-002", accessionNo: "LMS-9622", status: "Issued", statusType: "issued", dueDate: "2024-05-20", lastBorrowed: "2024-05-06", currentHolder: "Sarah Jenkins" },
  { id: "CP-003", accessionNo: "LMS-9623", status: "Issued", statusType: "issued", dueDate: "2024-04-29", lastBorrowed: "2024-04-08", currentHolder: "Michael Chen" },
];

const activities = [
  { action: "Returned by Jonathan Reed", meta: "Copy CP-002 | Apr 17, 2024" },
  { action: "Borrowed by Sarah Jenkins", meta: "Copy CP-002 | May 06, 2024" },
];

export const BookDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookId = "The Midnight Library" } = useParams();
  const decodedTitle = decodeURIComponent(bookId);

  // States

  const [isAddCopyModalOpen, setIsAddCopyModalOpen] = useState(false);
  const [copiesToAdd, setCopiesToAdd] = useState("1");
  const [addedCopies, setAddedCopies] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const book = bookInfoByTitle[decodedTitle] || bookInfoByTitle["The Midnight Library"];

  const statCounts = useMemo(() => ({
    total: 12 + addedCopies,
    available: 5 + addedCopies,
    issued: 6,
    overdue: 1,
  }), [addedCopies]);

  const handleAddCopies = () => {
    const parsedValue = parseInt(copiesToAdd, 10);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setAddedCopies(prev => prev + parsedValue);
      setIsAddCopyModalOpen(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/books" className="text-sm text-gray-500 hover:text-blue-600">← Back to Catalog</Link>
            <h1 className="text-2xl font-bold text-gray-900">Book Details</h1>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setIsAddCopyModalOpen(true)}>
              <Plus size={16} /> Add New Copy
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 size={16} /> Delete
            </Button>
          </div>
        </div>

        {/* Book Info Card */}
        <section className="rounded-[32px] border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="p-8 flex flex-col lg:flex-row gap-8">
            <div className="w-40 h-56 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
              <BookCopy size={40} className="text-blue-200" />
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600">
                  {book.category}
                </span>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">{book.title}</h2>
                <p className="text-gray-500 font-medium italic">by {book.author}</p>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed max-w-3xl">{book.description}</p>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                <Meta label="ISBN-13" value={book.isbn} />
                <Meta label="Publisher" value={book.publisher} />
                <Meta label="Year" value={book.year} />

              </div>
            </div>
          </div>


          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-gray-100">
            <Stat icon={<BookCopy size={16} />} label="Total Copies" value={statCounts.total} />
            <Stat icon={<ShieldCheck size={16} />} label="Available" value={statCounts.available} />
            <Stat icon={<Clock3 size={16} />} label="Issued" value={statCounts.issued} />
            <Stat icon={<CircleAlert size={16} />} label="Overdue" value={statCounts.overdue} valueClass="text-red-500" />
          </div>



          {/* Inventory Table */}
          <DataTable headers={["Copy ID", "Accession", "Status", "Due Date", "Current Holder"]}>
            {copies.map((copy) => (
              <tr key={copy.id} className="group hover:bg-gray-50/50 transition-colors">
                <TableCell className="font-mono text-xs text-blue-600 font-bold px-8">
                  {copy.id}
                </TableCell>
                <TableCell center className="text-sm font-bold text-gray-700">
                  {copy.accessionNo}
                </TableCell>
                <TableCell center>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${copy.statusType === 'ok' ? 'bg-green-50 text-green-600' :
                    copy.statusType === 'issued' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                    }`}>
                    {copy.status}
                  </span>
                </TableCell>
                <TableCell center className="text-sm text-gray-500">
                  {copy.dueDate}
                </TableCell>
                <TableCell center className="text-sm font-bold text-gray-700">
                  {copy.currentHolder}
                </TableCell>
              </tr>
            ))}
          </DataTable>
        </section>
      </div>

      {/* Modals remain the same as previous logic but with updated variant calls */}
      <Modal
        isOpen={isAddCopyModalOpen}
        onClose={() => setIsAddCopyModalOpen(false)}
        variant="clean"
        title="Add New Copy"
        maxWidthClassName="max-w-md"
        subtitle="Add new physical copy of this book to the library"
        footer={
          <div className="flex gap-3 w-full">
            <button className="flex-1 h-12 rounded-xl bg-gray-50 font-bold text-gray-500" onClick={() => setIsAddCopyModalOpen(false)}>Cancel</button>
            <button className="flex-[2] h-12 rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-100" onClick={handleAddCopies}>Confirm</button>
          </div>
        }
      >
        <div className="space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantity</label>
          <input
            type="number"
            min={1}
            value={copiesToAdd}
            onChange={(e) => setCopiesToAdd(e.target.value)}
            className="w-full h-12 bg-gray-50 rounded-2xl px-4 font-bold text-gray-800 focus:ring-2 focus:ring-blue-100 transition-all border-none"
          />
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        variant="danger"
        title="Delete Book"
        subtitle="This action cannot be undone."
        maxWidthClassName="max-w-md"
        footer={
          <div className="flex gap-3 w-full">
            <button className="flex-1 h-12 rounded-xl bg-gray-50 font-bold text-gray-500" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
            <button className="flex-[2] h-12 rounded-xl bg-red-600 font-bold text-white shadow-lg shadow-red-100" onClick={() => navigate("/books")}>Confirm Delete</button>
          </div>
        }
      >
        <p className="text-sm text-gray-500 leading-relaxed px-1">
          Are you sure you want to remove <span className="font-bold text-gray-900">{book.title}</span> from the library catalog?
        </p>
      </Modal>
    </MainLayout>
  );
};

// Sub-components
const Meta = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
    <p className="text-sm font-bold text-gray-700">{value}</p>
  </div>
);

const Stat = ({ icon, label, value, valueClass = "text-gray-900" }: any) => (
  <div className="px-8 py-5 border-r border-gray-100 last:border-r-0">
    <div className="flex items-center gap-2 text-gray-400 mb-1">
      {icon}
      <p className="text-[10px] font-black uppercase tracking-widest">{label}</p>
    </div>
    <p className={`text-2xl font-black ${valueClass}`}>{value}</p>
  </div>
);