// TẠO FILE MỚI: src/main/java/com/hicode/backend/controller/AdminInventoryController.java
package com.hicode.backend.controller.admin;

import com.hicode.backend.dto.admin.BloodUnitResponse;
import com.hicode.backend.dto.admin.InventorySummary;
import com.hicode.backend.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/inventory")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
public class AdminInventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<BloodUnitResponse>> viewInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @GetMapping("/summary")
    public ResponseEntity<List<InventorySummary>> getSummary() {
        return ResponseEntity.ok(inventoryService.getInventorySummary());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<BloodUnitResponse>> getRecentAdditions() {
        return ResponseEntity.ok(inventoryService.getRecentAdditions());
    }
}