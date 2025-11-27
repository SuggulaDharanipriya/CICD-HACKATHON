import { NavLink, Link, useNavigate, Routes, Route } from "react-router-dom";
import { 
  FaHome, 
  FaCalendarCheck, 
  FaClipboardList, 
  FaFileInvoiceDollar, 
  FaNotesMedical, 
  FaUser, 
  FaSignOutAlt 
} from "react-icons/fa";
import "../admin/admincss/admin.css";
import "./patientcss/PatientSidebar.css";

import { useAuth } from "../contextapi/AuthContext";

// Import patient components
import PatientDashboard from "./PatientDashboard";
import AppointmentBooking from "./AppointmentBooking";
import MyAppointment from "./MyAppointment";
import UpcomingAppointments from "./UpcomingAppointments";
import BillingHistory from "./BillingHistory";
import MedicalHistory from "./MedicalHistory";
import PatientProfile from "./PatientProfile";
import UpdateProfile from "./UpdateProfile";

export default function PatientNavBar() {
  const navigate = useNavigate();
  const { setIsPatientLoggedIn } = useAuth();

  function handleLogout() {
    sessionStorage.clear();
    setIsPatientLoggedIn(false); // ✅ update auth state
    navigate("/patient/login", { replace: true }); // ✅ redirect to main login
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo" style={{ display: "flex", alignItems: "center" }}>
          <h1 style={{ fontSize: "22px", color: "white" }}>
            <strong>Health Records System Patient</strong>
          </h1>
        </div>

        <div className="profile-link">
          <ul>
            <li>
              <Link 
                to="/patient/profile" 
                style={{ display: "flex", alignItems: "center" }}
              >
                <div style={{
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "8px",
                  width: "30px",
                  height: "30px"
                }}>
                  <FaUser color="black" />
                </div>
                MyProfile
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="main-content">
        <aside className="sidebar">
          <h2 className="sidebar-heading">Menu</h2>
          <ul>
            <li><NavLink to="/patient/dashboard"><FaHome /> Dashboard</NavLink></li>
            <li><NavLink to="/patient/book"><FaCalendarCheck /> Book Appointment</NavLink></li>
            <li><NavLink to="/patient/upcoming"><FaCalendarCheck /> Upcoming Appointments</NavLink></li>
            <li><NavLink to="/patient/appointments"><FaClipboardList /> My Appointments</NavLink></li>
            <li><NavLink to="/patient/billing"><FaFileInvoiceDollar /> Billing History</NavLink></li>
            <li><NavLink to="/patient/medical"><FaNotesMedical /> Medical History</NavLink></li>
            <li><NavLink to="/patient/update"><FaUser /> Update Profile</NavLink></li>
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

        <main className="content">
          <Routes>
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/book" element={<AppointmentBooking />} />
            <Route path="/patient/upcoming" element={<UpcomingAppointments />} />
            <Route path="/patient/appointments" element={<MyAppointment />} />
            <Route path="/patient/billing" element={<BillingHistory />} />
            <Route path="/patient/medical" element={<MedicalHistory />} />
            <Route path="/patient/profile" element={<PatientProfile />} />
            <Route path="/patient/update" element={<UpdateProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
