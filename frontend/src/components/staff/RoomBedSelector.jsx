// src/components/staff/RoomBedSelector.jsx
import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RefreshCw, Bed, AlertCircle, CheckCircle } from 'lucide-react';
import { useRoomManagement } from '../../hooks/useRoomManagement';

const RoomBedSelector = ({ 
    selectedRoom, 
    selectedBed, 
    onRoomChange, 
    onBedChange, 
    disabled = false,
    error = null 
}) => {
    const { 
        roomStatuses, 
        loading, 
        error: roomError,
        refreshRoomStatuses, 
        getRoomByNumber 
    } = useRoomManagement();

    const [availableBeds, setAvailableBeds] = useState([]);
    const previousSelectedBed = useRef(selectedBed);

    // Show error toast when room error occurs
    useEffect(() => {
        if (roomError) {
            toast.error(roomError);
        }
    }, [roomError]);

    // Update available beds when room changes
    useEffect(() => {
        if (selectedRoom) {
            const room = roomStatuses.find(r => r.roomNumber === parseInt(selectedRoom));
            if (room) {
                setAvailableBeds(room.availableBeds || []);
                // Reset bed selection if currently selected bed is not available
                if (selectedBed && !room.availableBeds?.includes(parseInt(selectedBed))) {
                    if (previousSelectedBed.current !== '') {
                        onBedChange('');
                        previousSelectedBed.current = '';
                    }
                }
            }
        } else {
            setAvailableBeds([]);
            if (selectedBed && previousSelectedBed.current !== '') {
                onBedChange('');
                previousSelectedBed.current = '';
            }
        }
    }, [selectedRoom, roomStatuses]); // Remove selectedBed from dependencies

    // Track selectedBed changes
    useEffect(() => {
        previousSelectedBed.current = selectedBed;
    }, [selectedBed]);

    const availableRooms = roomStatuses.filter(room => !room.isFullyOccupied);

    const getRoomDisplay = (room) => {
        return `Room ${room.roomNumber} (${room.availableSpots}/${room.capacity} còn trống)`;
    };

    const getBedStatus = (bedNumber, room) => {
        if (!room) return 'unknown';
        return room.occupiedBeds.includes(bedNumber) ? 'đang được sử dụng' : 'còn trống';
    };

    const selectedRoomData = selectedRoom ? getRoomByNumber(parseInt(selectedRoom)) : null;

    return (
        <div className="space-y-4">
            {/* Room Selection */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                            <Bed className="h-5 w-5 mr-2" />
                           Chọn phòng và giường
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={refreshRoomStatuses}
                            disabled={loading || disabled}
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Làm mới
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Room Selector */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Phòng *
                        </label>
                        <Select
                            value={selectedRoom}
                            onValueChange={onRoomChange}
                            disabled={disabled || loading}
                        >
                            <SelectTrigger className={error?.includes('room') ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Chọn một phòng" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableRooms.length > 0 ? (
                                    availableRooms.map((room) => (
                                        <SelectItem key={room.roomNumber} value={room.roomNumber.toString()}>
                                            {getRoomDisplay(room)}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="no-rooms" disabled>
                                        Không có phòng trống
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Room Details */}
                    {selectedRoomData && (
                        <div className="bg-muted p-3 rounded-lg">
                            <h4 className="font-medium mb-2">Room {selectedRoomData.roomNumber} Chi tiết</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>Sức chứa: {selectedRoomData.capacity}</div>
                                <div>Đang được sử dụng: {selectedRoomData.occupancy}</div>
                                <div>Còn trống: {selectedRoomData.availableSpots}</div>
                                <div>
                                    Loại: {selectedRoomData.capacity === 8 ? 'Khẩn cấp' : 'Tiêu chuẩn'}
                                </div>
                            </div>
                            
                            {/* Bed Visual for selected room */}
                            <div className="mt-3">
                                <div className="text-xs font-medium mb-2">Trạng thái giường:</div>
                                <div className="grid grid-cols-4 gap-2">
                                    {Array.from({ length: selectedRoomData.capacity }, (_, i) => i + 1).map((bedNumber) => {
                                        const status = getBedStatus(bedNumber, selectedRoomData);
                                        return (
                                            <div
                                                key={bedNumber}
                                                className={`relative p-2 rounded text-center text-xs font-medium ${
                                                    status === 'occupied'
                                                        ? 'bg-red-100 text-red-800 border border-red-300'
                                                        : 'bg-green-100 text-green-800 border border-green-300'
                                                } ${
                                                    selectedBed === bedNumber.toString()
                                                        ? 'ring-2 ring-blue-500'
                                                        : ''
                                                }`}
                                                title={`Bed ${bedNumber} - ${status}`}
                                            >
                                                Gường {bedNumber}
                                                {status === 'occupied' && (
                                                    <AlertCircle className="h-3 w-3 absolute -top-1 -right-1" />
                                                )}
                                                {selectedBed === bedNumber.toString() && (
                                                    <CheckCircle className="h-3 w-3 absolute -top-1 -right-1 text-blue-500" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {selectedRoomData.occupiedBeds.length > 0 && (
                                <div className="mt-2 text-xs text-muted-foreground">
                                     Giường đã có người: {selectedRoomData.occupiedBeds.join(', ')}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Bed Selector */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Số giường *
                        </label>
                        <Select
                            value={selectedBed}
                            onValueChange={onBedChange}
                            disabled={disabled || loading || !selectedRoom}
                        >
                            <SelectTrigger className={error?.includes('bed') ? 'border-red-500' : ''}>
                                <SelectValue placeholder={selectedRoom ? "Chọn một giường" : "Chọn một phòng trước"} />
                            </SelectTrigger>
                            <SelectContent>
                                {availableBeds.length > 0 ? (
                                    availableBeds.map((bedNumber) => (
                                        <SelectItem key={bedNumber} value={bedNumber.toString()}>
                                            Giường {bedNumber}
                                        </SelectItem>
                                    ))
                                ) : selectedRoom ? (
                                    <SelectItem value="no-beds" disabled>
                                        Không có giường nào trong phòng này
                                    </SelectItem>
                                ) : (
                                    <SelectItem value="no-room" disabled>
                                        Vui lòng chọn một phòng trước
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Selection Summary */}
                    {selectedRoom && selectedBed && (
                        <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                            <span className="text-green-800 font-medium">
                                Đã chọn: Phòng {selectedRoom}, Giường {selectedBed}
                            </span>
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                            <span className="text-red-800 text-sm">{error}</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default RoomBedSelector;
