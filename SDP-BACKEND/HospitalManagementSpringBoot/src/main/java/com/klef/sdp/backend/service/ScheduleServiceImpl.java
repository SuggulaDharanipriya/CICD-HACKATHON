package com.klef.sdp.backend.service;

import com.klef.sdp.backend.model.Schedule;
import com.klef.sdp.backend.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ScheduleServiceImpl implements ScheduleService {
    
    @Autowired
    private ScheduleRepository scheduleRepository;
    
    @Override
    public Schedule addSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }
    
    @Override
    public List<Schedule> getSchedulesByDoctor(Integer doctorId) {
        return scheduleRepository.findByDoctorId(doctorId);
    }
    
    @Override
    public Schedule updateSchedule(Schedule schedule) {
        Optional<Schedule> existing = scheduleRepository.findById(schedule.getId());
        if (existing.isPresent()) {
            return scheduleRepository.save(schedule);
        }
        throw new RuntimeException("Schedule not found");
    }
    
    @Override
    public String deleteSchedule(Integer id) {
        Optional<Schedule> schedule = scheduleRepository.findById(id);
        if (schedule.isPresent()) {
            scheduleRepository.deleteById(id);
            return "Schedule deleted successfully";
        }
        return "Schedule not found";
    }
    
    @Override
    public Schedule getScheduleById(Integer id) {
        return scheduleRepository.findById(id).orElse(null);
    }
}

