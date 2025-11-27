import React, { useState, useEffect } from "react";
import axios from "axios";
import "./doctorcss/ScheduleManagement.css";

// Get API URL from environment variable or use default
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl;
  }
  // Try to use Vite proxy first (for development)
  if (import.meta.env.DEV) {
    return "/api";
  }
  // Default to localhost:1705 if not set
  return "http://localhost:1705";
};

const API_URL = getApiUrl();
console.log("ScheduleManagement - Using API URL:", API_URL);
console.log("Environment mode:", import.meta.env.MODE);
console.log("VITE_API_URL from env:", import.meta.env.VITE_API_URL);

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    isAvailable: true,
    maxAppointments: 10
  });

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", 
    "Friday", "Saturday", "Sunday"
  ];

  const timeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
    "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
  ];

  useEffect(() => {
    const storedDoctor = sessionStorage.getItem('doctor');
    if (storedDoctor) {
      const doctor = JSON.parse(storedDoctor);
      setDoctorId(doctor.id);
    }
  }, []);

  useEffect(() => {
    // Test backend connectivity first
    const testBackendConnection = async () => {
      try {
        console.log("Testing backend connection...");
        // Try to access a simple endpoint to verify backend is running
        const testResponse = await axios.get(`${API_URL}/doctor/all`, { 
          timeout: 5000,
          validateStatus: () => true // Accept any status code
        });
        console.log("Backend is accessible! Status:", testResponse.status);
      } catch (err) {
        console.error("Backend connection test failed:", err);
        if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
          setError(`⚠️ Backend Connection Issue:
          
The backend server at ${API_URL} is not accessible.

Please verify:
1. ✅ Backend is running (check Spring Boot console)
2. ✅ Backend is on port 1705 (check application.properties)
3. ✅ No firewall is blocking port 1705
4. ✅ Try opening http://localhost:1705/doctor/all in your browser

If backend is running, try:
- Restart the frontend dev server (npm run dev)
- Check browser console (F12) for detailed errors
- Verify .env file has: VITE_API_URL=http://localhost:1705`);
        }
      }
    };
    
    testBackendConnection();
    
    if (doctorId) {
      fetchSchedules();
    }
  }, [doctorId]);

  const fetchSchedules = async () => {
    try {
      console.log("Fetching schedules from:", `${API_URL}/schedule/doctor/${doctorId}`);
      const response = await axios.get(`${API_URL}/schedule/doctor/${doctorId}`, {
        timeout: 10000
      });
      setSchedules(response.data || []);
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Error fetching schedules:", err);
      console.error("Error details:", {
        message: err.message,
        code: err.code,
        response: err.response,
        request: err.request
      });
      
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        setError(`Cannot connect to backend at ${API_URL}. Please verify:
          1. Backend is running on port 1705
          2. Backend URL is correct (check .env file or browser console)
          3. No firewall is blocking the connection`);
      } else if (err.response) {
        setError(`Server error (${err.response.status}): ${err.response.data || err.response.statusText}`);
      } else if (err.request) {
        setError(`Network error: No response from server at ${API_URL}. Check if backend is running.`);
      } else {
        setError("Failed to fetch schedules: " + err.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'maxAppointments' ? parseInt(value) || 0 : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Validate form
    if (!formData.dayOfWeek) {
      setError("Please select a day of week");
      return;
    }
    if (!formData.startTime) {
      setError("Please select a start time");
      return;
    }
    if (!formData.endTime) {
      setError("Please select an end time");
      return;
    }
    if (formData.maxAppointments < 1) {
      setError("Max appointments must be at least 1");
      return;
    }

    try {
      // Validate doctorId
      if (!doctorId) {
        setError("Doctor ID not found. Please login again.");
        return;
      }

      const scheduleData = {
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime,
        endTime: formData.endTime,
        isAvailable: Boolean(formData.isAvailable),
        maxAppointments: parseInt(formData.maxAppointments) || 10,
        doctorId: doctorId
      };

      console.log("Sending schedule data:", scheduleData);
      console.log("API URL:", `${API_URL}/schedule/add`);

      let response;
      const axiosConfig = {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      };
      
      if (editingSchedule) {
        // Update existing schedule
        response = await axios.put(`${API_URL}/schedule/update`, {
          ...scheduleData,
          id: editingSchedule.id
        }, axiosConfig);
        setMessage("Schedule updated successfully!");
      } else {
        // Add new schedule
        response = await axios.post(`${API_URL}/schedule/add`, scheduleData, axiosConfig);
        setMessage("Schedule added successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        setShowAddModal(false);
        setEditingSchedule(null);
        setFormData({
          dayOfWeek: "",
          startTime: "",
          endTime: "",
          isAvailable: true,
          maxAppointments: 10
        });
        fetchSchedules();
      }
    } catch (err) {
      console.error("Error saving schedule:", err);
      console.error("Error response:", err.response);
      console.error("Error request:", err.request);
      
      let errorMsg = "Failed to save schedule";
      
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        errorMsg = `Cannot connect to backend at ${API_URL}. Please verify:
          1. Backend is running on port 1705
          2. Backend URL is correct (check .env file: VITE_API_URL=http://localhost:1705)
          3. No firewall is blocking the connection
          4. Try accessing http://localhost:1705 in your browser to verify backend is accessible`;
      } else if (err.response) {
        // Server responded with error status
        errorMsg = err.response.data?.message || err.response.data || `Server error (${err.response.status}): ${err.response.statusText}`;
      } else if (err.request) {
        // Request was made but no response received
        errorMsg = `Network error: No response from server at ${API_URL}/schedule/add. 
          Check if backend is running and accessible.`;
      } else {
        // Error setting up request
        errorMsg = err.message || "An unexpected error occurred";
      }
      
      setError(errorMsg);
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      isAvailable: schedule.isAvailable,
      maxAppointments: schedule.maxAppointments
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await axios.delete(`${API_URL}/schedule/delete/${id}`);
        setMessage("Schedule deleted successfully!");
        fetchSchedules();
      } catch (err) {
        setError("Failed to delete schedule");
      }
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingSchedule(null);
    setFormData({
      dayOfWeek: "",
      startTime: "",
      endTime: "",
      isAvailable: true,
      maxAppointments: 10
    });
  };

  const toggleAvailability = async (schedule) => {
    try {
      await axios.put(`${API_URL}/schedule/update`, {
        ...schedule,
        isAvailable: !schedule.isAvailable
      });
      fetchSchedules();
    } catch (err) {
      setError("Failed to update availability");
    }
  };

  return (
    <div className="schedule-management-container">
      <div className="schedule-header">
        <h2>Manage Schedule</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#666' }}>
            API: {API_URL}
          </span>
          <button 
            className="btn-add-schedule"
            onClick={() => setShowAddModal(true)}
          >
            + Add Schedule
          </button>
        </div>
      </div>

      {message && (
        <div className="message-card success-card">
          <p>{message}</p>
        </div>
      )}

      {error && (
        <div className="message-card error-card">
          <p>{error}</p>
        </div>
      )}

      {schedules.length === 0 ? (
        <div className="no-schedules">
          <p>No schedules found. Add a schedule to get started.</p>
        </div>
      ) : (
        <div className="schedules-grid">
          {schedules.map((schedule) => (
            <div 
              key={schedule.id} 
              className={`schedule-card ${!schedule.isAvailable ? 'unavailable' : ''}`}
            >
              <div className="schedule-card-header">
                <h3>{schedule.dayOfWeek}</h3>
                <span className={`availability-badge ${schedule.isAvailable ? 'available' : 'unavailable'}`}>
                  {schedule.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div className="schedule-card-body">
                <div className="schedule-time">
                  <span className="time-label">Time:</span>
                  <span className="time-value">
                    {schedule.startTime} - {schedule.endTime}
                  </span>
                </div>
                <div className="schedule-appointments">
                  <span className="appointments-label">Max Appointments:</span>
                  <span className="appointments-value">{schedule.maxAppointments}</span>
                </div>
              </div>
              <div className="schedule-card-actions">
                <button 
                  className="btn-toggle"
                  onClick={() => toggleAvailability(schedule)}
                >
                  {schedule.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                </button>
                <button 
                  className="btn-edit"
                  onClick={() => handleEdit(schedule)}
                >
                  Edit
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(schedule.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}</h3>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="schedule-form">
              <div className="form-group">
                <label htmlFor="dayOfWeek">Day of Week *</label>
                <select
                  id="dayOfWeek"
                  name="dayOfWeek"
                  value={formData.dayOfWeek}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Day</option>
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="startTime">Start Time *</label>
                <select
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Start Time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="endTime">End Time *</label>
                <select
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select End Time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="maxAppointments">Max Appointments *</label>
                <input
                  type="number"
                  id="maxAppointments"
                  name="maxAppointments"
                  value={formData.maxAppointments}
                  onChange={handleChange}
                  min="1"
                  max="50"
                  required
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                  />
                  Available
                </label>
	</div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingSchedule ? 'Update' : 'Add'} Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
