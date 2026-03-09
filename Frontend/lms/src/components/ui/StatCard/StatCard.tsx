interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string; // e.g., 'blue', 'red', 'green'
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
}) => {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-sm transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>{icon}</div>
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-semibold">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
      </div>
    </div>
  );
};
