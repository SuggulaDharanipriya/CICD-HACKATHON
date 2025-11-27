package com.klef.sdp.backend.service;

import com.klef.sdp.backend.model.Prescription;
import com.klef.sdp.backend.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionServiceImpl implements PrescriptionService {
    
    @Autowired
    private PrescriptionRepository prescriptionRepository;
    
    @Override
    public Prescription addPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }
    
    @Override
    public List<Prescription> getPrescriptionsByDoctor(Integer doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }
    
    @Override
    public List<Prescription> getPrescriptionsByPatient(Integer patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }
    
    @Override
    public Prescription updatePrescription(Prescription prescription) {
        Optional<Prescription> existing = prescriptionRepository.findById(prescription.getId());
        if (existing.isPresent()) {
            return prescriptionRepository.save(prescription);
        }
        throw new RuntimeException("Prescription not found");
    }
    
    @Override
    public String deletePrescription(Integer id) {
        Optional<Prescription> prescription = prescriptionRepository.findById(id);
        if (prescription.isPresent()) {
            prescriptionRepository.deleteById(id);
            return "Prescription deleted successfully";
        }
        return "Prescription not found";
    }
    
    @Override
    public Prescription getPrescriptionById(Integer id) {
        return prescriptionRepository.findById(id).orElse(null);
    }
}

