export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

export type BookResponse = {
  book_id: number;
  title: string;
  isbn?: string | null;
  publisher?: string | null;
  publish_year?: number | null;
  edition?: number | null;
  author?: string | null;
  description?: string | null;
  createdAt?: string | null;
  categories?: string[] | null;
};

export type CopyResponse = {
  copyId: number;
  bookId: number;
  status: string;
  createdAt?: string | null;
};

export type LoanResponse = {
  loanId: number;
  copyId: number;
  bookTitle: string;
  memberId: number;
  memberName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string | null;
  remarks?: string | null;
  createdAt?: string | null;
};

export type FineResponse = {
  fineId: number;
  loanId: number;
  memberId: number;
  memberName: string;
  amount: number;
  paidAmount?: number | null;
  status: string;
  paidDate?: string | null;
  reason?: string | null;
  createdAt?: string | null;
};

export type MemberResponse = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  role?: string | null;
  status?: string | null;
  membershipStart?: string | null;
  membershipEnd?: string | null;
};

export type DashboardStatsResponse = {
  totalBooks: number;
  availableCopies: number;
  issuedBooks: number;
  overdueLoans: number;
  unpaidFines: number;
};

export type CategoryCountResponse = {
  category: string;
  count: number;
};

export type ReportResponse = {
  month: number;
  year: number;
  totalLoans: number;
  newMembers: number;
  totalFinesCollected: number;
  averageOverdueDays: number;
  overdueCount: number;
  collectedFines: number;
  pendingFines: number;
  overdueDistribution: Record<string, number>;
  topCategories: CategoryCountResponse[];
  stockUtilization: number;
  returnRate: number;
};

export type MeResponse = {
  role: string;
  memberId: number;
};

export type LoanRequest = {
  memberId: number;
  copyId: number;
  issueDate: string;
  loanPeriodDays: number;
};

export type FineRequest = {
  loanId?: number;
  copyId?: number;
  amount: number;
  reason?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const API_V1 = `${API_BASE_URL}/v1`;

// Hook called when any request returns 401 — set by app root to redirect to login
let _onUnauthorized: (() => void) | null = null;
export const setOnUnauthorized = (cb: () => void) => { _onUnauthorized = cb; };

const buildQuery = (params?: Record<string, string | number | boolean | undefined | null>) => {
  if (!params) return "";
  const entries = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  return entries.length ? `?${entries.join("&")}` : "";
};

class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const requestJson = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    // Trigger global 401 handler (auto-logout / redirect to login)
    if (response.status === 401 && _onUnauthorized) {
      _onUnauthorized();
    }
    let message = response.statusText;
    try {
      const data = await response.json();
      message = data?.message || JSON.stringify(data);
    } catch {
      try {
        message = await response.text();
      } catch {
        message = response.statusText || "Request failed";
      }
    }
    throw new ApiError(message || "Request failed", response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch (err) {
    console.error("Failed to parse JSON response:", text);
    throw new ApiError("Invalid JSON response from server", response.status);
  }
};

export const api = {
  login: (email: string, password: string) =>
    requestJson<void>(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getMe: () =>
    requestJson<MeResponse>(`${API_BASE_URL}/auth/me`),

  logout: () =>
    requestJson<void>(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
    }),

  getBooks: (params?: {
    id?: number;
    isbn?: string;
    title?: string;
    author?: string;
    category?: string;
    availableOnly?: boolean;
    page?: number;
    size?: number;
  }) =>
    requestJson<BookResponse[]>(`${API_V1}/books${buildQuery(params)}`),

  getCopies: (params?: { id?: number; bookId?: number; status?: string }) =>
    requestJson<CopyResponse[]>(`${API_V1}/copies${buildQuery(params)}`),

  createCopies: (bookId: number, count: number) =>
    requestJson<CopyResponse[]>(`${API_V1}/copies`, {
      method: "POST",
      body: JSON.stringify({ bookId, count }),
    }),

  getLoans: (params?: {
    id?: number;
    memberId?: number;
    overdue?: boolean;
    active?: boolean;
    page?: number;
    size?: number;
  }) =>
    requestJson<Page<LoanResponse>>(`${API_V1}/loans${buildQuery(params)}`),

  createLoan: (data: LoanRequest) =>
    requestJson<LoanResponse>(`${API_V1}/loans`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  returnLoan: (loanId: number) =>
    requestJson<LoanResponse>(`${API_V1}/loans/${loanId}/return`, {
      method: "PUT",
    }),

  returnLoanByCopy: (copyId: number, remarks?: string) =>
    requestJson<LoanResponse>(`${API_V1}/loans/return`, {
      method: "PUT",
      body: JSON.stringify({ copyId, remarks }),
    }),

  deleteLoan: (loanId: number) =>
    requestJson<void>(`${API_V1}/loans/${loanId}`, { method: "DELETE" }),

  getFines: (params?: { id?: number; memberId?: number; status?: string; page?: number; size?: number }) =>
    requestJson<Page<FineResponse>>(`${API_V1}/fines${buildQuery(params)}`),

  createFine: (data: FineRequest) =>
    requestJson<FineResponse>(`${API_V1}/fines`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  markFinePaid: (fineId: number) =>
    requestJson<FineResponse>(`${API_V1}/fines/${fineId}/mark-paid`, {
      method: "PUT",
    }),

  getMembers: (params?: { id?: number; status?: string; name?: string; page?: number; size?: number }) =>
    requestJson<Page<MemberResponse>>(`${API_V1}/members${buildQuery(params)}`),

  toggleMemberStatus: (memberId: number) =>
    requestJson<void>(`${API_V1}/members/${memberId}/changestatus`, {
      method: "PUT",
    }),

  updateMember: (id: number, data: Partial<MemberResponse>) =>
    requestJson<MemberResponse>(`${API_V1}/members/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  changePassword: (memberId: number, data: { oldPassword: string; newPassword: string }) =>
    requestJson<void>(`${API_V1}/members/${memberId}/password`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getNextMemberId: () =>
    requestJson<number>(`${API_V1}/members/next-id`),

  getDashboardStats: () =>
    requestJson<DashboardStatsResponse>(`${API_V1}/dashboard/stats`),

  getCategoryCounts: () =>
    requestJson<CategoryCountResponse[]>(`${API_V1}/dashboard/categories`),

  getPriorityFollowUps: () =>
    requestJson<LoanResponse[]>(`${API_V1}/dashboard/priority-followups`),

  getReport: (params?: { month?: number; year?: number }) =>
    requestJson<ReportResponse>(`${API_V1}/reports${buildQuery(params)}`),

  sendOverdueEmail: (data: {
    memberId: number;
    memberName?: string;
    bookTitle?: string;
    dueDate?: string;
    daysOverdue?: number;
    fineAmount?: number;
    type?: "loan" | "fine";
    reason?: string;
  }) =>
    requestJson<void>(`${API_V1}/overdue/send-email`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createMember: (data: any) =>
    requestJson<MemberResponse>(`${API_V1}/members`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createBook: (data: any) =>
    requestJson<BookResponse>(`${API_V1}/books`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteBook: (bookId: number) =>
    requestJson<void>(`${API_V1}/books/${bookId}`, {
      method: "DELETE",
    }),

  getCategories: (params?: { page?: number; size?: number }) =>
    requestJson<Page<{ category_id: number; category_name: string }>>(`${API_V1}/categories${buildQuery(params)}`),
};

export { ApiError };
