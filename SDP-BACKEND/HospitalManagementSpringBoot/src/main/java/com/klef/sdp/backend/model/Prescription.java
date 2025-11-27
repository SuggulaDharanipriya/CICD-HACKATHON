package com.klef.sdp.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "prescription_table")
public class Prescription {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prescription_id")
    private Integer id;
    
    @Column(name = "doctor_id", nullable = false)
    private Integer doctorId;
    
    @Column(name = "doctor_name", nullable = false, length = 100)
    private String doctorName;
    
    @Column(name = "patient_id")
    private Integer patientId;
    
    @Column(name = "patient_name", nullable = false, length = 100)
    private String patientName;
    
    @Column(name = "appointment_id")
    private Integer appointmentId;
    
    @Column(name = "date", nullable = false, length = 20)
    private String date;
    
    @Column(name = "medications", nullable = false, columnDefinition = "TEXT")
    private String medications; // JSON or comma-separated
    
    @Column(name = "dosage", columnDefinition = "TEXT")
    private String dosage;
    
    @Column(name = "instructions", columnDefinition = "TEXT")
    private String instructions;
    
    @Column(name = "diagnosis", columnDefinition = "TEXT")
    private String diagnosis;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    // Getters & Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Integer getDoctorId() { return doctorId; }
    public void setDoctorId(Integer doctorId) { this.doctorId = doctorId; }
    
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    
    public Integer getPatientId() { return patientId; }
    public void setPatientId(Integer patientId) { this.patientId = patientId; }
    
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    
    public Integer getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Integer appointmentId) { this.appointmentId = appointmentId; }
    
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    
    public String getMedications() { return medications; }
    public void setMedications(String medications) { this.medications = medications; }
    
    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    
    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}

