
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import useAuth from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import AgentScanner from "./components/AgentScanner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Queues from "./pages/Queues";
import Tickets from "./pages/Tickets";
import AdminDashboard from "./pages/AdminDashboard";
import AgentDashboard from "./pages/AgentDashboard";

// Nouvelle page pour gérer les files
import AdminQueues from "./pages/AdminQueues";

function AppLayout() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Pages publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pages accessibles après connexion */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/queues" element={<Queues />} />
          <Route path="/tickets" element={<Tickets />} />

          {/* Pages réservées à l'administrateur */}
          <Route element={<RoleRoute allowedRole="ADMIN" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/queues" element={<AdminQueues />} />
          </Route>

          {/* Pages réservées à l'agent */}
          <Route element={<RoleRoute allowedRole="AGENT" />}>
            <Route path="/agent" element={<AgentDashboard />} />
            <Route
  path="/agent/scanner"
  element={<AgentScanner />}
/>
          </Route>
        </Route>

        {/* Redirections */}
     <Route path="/" element={<HomeRedirect />} />
    <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

function HomeRedirect() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  if (user?.role === "AGENT") {
    return <Navigate to="/agent" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}