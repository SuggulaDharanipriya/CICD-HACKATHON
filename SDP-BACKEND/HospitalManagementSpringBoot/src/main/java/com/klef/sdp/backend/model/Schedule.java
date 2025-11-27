package com.klef.sdp.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "schedule_table")
public class Schedule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Integer id;
    
    @Column(name = "doctor_id", nullable = false)
    private Integer doctorId;
    
    @Column(name = "day_of_week", nullable = false, length = 20)
    private String dayOfWeek; // Monday, Tuesday, etc.
    
    @Column(name = "start_time", nullable = false, length = 20)
    private String startTime; // e.g., "09:00 AM"
    
    @Column(name = "end_time", nullable = false, length = 20)
    private String endTime; // e.g., "05:00 PM"
    
    @Column(name = "is_available", nullable = false)
    @JsonProperty("isAvailable")
    private Boolean isAvailable = true;
    
    @Column(name = "max_appointments", nullable = false)
    private Integer maxAppointments = 10;
    
    // Getters & Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Integer getDoctorId() { return doctorId; }
    public void setDoctorId(Integer doctorId) { this.doctorId = doctorId; }
    
    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }
    
    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }
    
    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }
    
    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
    
    // Additional getter for JSON serialization compatibility
    public Boolean isAvailable() { return isAvailable; }
    
    public Integer getMaxAppointments() { return maxAppointments; }
    public void setMaxAppointments(Integer maxAppointments) { this.maxAppointments = maxAppointments; }
}

