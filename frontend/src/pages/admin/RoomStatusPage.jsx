// src/pages/admin/RoomStatusPage.jsx
import React from 'react';
import { RefreshCw, Bed, Users, AlertTriangle } from 'lucide-react';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useRoomManagement } from '../../hooks/useRoomManagement';

const RoomStatusPage = () => {
  const { 
    roomStatuses, 
    loading, 
    refreshRoomStatuses, 
    getTotalStatistics 
  } = useRoomManagement();

  const stats = getTotalStatistics();

  if (loading && roomStatuses.length === 0) {
    return (
      <AdminPageLayout>
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="12" />
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Trạng thái phòng
            </h1>
            <p className="text-gray-600 mt-1">
              Tổng quan tình trạng sử dụng phòng và giường
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={refreshRoomStatuses}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Cập nhật
          </Button>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bed className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tổng phòng</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRooms}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Giường trống</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAvailable}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Đang sử dụng</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOccupied}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bed className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Phòng đầy</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.fullyOccupiedRooms}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Room Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {roomStatuses.map((room) => (
            <Card key={room.roomNumber} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span>Phòng {room.roomNumber}</span>
                  <Badge 
                    variant={room.isFullyOccupied ? 'error' : 'success'}
                    size="sm"
                  >
                    {room.isFullyOccupied ? 'Đầy' : 'Còn trống'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Room Info */}
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Loại phòng:</span>
                    <span className="font-medium">
                      {room.capacity === 8 ? 'Khẩn cấp' : 'Thường'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sức chứa:</span>
                    <span className="font-medium">{room.capacity} giường</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Đang dùng:</span>
                    <span className="font-medium">{room.occupancy} giường</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Còn trống:</span>
                    <span className="font-medium text-green-600">
                      {room.availableSpots} giường
                    </span>
                  </div>
                </div>

                {/* Bed Layout */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs font-medium text-gray-600 mb-2">
                    Sơ đồ giường:
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {Array.from({ length: room.capacity }, (_, i) => i + 1).map((bedNumber) => {
                      const isOccupied = room.occupiedBeds.includes(bedNumber);
                      return (
                        <div
                          key={bedNumber}
                          className={`
                            aspect-square rounded text-center text-xs font-medium
                            flex items-center justify-center
                            ${isOccupied 
                              ? 'bg-red-100 text-red-800 border border-red-300' 
                              : 'bg-green-100 text-green-800 border border-green-300'
                            }
                          `}
                          title={`Giường ${bedNumber} - ${isOccupied ? 'Đang sử dụng' : 'Trống'}`}
                        >
                          {bedNumber}
                        </div>
                      );
                    })}
                  </div>
                  
                  {room.occupiedBeds.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      Giường đang dùng: {room.occupiedBeds.join(', ')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default RoomStatusPage;
