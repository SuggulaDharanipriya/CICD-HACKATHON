import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./doctorcss/DoctorDashboard.css";
const API_URL = import.meta.env.VITE_API_URL;

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    todayAppointments: 0,
    totalPrescriptions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedDoctor = sessionStorage.getItem('doctor');
    if (storedDoctor) {
      const doctorData = JSON.parse(storedDoctor);
      setDoctor(doctorData);
    }
  }, []);

  useEffect(() => {
    if (doctor?.id) {
      fetchDashboardData();
    }
  }, [doctor]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch appointments
      const appointmentsRes = await axios.get(`${API_URL}/appointments/doctor/${doctor.id}`);
      const allAppointments = appointmentsRes.data;
      
      // Fetch prescriptions
      const prescriptionsRes = await axios.get(`${API_URL}/prescription/doctor/${doctor.id}`);
      const allPrescriptions = prescriptionsRes.data;
      
      // Get today's date
      const todayDate = new Date().toISOString().split('T')[0];
      
      // Filter today's appointments
      const todayAppts = allAppointments.filter(apt => {
        const aptDate = new Date(apt.date).toISOString().split('T')[0];
        return aptDate === todayDate && apt.status === "APPROVED";
      });
      
      setTodayAppointments(todayAppts);
      
      // Get recent prescriptions (last 5)
      const recent = allPrescriptions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      setRecentPrescriptions(recent);
      
      // Calculate stats
      setStats({
        totalAppointments: allAppointments.length,
        pendingAppointments: allAppointments.filter(a => a.status === "PENDING").length,
        todayAppointments: today.length,
        totalPrescriptions: allPrescriptions.length
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeStr) => {
    return timeStr || "-";
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, Dr. {doctor?.name}!</h1>
          <p>Here's your health records management overview</p>
        </div>
        <div className="doctor-avatar">
          {doctor?.name ? doctor.name.charAt(0).toUpperCase() : 'D'}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.totalAppointments}</h3>
            <p>Total Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingAppointments}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📆</div>
          <div className="stat-content">
            <h3>{stats.todayAppointments}</h3>
            <p>Today's Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💊</div>
          <div className="stat-content">
            <h3>{stats.totalPrescriptions}</h3>
            <p>Total Prescriptions</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Today's Appointments */}
        <div className="dashboard-card today-appointments">
          <div className="card-header">
            <h2>📅 Today's Appointments</h2>
            <Link to="/doctor/appointments" className="view-all-link">View All</Link>
          </div>
          <div className="card-content">
            {todayAppointments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <p>No appointments scheduled for today</p>
              </div>
            ) : (
              <div className="appointments-list">
                {todayAppointments.slice(0, 5).map((appt) => (
                  <div key={appt.id} className="appointment-item">
                    <div className="appointment-info">
                      <h4>{appt.patientName}</h4>
                      <p className="appointment-time">{formatTime(appt.confirmedTime)}</p>
                      <p className="appointment-reason">{appt.reason}</p>
                    </div>
                    <div className="appointment-status">
                      <span className="status-badge status-approved">Approved</span>
                    </div>
                  </div>
                ))}
                {todayAppointments.length > 5 && (
                  <div className="view-more">
                    <small>+{todayAppointments.length - 5} more appointments</small>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recent Prescriptions */}
        <div className="dashboard-card recent-prescriptions">
          <div className="card-header">
            <h2>💊 Recent Prescriptions</h2>
            <Link to="/doctor/prescriptions" className="view-all-link">View All</Link>
          </div>
          <div className="card-content">
            {recentPrescriptions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💊</div>
                <p>No prescriptions yet</p>
                <Link to="/doctor/prescriptions" className="add-link">Add Prescription</Link>
              </div>
            ) : (
              <div className="prescriptions-list">
                {recentPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="prescription-item">
                    <div className="prescription-info">
                      <h4>{prescription.patientName}</h4>
                      <p className="prescription-date">{formatDate(prescription.date)}</p>
                      <p className="prescription-medications">
                        {prescription.medications.length > 50 
                          ? prescription.medications.substring(0, 50) + '...'
                          : prescription.medications}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
