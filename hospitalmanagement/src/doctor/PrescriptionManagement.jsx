import React, { useState, useEffect } from "react";
import axios from "axios";
import "./doctorcss/PrescriptionManagement.css";
const API_URL = import.meta.env.VITE_API_URL;

const PrescriptionManagement = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    appointmentId: "",
    date: new Date().toISOString().split('T')[0],
    medications: "",
    dosage: "",
    instructions: "",
    diagnosis: "",
    notes: ""
  });

  useEffect(() => {
    const storedDoctor = sessionStorage.getItem('doctor');
    if (storedDoctor) {
      const doctor = JSON.parse(storedDoctor);
      setDoctorId(doctor.id);
      setDoctorName(doctor.name);
    }
  }, []);

  useEffect(() => {
    if (doctorId) {
      fetchPrescriptions();
      fetchAppointments();
    }
  }, [doctorId]);

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get(`${API_URL}/prescription/doctor/${doctorId}`);
      setPrescriptions(response.data);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
      setError("Failed to fetch prescriptions");
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API_URL}/appointments/doctor/${doctorId}`);
      // Filter only approved appointments
      const approved = response.data.filter(apt => apt.status === "APPROVED");
      setAppointments(approved);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-fill patient info when appointment is selected
    if (name === "appointmentId" && value) {
      const appointment = appointments.find(apt => apt.id === parseInt(value));
      if (appointment) {
        setFormData(prev => ({
          ...prev,
          patientId: appointment.patientId.toString(),
          patientName: appointment.patientName,
          appointmentId: value
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      // Validate required fields
      if (!formData.patientName || formData.patientName.trim() === "") {
        setError("Patient name is required");
        return;
      }
      
      if (!formData.medications || formData.medications.trim() === "") {
        setError("Medications are required");
        return;
      }

      const prescriptionData = {
        doctorId: doctorId,
        doctorName: doctorName,
        patientId: formData.patientId && formData.patientId !== "" ? parseInt(formData.patientId) : null,
        patientName: formData.patientName.trim(),
        appointmentId: formData.appointmentId && formData.appointmentId !== "" ? parseInt(formData.appointmentId) : null,
        date: formData.date,
        medications: formData.medications.trim(),
        dosage: formData.dosage ? formData.dosage.trim() : null,
        instructions: formData.instructions ? formData.instructions.trim() : null,
        diagnosis: formData.diagnosis ? formData.diagnosis.trim() : null,
        notes: formData.notes ? formData.notes.trim() : null
      };

      console.log("Sending prescription data:", prescriptionData);

      let response;
      if (editingPrescription) {
        // Update existing prescription
        response = await axios.put(`${API_URL}/prescription/update`, {
          ...prescriptionData,
          id: editingPrescription.id
        });
        setMessage("Prescription updated successfully!");
      } else {
        // Add new prescription
        response = await axios.post(`${API_URL}/prescription/add`, prescriptionData);
        setMessage("Prescription added successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        setShowAddModal(false);
        setEditingPrescription(null);
        resetForm();
        fetchPrescriptions();
      }
    } catch (err) {
      console.error("Error saving prescription:", err);
      const errorMsg = err.response?.data || err.response?.data?.message || err.message || "Failed to save prescription";
      setError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    }
  };

  const handleEdit = (prescription) => {
    setEditingPrescription(prescription);
    setFormData({
      patientId: prescription.patientId,
      patientName: prescription.patientName,
      appointmentId: prescription.appointmentId || "",
      date: prescription.date,
      medications: prescription.medications,
      dosage: prescription.dosage || "",
      instructions: prescription.instructions || "",
      diagnosis: prescription.diagnosis || "",
      notes: prescription.notes || ""
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this prescription?")) {
      try {
        await axios.delete(`${API_URL}/prescription/delete/${id}`);
        setMessage("Prescription deleted successfully!");
        fetchPrescriptions();
      } catch (err) {
        setError("Failed to delete prescription");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: "",
      patientName: "",
      appointmentId: "",
      date: new Date().toISOString().split('T')[0],
      medications: "",
      dosage: "",
      instructions: "",
      diagnosis: "",
      notes: ""
    });
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingPrescription(null);
    resetForm();
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="prescription-management-container">
      <div className="prescription-header">
        <h2>Prescription Management</h2>
        <button 
          className="btn-add-prescription"
          onClick={() => setShowAddModal(true)}
        >
          + Add Prescription
        </button>
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

      {prescriptions.length === 0 ? (
        <div className="no-prescriptions">
          <p>No prescriptions found. Add a prescription to get started.</p>
        </div>
      ) : (
        <div className="prescriptions-list">
          {prescriptions.map((prescription) => (
            <div key={prescription.id} className="prescription-card">
              <div className="prescription-card-header">
                <div>
                  <h3>{prescription.patientName}</h3>
                  <p className="prescription-date">{formatDate(prescription.date)}</p>
                </div>
                <div className="prescription-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(prescription)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(prescription.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="prescription-card-body">
                {prescription.diagnosis && (
                  <div className="prescription-field">
                    <span className="field-label">Diagnosis:</span>
                    <span className="field-value">{prescription.diagnosis}</span>
                  </div>
                )}
                
                <div className="prescription-field">
                  <span className="field-label">Medications:</span>
                  <span className="field-value">{prescription.medications}</span>
                </div>
                
                {prescription.dosage && (
                  <div className="prescription-field">
                    <span className="field-label">Dosage:</span>
                    <span className="field-value">{prescription.dosage}</span>
                  </div>
                )}
                
                {prescription.instructions && (
                  <div className="prescription-field">
                    <span className="field-label">Instructions:</span>
                    <span className="field-value">{prescription.instructions}</span>
                  </div>
                )}
                
                {prescription.notes && (
                  <div className="prescription-field">
                    <span className="field-label">Notes:</span>
                    <span className="field-value">{prescription.notes}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content prescription-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingPrescription ? 'Edit Prescription' : 'Add New Prescription'}</h3>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="prescription-form">
              <div className="form-group">
                <label htmlFor="appointmentId">Link to Appointment (Optional)</label>
                <select
                  id="appointmentId"
                  name="appointmentId"
                  value={formData.appointmentId}
                  onChange={handleChange}
                >
                  <option value="">Select Appointment</option>
                  {appointments.map(apt => (
                    <option key={apt.id} value={apt.id}>
                      {apt.patientName} - {formatDate(apt.date)} {apt.confirmedTime || apt.timeRange}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="patientName">Patient Name *</label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                  placeholder="Enter patient name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="diagnosis">Diagnosis</label>
                <textarea
                  id="diagnosis"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter diagnosis"
                />
              </div>

              <div className="form-group">
                <label htmlFor="medications">Medications *</label>
                <textarea
                  id="medications"
                  name="medications"
                  value={formData.medications}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Enter medications (e.g., Paracetamol 500mg, Amoxicillin 250mg)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dosage">Dosage</label>
                <textarea
                  id="dosage"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Enter dosage instructions"
                />
              </div>

              <div className="form-group">
                <label htmlFor="instructions">Instructions</label>
                <textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter instructions for patient"
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes">Additional Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter any additional notes"
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingPrescription ? 'Update' : 'Add'} Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionManagement;
