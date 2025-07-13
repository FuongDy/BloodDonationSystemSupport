// src/services/roomService.js
import apiClient from './apiClient';

const roomService = {
    // Get all room statuses with capacity, occupancy, and occupied beds
    getAllRoomStatuses: () => {
        return apiClient.get('/rooms/status');
    },

    // Helper method to check if a bed is available in a room
    isBedAvailable: (roomStatus, bedNumber) => {
        return !roomStatus.occupiedBeds.includes(bedNumber) && bedNumber <= roomStatus.capacity;
    },

    // Get available beds for a specific room
    getAvailableBeds: (roomStatus) => {
        const availableBeds = [];
        for (let i = 1; i <= roomStatus.capacity; i++) {
            if (!roomStatus.occupiedBeds.includes(i)) {
                availableBeds.push(i);
            }
        }
        return availableBeds;
    },

    // Get room summary for display
    getRoomSummary: (roomStatuses) => {
        return roomStatuses.map(room => ({
            ...room,
            availableSpots: room.capacity - room.occupancy,
            isFullyOccupied: room.occupancy >= room.capacity,
            availableBeds: roomService.getAvailableBeds(room)
        }));
    }
};

export default roomService;
