export const formatMemberId = (
  id?: number | null,
  membershipStart?: string | null,
) => {
  if (!id && id !== 0) return "MEM-0000-0000";
  const date = membershipStart ? new Date(membershipStart) : null;
  const year =
    date && !Number.isNaN(date.getTime()) ? date.getFullYear() : new Date().getFullYear();
  return `MEM-${year}-${String(id).padStart(4, "0")}`;
};

export const parseMemberId = (value?: string | null) => {
  if (!value) return null;
  const digits = value.match(/\d+/g);
  if (!digits || digits.length === 0) return null;
  const last = digits[digits.length - 1];
  const parsed = Number.parseInt(last, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

export const formatDate = (value?: string | null, withYear = true) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
  };
  if (withYear) options.year = "numeric";
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

export const formatDateISO = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
};

export const formatCurrency = (amount?: number | null, prefix = "Rs.") => {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return `${prefix}0.00`;
  }
  return `${prefix}${amount.toFixed(2)}`;
};

export const formatRelativeTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const diffMs = date.getTime() - Date.now();
  const diffSeconds = Math.round(diffMs / 1000);
  const absSeconds = Math.abs(diffSeconds);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absSeconds < 60) return rtf.format(Math.round(diffSeconds), "second");
  const diffMinutes = Math.round(diffSeconds / 60);
  if (Math.abs(diffMinutes) < 60) return rtf.format(diffMinutes, "minute");
  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour");
  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) < 30) return rtf.format(diffDays, "day");
  const diffMonths = Math.round(diffDays / 30);
  if (Math.abs(diffMonths) < 12) return rtf.format(diffMonths, "month");
  const diffYears = Math.round(diffMonths / 12);
  return rtf.format(diffYears, "year");
};

export const formatDueIn = (dueDate?: string | null) => {
  if (!dueDate) return "-";
  const date = new Date(dueDate);
  if (Number.isNaN(date.getTime())) return dueDate;
  const diffMs = date.getTime() - Date.now();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Overdue";
  if (diffDays === 1) return "1 day";
  if (diffDays < 7) return `${diffDays} days`;
  const weeks = Math.ceil(diffDays / 7);
  return weeks === 1 ? "1 week" : `${weeks} weeks`;
};

export const isOverdue = (dueDate?: string | null, returnDate?: string | null) => {
  if (!dueDate || returnDate) return false;
  const due = new Date(dueDate);
  if (Number.isNaN(due.getTime())) return false;
  return due.getTime() < Date.now();
};

export const pick = <T>(value: T | null | undefined, fallback: T) =>
  value === null || value === undefined ? fallback : value;
