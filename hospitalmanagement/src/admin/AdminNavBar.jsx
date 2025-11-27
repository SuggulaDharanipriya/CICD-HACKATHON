import { NavLink, useNavigate, Routes, Route } from "react-router-dom";
import "./admincss/admin.css";
import "./admincss/AdminSidebar.css";
import { useAuth } from "../contextapi/AuthContext";

import AdminDashboard from "./AdminDashboard";
import BillingManagement from "./BillingManagement";
import ManageAppointments from "./ManageAppointments";
import AddDoctor from "./AddDoctor";
import ManageDoctors from "./ManageDoctors";
import ManageSchedules from "./ManageSchedules";
import ReportsAndAnalytics from "./ReportsAndAnalytics";
import ManagePatients from "./ManagePatients";

export default function AdminNavBar() {
  const navigate = useNavigate();
  const { setIsAdminLoggedIn } = useAuth();

  function handleLogout() {
    sessionStorage.clear();
    setIsAdminLoggedIn(false);
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="app-container admin-container">
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="logo">
          <h1 style={{ color: "white" }}>Health Records System Admin</h1>
        </div>
      </nav>

      {/* Sidebar + Content */}
      <div className="main-content">
        <aside className="sidebar admin-sidebar">
          <h2 className="sidebar-heading">Menu</h2>
          <ul>
            <li><NavLink to="/admin/dashboard">Dashboard</NavLink></li>
            <li><NavLink to="/admin/manage-appointments">Manage Appointments</NavLink></li>
            <li><NavLink to="/admin/add-doctor">Add Doctor</NavLink></li>
        
           
                <li><NavLink to="/admin/manage-doctors">Manage Doctors</NavLink></li>
            <li><NavLink to="/admin/manage-patients">Manage Patients</NavLink></li>
            <li><NavLink to="/admin/billing">Billing</NavLink></li>
             <li><NavLink to="/admin/manage-schedules">Manage Schedules</NavLink></li>
            <li><NavLink to="/admin/reports">Reports</NavLink></li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </aside>

        <main className="content">
          <Routes>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/manage-appointments" element={<ManageAppointments />} />
            <Route path="/admin/add-doctor" element={<AddDoctor />} />
            <Route path="/admin/manage-doctors" element={<ManageDoctors />} />
            
            <Route path="/admin/manage-patients" element={<ManagePatients />} />
            <Route path="/admin/manage-schedules" element={<ManageSchedules />} />
            <Route path="/admin/billing" element={<BillingManagement />} />
            <Route path="/admin/reports" element={<ReportsAndAnalytics />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
