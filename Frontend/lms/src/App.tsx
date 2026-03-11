import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import { setOnUnauthorized } from "./services/api";
import { DashboardPage } from "./pages/DashboardPage/DashboardPage";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { MembersPage } from "./pages/MembersPage/MembersPage";
import { MemberProfilePage } from "./pages/MemberProfilePage/MemberProfilePage";
import { BooksPage } from "./pages/BooksPage/BooksPage";
import { BookDetailsPage } from "./pages/BookDetailsPage/BookDetailsPage";
import { CopiesPage } from "./pages/CopiesPage/CopiesPage";
import { LoansPage } from "./pages/LoansPage/LoansPage";
import { FinesPage } from "./pages/FinesPage/FinesPage";
import { ReportsPage } from "./pages/ReportsPage/ReportsPage";
import { OverdueItemsPage } from "./pages/OverdueItems/OverdueItems";
import { SettingsPage } from "./pages/Settings/SettingsPage";
import { UserDashboard } from "./pages/DashboardPage/UserDashboardPage";
import { UserLoansPage } from "./pages/LoansPage/UserLoansPage";
import { UserFinesPage } from "./pages/FinesPage/UserFinesPage";
import { UserSecurityPage } from "./pages/Security/UserSecurityPage";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  let token = "";
  try {
    token = localStorage.getItem("authToken") ?? "";
  } catch {
    token = "";
  }
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

/**
 * Inner component so useNavigate() is inside the Router context.
 * Registers a global 401 handler that clears the token and redirects to login.
 */
function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    setOnUnauthorized(() => {
      try { localStorage.removeItem("authToken"); } catch { /* noop */ }
      navigate("/", { replace: true });
    });
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
      <Route path="/user/dashboard" element={<RequireAuth><UserDashboard /></RequireAuth>} />
      <Route path="/members" element={<RequireAuth><MembersPage /></RequireAuth>} />
      <Route path="/members/:memberId" element={<RequireAuth><MemberProfilePage /></RequireAuth>} />
      <Route path="/books" element={<RequireAuth><BooksPage /></RequireAuth>} />
      <Route path="/books/:bookId" element={<RequireAuth><BookDetailsPage /></RequireAuth>} />
      <Route path="/copies" element={<RequireAuth><CopiesPage /></RequireAuth>} />
      <Route path="/loans" element={<RequireAuth><LoansPage /></RequireAuth>} />
      <Route path="/fines" element={<RequireAuth><FinesPage /></RequireAuth>} />
      <Route path="/reports" element={<RequireAuth><ReportsPage /></RequireAuth>} />
      <Route path="/overdueitems" element={<RequireAuth><OverdueItemsPage /></RequireAuth>} />
      <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
      <Route path="/user/loans" element={<RequireAuth><UserLoansPage /></RequireAuth>} />
      <Route path="/user/fines" element={<RequireAuth><UserFinesPage /></RequireAuth>} />
      <Route path="/user/books" element={<RequireAuth><BooksPage /></RequireAuth>} />
      <Route path="/security" element={<RequireAuth><UserSecurityPage /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
