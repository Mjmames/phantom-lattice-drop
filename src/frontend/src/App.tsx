import { Layout } from "@/components/Layout";
import { useAdmin } from "@/hooks/useAdmin";
import { AboutPage } from "@/pages/AboutPage";
import { AdminLoginPage } from "@/pages/AdminLoginPage";
import { AdminPage } from "@/pages/AdminPage";
import { ChoicePage } from "@/pages/ChoicePage";
import { DashboardPage } from "@/pages/DashboardPage";
import { RegistrationPage } from "@/pages/RegistrationPage";
import { TiersPage } from "@/pages/TiersPage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAdmin();
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<AboutPage />} />
          <Route path="/choose" element={<ChoicePage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/tiers" element={<TiersPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
