package com.hicode.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class RoomStatusResponse {
    private int roomNumber;
    private int capacity;
    private int occupancy;
    private List<Integer> occupiedBeds;
}