// src/App.jsx - Add Home route
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Home from "./Pages/Home"; // ✅ Add this import
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import TicketPage from './Pages/TicketPage';
import Projects from "./Pages/Projects";
import Layout from "./components/Layout/Layout";
import KanbanBoard from "./Pages/KanbanBoard";
import AcceptInvitation from "./components/Project/AcceptInvitation";

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Sprintify
          </h2>
          <p className="text-slate-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Home Route */}
        <Route path="/" element={<Home />} />
        
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <Register />}
        />
        
        {/* Protected routes with Layout */}
        {user && (
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tickets" element={<TicketPage />} />
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/accept-invitation/:token" element={<AcceptInvitation />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;