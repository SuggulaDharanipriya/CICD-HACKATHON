package com.klef.sdp.backend.service;

import com.klef.sdp.backend.model.Schedule;
import java.util.List;

public interface ScheduleService {
    Schedule addSchedule(Schedule schedule);
    List<Schedule> getSchedulesByDoctor(Integer doctorId);
    Schedule updateSchedule(Schedule schedule);
    String deleteSchedule(Integer id);
    Schedule getScheduleById(Integer id);
}

