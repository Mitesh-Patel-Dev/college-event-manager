import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import useAuthStore from "./store/authStore";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import StudentDashboard from "./pages/StudentDashboard";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import OrgEventsPage from "./pages/OrgEventsPage";
import ApprovalsPage from "./pages/ApprovalsPage";
import ChecklistPage from "./pages/ChecklistPage";
import MarketingPage from "./pages/MarketingPage";
import RiskMatrixPage from "./pages/RiskMatrixPage";
import DBSchemaPage from "./pages/DBSchemaPage";
import UserRolesPage from "./pages/UserRolesPage";
import TechStackPage from "./pages/TechStackPage";

// ─── Route Guards ────────────────────────────────────────────
const PrivateRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" replace />;
};

const OrganizationRoute = ({ children }) => {
  const { token, user } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== "organization") return <Navigate to="/dashboard" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { token, user } = useAuthStore();
  if (!token) return children;
  return <Navigate to={user?.role === "organization" ? "/organization" : "/dashboard"} replace />;
};

// ─── Organization Layout (Sidebar + Content) ─────────────────
function OrgLayout({ children }) {
  return (
    <div className="org-layout">
      <Sidebar />
      <div className="org-main-content">
        {children}
      </div>
    </div>
  );
}

// Helper to wrap org routes
function OrgPage({ component: Component }) {
  return (
    <OrganizationRoute>
      <OrgLayout><Component /></OrgLayout>
    </OrganizationRoute>
  );
}

// ─── App ────────────────────────────────────────────────────
export default function App() {
  const location = useLocation();
  const isOrgRoute = location.pathname.startsWith("/organization");

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Hide Navbar on organization routes */}
      {!isOrgRoute && <Navbar />}
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />

          {/* Guest only */}
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

          {/* Student protected */}
          <Route path="/dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />

          {/* Organization protected — with sidebar layout */}
          <Route path="/organization" element={<OrgPage component={OrganizationDashboard} />} />
          <Route path="/organization/events" element={<OrgPage component={OrgEventsPage} />} />
          <Route path="/organization/approvals" element={<OrgPage component={ApprovalsPage} />} />
          <Route path="/organization/applications" element={<OrgPage component={ApprovalsPage} />} />
          
          {/* Categories */}
          <Route path="/organization/checklist" element={<OrgPage component={ChecklistPage} />} />
          <Route path="/organization/marketing" element={<OrgPage component={MarketingPage} />} />
          <Route path="/organization/risk-matrix" element={<OrgPage component={RiskMatrixPage} />} />
          
          {/* Architecture */}
          <Route path="/organization/db-schema" element={<OrgPage component={DBSchemaPage} />} />
          <Route path="/organization/user-roles" element={<OrgPage component={UserRolesPage} />} />
          <Route path="/organization/tech-stack" element={<OrgPage component={TechStackPage} />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {/* Hide Footer on organization routes */}
      {!isOrgRoute && <Footer />}
    </div>
  );
}
