import React from "react";
import {
  FaUserMd,
  FaProcedures,
  FaClinicMedical,
  FaHeartbeat,
  FaHandHoldingMedical,
  FaShieldAlt,
  FaLightbulb,
  FaGlobe,
} from "react-icons/fa";
import "./admincss/about.css";

const About = () => {
  return (
    <div className="about-container">
      {/* Header Section */}
      <div className="about-header">
        <div className="header-content">
          <h1>Welcome to Health Records System</h1>
          <p className="subtitle">Secure Health Records Management Through Technology</p>
        </div>
      </div>

      <div className="main-content">
        {/* Left Side - Vision & Values */}
        <div className="left-section">
          <div className="vision-card">
            <FaHeartbeat className="vision-icon" />
            <h2>Our Mission</h2>
            <p>
              To provide secure storage and management of patient health records. 
              Patients can access their medical history, prescriptions, and lab reports. 
              Healthcare providers can update records and monitor patient progress with streamlined communication.
            </p>
          </div>

          <div className="values-section">
            <h2>Core Values</h2>
            <div className="values-grid">
              <div className="value-item">
                <FaHandHoldingMedical className="value-icon" />
                <h3>Compassion</h3>
                <p>
                  Caring for patients with empathy, dignity, and respect in
                  every interaction.
                </p>
              </div>
              <div className="value-item">
                <FaShieldAlt className="value-icon" />
                <h3>Trust & Safety</h3>
                <p>
                  Ensuring patient safety and confidentiality through reliable
                  practices.
                </p>
              </div>
              <div className="value-item">
                <FaLightbulb className="value-icon" />
                <h3>Innovation</h3>
                <p>
                  Adopting modern medical technologies and solutions for better
                  outcomes.
                </p>
              </div>
              <div className="value-item">
                <FaGlobe className="value-icon" />
                <h3>Global Standards</h3>
                <p>
                  Delivering healthcare services that match international
                  quality benchmarks.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Features & Stats */}
        <div className="right-section">
          <div className="features-section">
            <h2>System Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <FaUserMd className="feature-icon" />
                <div className="feature-content">
                  <h3>Secure Records</h3>
                  <p>
                    Secure storage and management of patient health records with data privacy compliance.
                  </p>
                </div>
              </div>

              <div className="feature-card">
                <FaProcedures className="feature-icon" />
                <div className="feature-content">
                  <h3>Health Monitoring</h3>
                  <p>
                    Healthcare providers can update records and monitor patient progress seamlessly.
                  </p>
                </div>
              </div>

              <div className="feature-card">
                <FaClinicMedical className="feature-icon" />
                <div className="feature-content">
                  <h3>Medical History Access</h3>
                  <p>
                    Patients can access their medical history, prescriptions, and lab reports anytime.
                  </p>
                </div>
              </div>

              <div className="feature-card">
                <FaChartLine className="feature-icon" />
                <div className="feature-content">
                  <h3>Streamlined Communication</h3>
                  <p>
                    Enhanced communication between patients and doctors for better healthcare delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-section">
            <div className="stat-item">
              <h3>200+</h3>
              <p>Qualified Doctors</p>
            </div>
            <div className="stat-item">
              <h3>10,000+</h3>
              <p>Happy Patients</p>
            </div>
            <div className="stat-item">
              <h3>500+</h3>
              <p>Daily Appointments</p>
            </div>
            <div className="stat-item">
              <h3>99%</h3>
              <p>Patient Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <div className="contact-content">
          <h2>Get in Touch</h2>
          <p>Our support team is here to assist you 24/7</p>
          <div className="contact-info">
            <div className="contact-item">
              <h4>Email Support</h4>
              <p>support@healthrecordssystem.com</p>
            </div>
            <div className="contact-item">
              <h4>Emergency Helpline</h4>
              <p>+91 1800-111-911</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
