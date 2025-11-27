package com.klef.sdp.backend.repository;

import com.klef.sdp.backend.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
    List<Schedule> findByDoctorId(Integer doctorId);
    List<Schedule> findByDoctorIdAndDayOfWeek(Integer doctorId, String dayOfWeek);
    List<Schedule> findByDoctorIdAndIsAvailable(Integer doctorId, Boolean isAvailable);
}

