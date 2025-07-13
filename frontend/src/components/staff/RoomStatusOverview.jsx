// src/components/staff/RoomStatusOverview.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RefreshCw, Bed, Users, AlertTriangle } from 'lucide-react';
import { useRoomManagement } from '../../hooks/useRoomManagement';

const RoomStatusOverview = ({ onRoomSelect, selectedRoom }) => {
    const { 
        roomStatuses, 
        loading, 
        refreshRoomStatuses, 
        getTotalStatistics 
    } = useRoomManagement();

    const stats = getTotalStatistics();

    const getRoomStatusColor = (room) => {
        if (room.isFullyOccupied) return 'destructive';
        if (room.occupancy === 0) return 'secondary';
        return 'default';
    };

    const getRoomStatusIcon = (room) => {
        if (room.isFullyOccupied) return <AlertTriangle className="h-4 w-4" />;
        return <Bed className="h-4 w-4" />;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <RefreshCw className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading room statuses...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Overall Statistics */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                            <Users className="h-5 w-5 mr-2" />
                            Room Overview
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={refreshRoomStatuses}
                            disabled={loading}
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{stats.totalRooms}</div>
                            <div className="text-sm text-muted-foreground">Total Rooms</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{stats.totalAvailable}</div>
                            <div className="text-sm text-muted-foreground">Available Beds</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{stats.totalOccupied}</div>
                            <div className="text-sm text-muted-foreground">Occupied Beds</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{stats.occupancyRate}%</div>
                            <div className="text-sm text-muted-foreground">Occupancy Rate</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Room Grid */}
            <Card>
                <CardHeader>
                    <CardTitle>Room Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {roomStatuses.map((room) => (
                            <Card
                                key={room.roomNumber}
                                className={`cursor-pointer transition-all hover:shadow-md ${
                                    selectedRoom?.roomNumber === room.roomNumber
                                        ? 'ring-2 ring-blue-500'
                                        : ''
                                }`}
                                onClick={() => onRoomSelect && onRoomSelect(room)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold">Room {room.roomNumber}</h3>
                                        <Badge variant={getRoomStatusColor(room)}>
                                            {getRoomStatusIcon(room)}
                                        </Badge>
                                    </div>
                                    
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Capacity:</span>
                                            <span className="font-medium">{room.capacity}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Occupied:</span>
                                            <span className="font-medium">{room.occupancy}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Available:</span>
                                            <span className="font-medium text-green-600">
                                                {room.availableSpots}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bed Visual */}
                                    <div className="mt-3">
                                        <div className="text-xs text-muted-foreground mb-1">Beds:</div>
                                        <div className="grid grid-cols-4 gap-1">
                                            {Array.from({ length: room.capacity }, (_, i) => i + 1).map((bedNumber) => (
                                                <div
                                                    key={bedNumber}
                                                    className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                                                        room.occupiedBeds.includes(bedNumber)
                                                            ? 'bg-red-500 text-white'
                                                            : 'bg-green-500 text-white'
                                                    }`}
                                                    title={`Bed ${bedNumber} - ${
                                                        room.occupiedBeds.includes(bedNumber) ? 'Occupied' : 'Available'
                                                    }`}
                                                >
                                                    {bedNumber}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {room.occupiedBeds.length > 0 && (
                                        <div className="mt-2 text-xs text-muted-foreground">
                                            Occupied beds: {room.occupiedBeds.join(', ')}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RoomStatusOverview;
