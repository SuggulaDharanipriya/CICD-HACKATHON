import { Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaCalendarCheck, 
  FaClipboardList, 
  FaNotesMedical, 
  FaUser, 
  FaSignOutAlt 
} from "react-icons/fa";
import "../admin/admincss/admin.css";
import "./doctorcss/DoctorSidebar.css";

import DoctorDashboard from "./DoctorDashboard.jsx";
import ViewAppointment from "./ViewAppointment.jsx";
import UpcomingAppointments from "./UpcomingAppointments.jsx";
import ScheduleManagement from "./ScheduleManagement.jsx";
import PrescriptionManagement from "./PrescriptionManagement.jsx";
import DoctorProfile from "./DoctorProfile.jsx";
import NotFound from "../main/NotFound.jsx";
import { useAuth } from "../contextapi/AuthContext";    
export default function DoctorNavBar() {
  const navigate = useNavigate();
  const { setIsDoctorLoggedIn } = useAuth();   

  function handleLogout() {
    sessionStorage.clear();
    setIsDoctorLoggedIn(false);  
    navigate("/doctor/login", { replace: true }); //  
  }

  return (
    <div className="app-container">
      {/* 🔹 Top Navbar */}
      <nav className="navbar">
        <div className="logo" style={{ display: "flex", alignItems: "center" }}>
          <h1 style={{ fontSize: "22px", color: "white" }}>
            <strong>Health Records System Doctor</strong>
          </h1>
        </div>

        {/* 🔹 Profile shortcut */}
        <div className="profile-link">
          <ul>
            <li>
              <Link 
                to="/doctor/profile" 
                style={{ display: "flex", alignItems: "center" }}
              >
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                    padding: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "8px",
                    width: "30px",
                    height: "30px"
                  }}
                >
                  <FaUser color="black" />
                </div>
                MyProfile
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* 🔹 Main Layout */}
      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2 className="sidebar-heading">Menu</h2>
          <ul>
            <li>
              <NavLink to="/doctor/dashboard">
                <FaHome /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/doctor/appointments">
                <FaCalendarCheck /> View Appointments
              </NavLink>
            </li>
            <li>
              <NavLink to="/doctor/upcoming">
                <FaCalendarCheck /> Upcoming Appointments
              </NavLink>
            </li>
            <li>
              <NavLink to="/doctor/schedule">
                <FaClipboardList /> Manage Schedule
              </NavLink>
            </li>
            <li>
              <NavLink to="/doctor/prescriptions">
                <FaNotesMedical /> Prescriptions
              </NavLink>
            </li>
            <li>
              <button 
                onClick={handleLogout} 
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  padding: "8px 16px"
                }}
              >
                <FaSignOutAlt style={{ marginRight: "8px" }} /> Logout
              </button>
            </li>
          </ul>
        </aside>

        {/* Content */}
        <main className="content">
          <Routes>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/appointments" element={<ViewAppointment />} />
            <Route path="/doctor/upcoming" element={<UpcomingAppointments />} />
            <Route path="/doctor/schedule" element={<ScheduleManagement />} />
            <Route path="/doctor/prescriptions" element={<PrescriptionManagement />} />
            <Route path="/doctor/profile" element={<DoctorProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
