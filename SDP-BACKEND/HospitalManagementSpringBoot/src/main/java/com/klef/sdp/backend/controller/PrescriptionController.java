package com.klef.sdp.backend.controller;

import com.klef.sdp.backend.model.Prescription;
import com.klef.sdp.backend.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prescription")
@CrossOrigin("*")
public class PrescriptionController {
    
    @Autowired
    private PrescriptionService prescriptionService;
    
    @PostMapping("/add")
    public ResponseEntity<?> addPrescription(@RequestBody Prescription prescription) {
        try {
            Prescription saved = prescriptionService.addPrescription(prescription);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to add prescription: " + e.getMessage());
        }
    }
    
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByDoctor(@PathVariable Integer doctorId) {
        try {
            List<Prescription> prescriptions = prescriptionService.getPrescriptionsByDoctor(doctorId);
            return ResponseEntity.ok(prescriptions);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByPatient(@PathVariable Integer patientId) {
        try {
            List<Prescription> prescriptions = prescriptionService.getPrescriptionsByPatient(patientId);
            return ResponseEntity.ok(prescriptions);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
    @PutMapping("/update")
    public ResponseEntity<Prescription> updatePrescription(@RequestBody Prescription prescription) {
        try {
            Prescription updated = prescriptionService.updatePrescription(prescription);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePrescription(@PathVariable Integer id) {
        try {
            String result = prescriptionService.deletePrescription(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete prescription");
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable Integer id) {
        try {
            Prescription prescription = prescriptionService.getPrescriptionById(id);
            if (prescription != null) {
                return ResponseEntity.ok(prescription);
            }
            return ResponseEntity.status(404).build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}

