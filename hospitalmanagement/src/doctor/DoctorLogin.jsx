import { useState } from "react";
import "../doctor/doctorcss/DoctorLogin.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contextapi/AuthContext";
const API_URL = `${import.meta.env.VITE_API_URL}/doctor`;

export default function DoctorLogin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setIsDoctorLoggedIn } = useAuth();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/checkdoctorlogin`,
        formData
      );
      if (response.status === 200) {
        setIsDoctorLoggedIn(true);
        sessionStorage.setItem('doctor', JSON.stringify(response.data)); // Store doctor data
        navigate("/doctor/dashboard");
      } else {
        setMessage(response.data);
      }
    } catch (error) {
      setError(error.response?.data || "An unexpected error occurred.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>
          <span className="signin-text">Doctor</span>&nbsp;
          <span className="signup-text">Login</span>
        </h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Email</label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="options">
            <div style={{ display: "flex", alignItems: "center" }}>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-password">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="signin-button">
            Sign In
          </button>
        </form>

        <div className="signup-section">
          <p className="signup-text">New to Health Records System?</p>
          <Link to="/doctor/registration" className="signup-button">
            Register as Doctor
          </Link>
        </div>
      </div>
    </div>
  );
}
