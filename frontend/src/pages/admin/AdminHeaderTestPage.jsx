// src/pages/admin/AdminHeaderTestPage.jsx
import React from 'react';
import { 
  Users, 
  Droplet, 
  Calendar, 
  Heart,
  FileText,
  BarChart3,
  TrendingUp,
  Download
} from 'lucide-react';
import DashboardHeader from '../../components/admin/DashboardHeader';
import AdminPageLayout from '../../components/admin/AdminPageLayout';

const AdminHeaderTestPage = () => {
  return (
    <AdminPageLayout>
      {/* Default variant */}
      <DashboardHeader
        title="Dashboard Header Test"
        description="Đây là trang kiểm tra các variant khác nhau của DashboardHeader component để đảm bảo hiển thị đúng."
        stats={[
          {
            icon: <Users className="w-5 h-5 text-blue-300" />,
            value: "1,234",
            label: "Người dùng"
          },
          {
            icon: <Droplet className="w-5 h-5 text-red-300" />,
            value: "89",
            label: "Hiến máu"
          },
          {
            icon: <Calendar className="w-5 h-5 text-green-300" />,
            value: "156",
            label: "Lịch hẹn"
          },
          {
            icon: <Heart className="w-5 h-5 text-pink-300" />,
            value: "2,847",
            label: "Đơn vị máu"
          }
        ]}
      />

      <div className="space-y-8">
        {/* Reports variant */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Reports Variant</h2>
          <DashboardHeader
            title="Báo cáo hệ thống"
            description="Variant này được tối ưu cho trang báo cáo với màu sắc và gradient khác biệt."
            variant="reports"
            stats={[
              {
                icon: <FileText className="w-5 h-5 text-blue-300" />,
                value: "12",
                label: "Báo cáo"
              },
              {
                icon: <BarChart3 className="w-5 h-5 text-green-300" />,
                value: "8",
                label: "Biểu đồ"
              },
              {
                icon: <TrendingUp className="w-5 h-5 text-purple-300" />,
                value: "+15%",
                label: "Tăng trưởng"
              },
              {
                icon: <Download className="w-5 h-5 text-orange-300" />,
                value: "Export",
                label: "Dữ liệu"
              }
            ]}
          />
        </div>

        {/* Compact variant */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Compact Variant</h2>
          <DashboardHeader
            title="Header Gọn"
            description="Variant này nhỏ gọn hơn, phù hợp cho các trang có nội dung nhiều."
            variant="compact"
            showTime={false}
            stats={[
              {
                icon: <Users className="w-4 h-4 text-blue-300" />,
                value: "500",
                label: "Active"
              },
              {
                icon: <Heart className="w-4 h-4 text-red-300" />,
                value: "24/7",
                label: "Support"
              }
            ]}
          />
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default AdminHeaderTestPage;
