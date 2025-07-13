package com.hicode.backend.controller;

import com.hicode.backend.dto.admin.RoomStatusResponse;
import com.hicode.backend.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
public class RoomController {

    @Autowired
    private RoomService roomService;

    /**
     * API MỚI: Lấy trạng thái của tất cả các phòng bệnh.
     * Trả về thông tin sức chứa, số lượng đã chiếm, và danh sách các giường đã có người.
     */
    @GetMapping("/status")
    public ResponseEntity<List<RoomStatusResponse>> getAllRoomStatuses() {
        return ResponseEntity.ok(roomService.getAllRoomStatuses());
    }
}