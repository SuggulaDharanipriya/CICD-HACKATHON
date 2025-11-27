import React, { useState, useEffect } from "react";
import axios from "axios";
import "./doctorcss/ViewAppointment.css";

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
console.log("ViewAppointment - Using API URL:", API_URL);

const ViewAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [doctorId, setDoctorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [feedback, setFeedback] = useState("");

  // Get doctor ID from sessionStorage
  useEffect(() => {
    const storedDoctor = sessionStorage.getItem('doctor');
    if (storedDoctor) {
      const doctor = JSON.parse(storedDoctor);
      setDoctorId(doctor.id);
    }
  }, []);

  useEffect(() => {
    if (doctorId) {
      setLoading(true);
      setError("");
      console.log("Fetching appointments for doctor ID:", doctorId);
      console.log("API URL:", `${API_URL}/appointments/doctor/${doctorId}`);
      
      axios
        .get(`${API_URL}/appointments/doctor/${doctorId}`, {
          timeout: 10000
        })
        .then((res) => {
          console.log("Appointments fetched successfully:", res.data);
          setAppointments(res.data || []);
          setError(""); // Clear any previous errors
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching appointments:", err);
          console.error("Error details:", {
            message: err.message,
            code: err.code,
            response: err.response,
            request: err.request
          });
          
          if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
            setError(`Cannot connect to backend at ${API_URL}. Please verify the backend is running.`);
          } else if (err.response) {
            setError(`Server error (${err.response.status}): ${err.response.data || err.response.statusText}`);
          } else if (err.request) {
            setError(`Network error: No response from server. Check if backend is running.`);
          } else {
            setError("Failed to fetch appointments: " + err.message);
          }
          setAppointments([]); // Clear appointments on error
          setLoading(false);
        });
    } else {
      console.warn("Doctor ID not found in sessionStorage");
      setError("Doctor ID not found. Please login again.");
      setLoading(false);
    }
  }, [doctorId]);

  const handleStatusAction = (appointmentId, status) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    setCurrentAppointment(appointment);
    setCurrentStatus(status);
    setSelectedTime("");
    setFeedback("");
    
    if (status === "APPROVED" || status === "RESCHEDULED") {
      setShowTimeModal(true);
    } else if (status === "DENIED") {
      setShowFeedbackModal(true);
    }
  };

  const handleTimeSelection = () => {
    if (!selectedTime) {
      setError("Please select a time slot.");
      return;
    }
    setShowTimeModal(false);
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = () => {
    if (!feedback.trim() && currentStatus === "DENIED") {
      setError("Please provide a reason for denial.");
      return;
    }
    setShowFeedbackModal(false);
    updateAppointmentStatus();
  };

  const updateAppointmentStatus = async () => {
    try {
      const confirmedTime = (currentStatus === "APPROVED" || currentStatus === "RESCHEDULED") ? selectedTime : null;
      
      await axios.put(`${API_URL}/appointments/${currentAppointment.id}/status`, null, {
        params: { status: currentStatus, feedback, confirmedTime },
      });
      
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === currentAppointment.id
            ? { ...a, status: currentStatus, doctorFeedback: feedback, confirmedTime }
            : a
        )
      );
      
      setMessage(`Appointment ${currentStatus.toLowerCase()} successfully!`);
      setError("");
    } catch (error) {
      console.error("Error updating appointment:", error);
      setError("Failed to update appointment status");
    }
  };

  // Generate 15-minute time slots for the given time range
  const generateTimeSlots = (timeRange) => {
    const slots = [];
    
    switch (timeRange) {
      case "9AM-12PM":
        for (let hour = 9; hour < 12; hour++) {
          for (let min = 0; min < 60; min += 15) {
            const timeStr = `${hour}:${min.toString().padStart(2, '0')} AM`;
            slots.push(timeStr);
          }
        }
        break;
      case "12PM-3PM":
        for (let hour = 12; hour < 15; hour++) {
          for (let min = 0; min < 60; min += 15) {
            const displayHour = hour === 12 ? 12 : hour - 12;
            const ampm = hour < 12 ? 'AM' : 'PM';
            const timeStr = `${displayHour}:${min.toString().padStart(2, '0')} ${ampm}`;
            slots.push(timeStr);
          }
        }
        break;
      case "3PM-6PM":
        for (let hour = 15; hour < 18; hour++) {
          for (let min = 0; min < 60; min += 15) {
            const displayHour = hour - 12;
            const timeStr = `${displayHour}:${min.toString().padStart(2, '0')} PM`;
            slots.push(timeStr);
          }
        }
        break;
      case "6PM-9PM":
        for (let hour = 18; hour < 21; hour++) {
          for (let min = 0; min < 60; min += 15) {
            const displayHour = hour - 12;
            const timeStr = `${displayHour}:${min.toString().padStart(2, '0')} PM`;
            slots.push(timeStr);
          }
        }
        break;
      default:
        return [];
    }
    
    return slots;
  };

  return (
    <div className="view-appointment-container">
      <h2 className="appointment-heading">My Appointments</h2>
      
      {/* Message Cards */}
      {message && (
        <div className="message-card success-card">
          <div className="message-icon">✅</div>
          <div className="message-content">
            <h4>Success!</h4>
            <p>{message}</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="message-card error-card">
          <div className="message-icon">❌</div>
          <div className="message-content">
            <h4>Error</h4>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="no-appointments">
          <p>Loading appointments...</p>
        </div>
      ) : appointments.length === 0 && !error ? (
        <div className="no-appointments">
          <p>No appointments found.</p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            Appointments will appear here once patients book appointments with you.
          </p>
        </div>
      ) : appointments.length > 0 ? (
        <div className="appointments-table-container">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Contact</th>
                <th>Date</th>
                <th>Time Range</th>
                <th>Confirmed Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Feedback</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.patientName}</td>
                  <td>{appt.patientContact}</td>
                  <td>{appt.date}</td>
                  <td>{appt.timeRange}</td>
                  <td>{appt.confirmedTime || "-"}</td>
                  <td>{appt.reason}</td>
                  <td>
                    <span className={`status-badge status-${appt.status.toLowerCase()}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td>{appt.doctorFeedback || "-"}</td>
                  <td className="action-buttons">
                    {appt.status === "PENDING" && (
                      <>
                        <button 
                          className="btn-approve"
                          onClick={() => handleStatusAction(appt.id, "APPROVED")}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn-reschedule"
                          onClick={() => handleStatusAction(appt.id, "RESCHEDULED")}
                        >
                          Reschedule
                        </button>
                        <button 
                          className="btn-deny"
                          onClick={() => handleStatusAction(appt.id, "DENIED")}
                        >
                          Deny
                        </button>
                      </>
                    )}
                    {appt.status !== "PENDING" && (
                      <span className="no-actions">No actions available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* Time Selection Modal */}
      {showTimeModal && currentAppointment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Select Time Slot</h3>
              <button 
                className="modal-close"
                onClick={() => setShowTimeModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-info">
                Patient: <strong>{currentAppointment.patientName}</strong><br/>
                Date: <strong>{currentAppointment.date}</strong><br/>
                Time Range: <strong>{currentAppointment.timeRange}</strong>
              </p>
              
              <div className="time-slots-container">
                <label>Select a time slot:</label>
                <div className="time-slots-grid">
                  {generateTimeSlots(currentAppointment.timeRange).map((timeSlot) => (
                    <button
                      key={timeSlot}
                      className={`time-slot ${selectedTime === timeSlot ? 'selected' : ''}`}
                      onClick={() => setSelectedTime(timeSlot)}
                    >
                      {timeSlot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={() => setShowTimeModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm"
                onClick={handleTimeSelection}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && currentAppointment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                {currentStatus === "DENIED" ? "Reason for Denial" : "Optional Feedback"}
              </h3>
              <button 
                className="modal-close"
                onClick={() => setShowFeedbackModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-info">
                Patient: <strong>{currentAppointment.patientName}</strong><br/>
                Action: <strong>{currentStatus}</strong>
                {selectedTime && <><br/>Confirmed Time: <strong>{selectedTime}</strong></>}
              </p>
              
              <div className="feedback-container">
                <label htmlFor="feedback">
                  {currentStatus === "DENIED" ? "Reason for denial:" : "Feedback (optional):"}
                </label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={currentStatus === "DENIED" ? "Please provide a reason for denial..." : "Enter any additional notes or feedback..."}
                  rows="4"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={() => setShowFeedbackModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm"
                onClick={handleFeedbackSubmit}
              >
                {currentStatus === "DENIED" ? "Deny Appointment" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAppointment;
