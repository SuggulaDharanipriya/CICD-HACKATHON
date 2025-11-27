import React, { useEffect, useState } from "react";
import axios from "axios";
import "./admincss/AdminDashboard.css";
const API_URL = `${import.meta.env.VITE_API_URL}/admin`;

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    doctorCount: 0,
    patientCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch only doctor & patient counts
        const [doctorRes, patientRes] = await Promise.all([
          axios.get(`${API_URL}/doctorcount`),
          axios.get(`${API_URL}/patientcount`)
        ]);

        setStats({
          doctorCount: doctorRes.data,
          patientCount: patientRes.data
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Admin Dashboard</h1>
          <p>Health Records System Overview</p>
        </div>
        <div className="admin-avatar">
          <span>A</span>
        </div>
      </div>

      {/* Stats Grid (Only Doctor & Patient) */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-content">
            <h3>{stats.doctorCount}</h3>
            <p>Total Doctors</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.patientCount}</h3>
            <p>Total Patients</p>
          </div>
        </div>
      </div>
    </div>
  );
}
