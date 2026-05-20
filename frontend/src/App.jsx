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
          <Route
            path="/organization"
            element={
              <OrganizationRoute>
                <OrgLayout><OrganizationDashboard /></OrgLayout>
              </OrganizationRoute>
            }
          />
          <Route
            path="/organization/events"
            element={
              <OrganizationRoute>
                <OrgLayout><OrgEventsPage /></OrgLayout>
              </OrganizationRoute>
            }
          />
          <Route
            path="/organization/applications"
            element={
              <OrganizationRoute>
                <OrgLayout><OrgEventsPage /></OrgLayout>
              </OrganizationRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {/* Hide Footer on organization routes */}
      {!isOrgRoute && <Footer />}
    </div>
  );
}
