// src/hooks/useRoomManagement.js
import { useState, useEffect, useCallback } from 'react';
import roomService from '../services/roomService';

export const useRoomManagement = () => {
    const [roomStatuses, setRoomStatuses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRoomStatuses = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await roomService.getAllRoomStatuses();
            const roomsWithSummary = roomService.getRoomSummary(response.data);
            setRoomStatuses(roomsWithSummary);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch room statuses';
            setError(errorMessage);
            // Don't use toast here to avoid dependency issues
            console.error('Room management error:', errorMessage);
        } finally {
            setLoading(false);
        }
    }, []); // Remove showToast dependency

    useEffect(() => {
        fetchRoomStatuses();
    }, [fetchRoomStatuses]);

    const refreshRoomStatuses = useCallback(() => {
        fetchRoomStatuses();
    }, [fetchRoomStatuses]);

    const getRoomByNumber = useCallback((roomNumber) => {
        return roomStatuses.find(room => room.roomNumber === roomNumber);
    }, [roomStatuses]);

    const getAvailableRooms = useCallback(() => {
        return roomStatuses.filter(room => !room.isFullyOccupied);
    }, [roomStatuses]);

    const getTotalStatistics = useCallback(() => {
        const totalRooms = roomStatuses.length;
        const totalCapacity = roomStatuses.reduce((sum, room) => sum + room.capacity, 0);
        const totalOccupied = roomStatuses.reduce((sum, room) => sum + room.occupancy, 0);
        const totalAvailable = totalCapacity - totalOccupied;
        const fullyOccupiedRooms = roomStatuses.filter(room => room.isFullyOccupied).length;

        return {
            totalRooms,
            totalCapacity,
            totalOccupied,
            totalAvailable,
            fullyOccupiedRooms,
            occupancyRate: totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0
        };
    }, [roomStatuses]);

    return {
        roomStatuses,
        loading,
        error,
        refreshRoomStatuses,
        getRoomByNumber,
        getAvailableRooms,
        getTotalStatistics
    };
};
