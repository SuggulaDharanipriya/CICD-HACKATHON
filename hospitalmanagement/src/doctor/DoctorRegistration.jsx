import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './doctorcss/DoctorRegistration.css';

const API_URL = `${import.meta.env.VITE_API_URL}/doctor`;

export default function DoctorRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dob: '',
    email: '',
    username: '',
    password: '',
    mobileno: '',
    specialization: '',
    qualification: '',
    experience: '',
    location: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert experience to number
      const submitData = {
        ...formData,
        experience: parseInt(formData.experience) || 0
      };
      
      const response = await axios.post(`${API_URL}/registration`, submitData);
      if (response.status === 200) {
        setMessage(response.data);
        setError('');
        // Clear form after success
        setFormData({
          name: '',
          gender: '',
          dob: '',
          email: '',
          username: '',
          password: '',
          mobileno: '',
          specialization: '',
          qualification: '',
          experience: '',
          location: ''
        });
      }
    } catch (err) {
      setMessage('');
      setError(err.response?.data || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>
          <span className="signin-text">Doctor</span>&nbsp;
          <span className="signup-text">Registration</span>
        </h2>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobileno">Mobile Number</label>
            <input
              type="tel"
              id="mobileno"
              value={formData.mobileno}
              onChange={handleChange}
              required
              placeholder="Enter your mobile number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="specialization">Specialization</label>
            <input
              type="text"
              id="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              placeholder="e.g., Cardiology, Neurology"
            />
          </div>

          <div className="form-group">
            <label htmlFor="qualification">Qualification</label>
            <input
              type="text"
              id="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
              placeholder="e.g., MBBS, MD, FMAS"
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience">Experience (Years)</label>
            <input
              type="number"
              id="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              min="0"
              placeholder="Years of experience"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., Hospital/Clinic name or City"
            />
          </div>

          <button type="submit" className="signin-button">
            Register
          </button>
        </form>

        <div className="signup-section">
          <p className="signup-text">Already have an account?</p>
          <Link to="/doctor/login" className="signup-button">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

