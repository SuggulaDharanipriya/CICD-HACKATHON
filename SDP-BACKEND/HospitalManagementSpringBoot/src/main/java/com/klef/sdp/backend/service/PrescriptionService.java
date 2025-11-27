package com.klef.sdp.backend.service;

import com.klef.sdp.backend.model.Prescription;
import java.util.List;

public interface PrescriptionService {
    Prescription addPrescription(Prescription prescription);
    List<Prescription> getPrescriptionsByDoctor(Integer doctorId);
    List<Prescription> getPrescriptionsByPatient(Integer patientId);
    Prescription updatePrescription(Prescription prescription);
    String deletePrescription(Integer id);
    Prescription getPrescriptionById(Integer id);
}

