package com.hicode.backend.service;

import com.hicode.backend.model.entity.BloodType;
import com.hicode.backend.model.entity.BloodUnit;
import com.hicode.backend.model.entity.DonationProcess;
import com.hicode.backend.model.enums.InventoryStatus;
import com.hicode.backend.repository.BloodUnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class InventoryService {

    @Autowired
    private BloodUnitRepository bloodUnitRepository;

    @Transactional
    public BloodUnit addUnitToInventory(DonationProcess process, String bloodUnitId) {
        if (bloodUnitRepository.existsById(bloodUnitId)) {
            throw new IllegalArgumentException("Blood unit with ID " + bloodUnitId + " already exists.");
        }

        BloodUnit newUnit = new BloodUnit();
        newUnit.setId(bloodUnitId);
        newUnit.setDonationProcess(process);

        BloodType bloodType = process.getDonor().getBloodType();
        if (bloodType == null) {
            throw new IllegalStateException("Donor's blood type is not set.");
        }
        newUnit.setBloodType(bloodType);

        if (process.getCollectedVolumeMl() == null) {
            throw new IllegalStateException("Collected volume is not recorded for this donation process.");
        }
        newUnit.setVolumeMl(process.getCollectedVolumeMl());
        newUnit.setCollectionDate(LocalDate.now());

        int shelfLife = bloodType.getShelfLifeDays();
        newUnit.setExpiryDate(LocalDate.now().plusDays(shelfLife));

        newUnit.setStatus(InventoryStatus.AVAILABLE);
        newUnit.setStorageLocation("Main Storage");

        return bloodUnitRepository.save(newUnit);
    }

    public List<BloodUnit> getAllInventory() {
        return bloodUnitRepository.findAll();
    }
}