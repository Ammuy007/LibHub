export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: any = {
    Active: "bg-green-100 text-green-700",
    Overdue: "bg-red-100 text-red-700",
    Pending: "bg-orange-100 text-orange-700",
    Returned: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
};
