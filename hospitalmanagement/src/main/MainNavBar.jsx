import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

// Pages
import Home from "./Home";
import Contact from "./Contact";
import NotFound from "./NotFound";
import PatientLogin from "../patient/PatientLogin";
import PatientRegistration from "../patient/PatientRegistration";
import DoctorLogin from "../doctor/DoctorLogin";
import DoctorRegistration from "../doctor/DoctorRegistration";
import AdminLogin from "../admin/AdminLogin";

// Assets
import logo from "../assets/logo1.png";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// Styles
import "./maincss/style.css";

export default function MainNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) setIsDropdownOpen(false);
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        {/* ✅ Logo */}
        <div className="logo">
          <img src={logo} alt="Health Records System Logo" className="logo-img" />
          <span> MediTrack</span>
        </div>

        {/* ✅ Mobile Menu Toggle */}
        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        {/* ✅ Links */}
        <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to="/patient/registration" onClick={() => setIsMenuOpen(false)}>
              Patient Registration
            </Link>
          </li>
          <li>
            <Link to="/doctor/registration" onClick={() => setIsMenuOpen(false)}>
              Doctor Registration
            </Link>
          </li>

          {/* ✅ Dropdown */}
          <li className={`dropdown ${isDropdownOpen ? "active" : ""}`}>
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              Login{" "}
              <KeyboardArrowDownIcon
                className={`dropdown-icon ${isDropdownOpen ? "rotate" : ""}`}
              />
            </button>
            <ul className="dropdown-menu">
              <li>
                <Link to="/patient/login" onClick={() => setIsMenuOpen(false)}>Patient</Link>
              </li>
              <li>
                <Link to="/doctor/login" onClick={() => setIsMenuOpen(false)}>Doctor</Link>
              </li>
              <li>
                <Link to="/admin/login" onClick={() => setIsMenuOpen(false)}>Admin</Link>
              </li>
            </ul>
          </li>

          <li>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          </li>
        </ul>
      </nav>

      {/* ✅ Routes directly under MainNavBar (like AgroDirect) */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Auth routes */}
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/registration" element={<PatientRegistration />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/registration" element={<DoctorRegistration />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
