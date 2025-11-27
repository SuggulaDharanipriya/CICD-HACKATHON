import React, { useState, useEffect } from "react";
import axios from "axios";
import "./patientcss/PatientDashboard.css";
const API_URL = import.meta.env.VITE_API_URL;


export default function PatientDashboard() {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    approvedAppointments: 0,
    deniedAppointments: 0
  });

  // Get patient data from sessionStorage
  useEffect(() => {
    const storedPatient = sessionStorage.getItem('patient');
    if (storedPatient) {
      const patientData = JSON.parse(storedPatient);
      setPatient(patientData);
    }
  }, []);

  // Fetch appointments
  useEffect(() => {
    if (patient?.id) {
      axios
        .get(`${API_URL}/appointments/patient/${patient.id}`)
        .then((res) => {
          setAppointments(res.data);
          
          // Filter upcoming appointments (approved with future dates)
          const upcoming = res.data.filter(appt => 
            appt.status === "APPROVED" && 
            appt.confirmedTime && 
            new Date(appt.date) >= new Date()
          ).sort((a, b) => {
            if (a.date !== b.date) {
              return new Date(a.date) - new Date(b.date);
            }
            return a.confirmedTime.localeCompare(b.confirmedTime);
          });
          
          setUpcomingAppointments(upcoming);
          
          // Calculate stats
          setStats({
            totalAppointments: res.data.length,
            pendingAppointments: res.data.filter(a => a.status === "PENDING").length,
            approvedAppointments: res.data.filter(a => a.status === "APPROVED").length,
            deniedAppointments: res.data.filter(a => a.status === "DENIED").length
          });
        })
        .catch((err) => console.error("Error fetching appointments:", err));
    }
  }, [patient]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    return timeStr || "-";
  };

  if (!patient) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

	return (
		<div className="patient-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {patient.name}!</h1>
          <p>Here's your health records overview</p>
        </div>
        <div className="patient-avatar">
          {patient.name ? patient.name.charAt(0).toUpperCase() : 'P'}
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
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.approvedAppointments}</h3>
            <p>Approved</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>{stats.deniedAppointments}</h3>
            <p>Denied</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Upcoming Appointments */}
        <div className="dashboard-card upcoming-appointments">
          <div className="card-header">
            <h2>📅 Upcoming Appointments</h2>
            <span className="card-count">{upcomingAppointments.length}</span>
          </div>
          <div className="card-content">
            {upcomingAppointments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <p>No upcoming appointments</p>
                <small>Book an appointment to get started</small>
              </div>
            ) : (
              <div className="appointments-list">
                {upcomingAppointments.slice(0, 3).map((appt) => (
                  <div key={appt.id} className="appointment-item">
                    <div className="appointment-info">
                      <h4>Dr. {appt.doctorName}</h4>
                      <p className="appointment-date">{formatDate(appt.date)}</p>
                      <p className="appointment-time">{formatTime(appt.confirmedTime)}</p>
                    </div>
                    <div className="appointment-status">
                      <span className="status-badge status-approved">Approved</span>
                    </div>
                  </div>
                ))}
                {upcomingAppointments.length > 3 && (
                  <div className="view-more">
                    <small>+{upcomingAppointments.length - 3} more appointments</small>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        
			</div>
		</div>
  );
}


