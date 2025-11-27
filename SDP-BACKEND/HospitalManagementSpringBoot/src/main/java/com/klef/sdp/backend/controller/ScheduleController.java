package com.klef.sdp.backend.controller;

import com.klef.sdp.backend.model.Schedule;
import com.klef.sdp.backend.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schedule")
@CrossOrigin("*")
public class ScheduleController {
    
    @Autowired
    private ScheduleService scheduleService;
    
    @PostMapping("/add")
    public ResponseEntity<?> addSchedule(@RequestBody Schedule schedule) {
        try {
            // Validate required fields
            if (schedule.getDoctorId() == null) {
                return ResponseEntity.status(400).body("Doctor ID is required");
            }
            if (schedule.getDayOfWeek() == null || schedule.getDayOfWeek().trim().isEmpty()) {
                return ResponseEntity.status(400).body("Day of week is required");
            }
            if (schedule.getStartTime() == null || schedule.getStartTime().trim().isEmpty()) {
                return ResponseEntity.status(400).body("Start time is required");
            }
            if (schedule.getEndTime() == null || schedule.getEndTime().trim().isEmpty()) {
                return ResponseEntity.status(400).body("End time is required");
            }
            if (schedule.getMaxAppointments() == null || schedule.getMaxAppointments() < 1) {
                return ResponseEntity.status(400).body("Max appointments must be at least 1");
            }
            
            // Set default values if not provided
            if (schedule.getIsAvailable() == null) {
                schedule.setIsAvailable(true);
            }
            
            Schedule saved = scheduleService.addSchedule(schedule);
            return ResponseEntity.status(201).body(saved);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error adding schedule: " + e.getMessage());
            return ResponseEntity.status(500).body("Failed to add schedule: " + e.getMessage());
        }
    }
    
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getSchedulesByDoctor(@PathVariable Integer doctorId) {
        try {
            List<Schedule> schedules = scheduleService.getSchedulesByDoctor(doctorId);
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error fetching schedules for doctor " + doctorId + ": " + e.getMessage());
            return ResponseEntity.status(500).body("Failed to fetch schedules: " + e.getMessage());
        }
    }
    
    @PutMapping("/update")
    public ResponseEntity<Schedule> updateSchedule(@RequestBody Schedule schedule) {
        try {
            Schedule updated = scheduleService.updateSchedule(schedule);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteSchedule(@PathVariable Integer id) {
        try {
            String result = scheduleService.deleteSchedule(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete schedule");
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Schedule> getScheduleById(@PathVariable Integer id) {
        try {
            Schedule schedule = scheduleService.getScheduleById(id);
            if (schedule != null) {
                return ResponseEntity.ok(schedule);
            }
            return ResponseEntity.status(404).build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}

