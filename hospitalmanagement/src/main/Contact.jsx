import { FaEnvelope, FaPhone, FaInstagram, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import "./css/Contact.css";

export default function Contact() {
  return (
    <div className="container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We are here to assist you with any health records queries or appointments.</p>
      </div>

      <div className="contact-content row" style={{ alignItems: 'start' }}>
        <div className="contact-info col" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          <div className="info-card">
            <FaEnvelope className="icon" />
            <h3>Email Us</h3>
            <p>info@healthrecordssystem.com</p>
            <span>We'll respond within 24 hours</span>
          </div>

          <div className="info-card">
            <FaPhone className="icon" />
            <h3>Call Us</h3>
            <p>+91 7032153789</p>
            <span>Mon–Sat, 9 AM to 8 PM</span>
          </div>

          <div className="info-card">
            <FaClock className="icon" />
            <h3>Visiting Hours</h3>
            <p>9 AM - 8 PM</p>
            <span>For consultations and appointments</span>
          </div>

          <div className="info-card">
            <FaMapMarkerAlt className="icon" />
            <h3>Visit Us</h3>
            <p>Health Records System</p>
            <span>Vijayawada, Andhra Pradesh, India</span>
          </div>
        </div>

        <aside className="contact-message col" style={{ maxWidth: 520 }}>
          <h2>Why trust Health Records System?</h2>
          <div className="features">
            <div className="feature">
              <h4>Expert Doctors</h4>
              <p>Consult with highly qualified specialists for your health needs.</p>
            </div>
            <div className="feature">
              <h4>Secure Platform</h4>
              <p>State-of-the-art security ensures your health records are protected.</p>
            </div>
            <div className="feature">
              <h4>24/7 Support</h4>
              <p>Our support team is always ready to assist you anytime.</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="contact-footer" style={{ marginTop: 36 }}>
        <p>Book appointments and reach out to our experts today!</p>
        <div className="social-links">
          <a href="mailto:info@healthrecordssystem.com" className="social-link"><FaEnvelope /> Email</a>
          <a href="tel:+7032153789" className="social-link"><FaPhone /> Call</a>
          <a href="https://instagram.com/kluniversity" className="social-link"><FaInstagram /> Instagram</a>
        </div>
      </div>
    </div>
  );
}
