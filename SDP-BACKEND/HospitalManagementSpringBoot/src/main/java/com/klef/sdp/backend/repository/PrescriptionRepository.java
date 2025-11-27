package com.klef.sdp.backend.repository;

import com.klef.sdp.backend.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Integer> {
    List<Prescription> findByDoctorId(Integer doctorId);
    List<Prescription> findByPatientId(Integer patientId);
    List<Prescription> findByAppointmentId(Integer appointmentId);
}

