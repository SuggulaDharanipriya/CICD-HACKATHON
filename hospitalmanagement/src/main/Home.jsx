import { FaUserMd, FaCalendarAlt, FaFileInvoiceDollar, FaHospital } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import image from '../assets/hms1.png';
import "./css/Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="container"> {/* <-- important wrapper */}
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content row">
          <div className="hero-text col">
            <h1>Welcome to Health Records System 🩺</h1>
       
            <p className="hero-description">
              Secure storage and management of patient health records. Patients can access their medical history, prescriptions, and lab reports. Healthcare providers can update records and monitor patient progress. Streamlined communication between patients and doctors with data privacy and compliance.
            </p>
            <div className="hero-buttons">
              <button
                className="primary-btn"
                onClick={() => navigate("/patient/login")}
              >
                Login as Patient
              </button>
              <button
                className="secondary-btn"
                onClick={() => navigate("/doctor/login")}
              >
                Login as Doctor
              </button>
            </div>
          </div>

          <div className="hero-image col">
            <img
              src={image}
              alt="Health Records System"
              style={{
                width: "100%",
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
              }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Health Records System is Right for You?</h2>
        <div className="features-grid row">
          <div className="feature-card col">
            <FaUserMd className="feature-icon" />
            <h3>Secure Records</h3>
            <p>Patients can securely access their medical history, prescriptions, and lab reports</p>
          </div>
          <div className="feature-card col">
            <FaCalendarAlt className="feature-icon" />
            <h3>Health Monitoring</h3>
            <p>Healthcare providers can update records and monitor patient progress seamlessly</p>
          </div>
          <div className="feature-card col">
            <FaFileInvoiceDollar className="feature-icon" />
            <h3>Data Privacy</h3>
            <p>Ensures data privacy and compliance with healthcare regulations</p>
          </div>
          <div className="feature-card col">
            <FaHospital className="feature-icon" />
            <h3>Communication</h3>
            <p>Streamlined communication between patients and doctors</p>
          </div>
        </div>
      </section>
    </div>
  );
}
