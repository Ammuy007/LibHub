import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
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


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/members/:memberId" element={<MemberProfilePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:bookId" element={<BookDetailsPage />} />
        <Route path="/copies" element={<CopiesPage />} />
        <Route path="/loans" element={<LoansPage />} />
        <Route path="/fines" element={<FinesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/overdueitems" element={<OverdueItemsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
