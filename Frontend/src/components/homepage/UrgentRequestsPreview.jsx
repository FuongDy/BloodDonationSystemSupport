import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import apiClient from '../../services/apiClient';
import UrgentRequestCard from '../urgent-requests/UrgentRequestCard';
import LoadingSpinner from '../common/LoadingSpinner';

const UrgentRequestsPreview = ({ onSelectRequest }) => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUrgentRequests = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/urgent-requests');
        // Display only the first 3 requests for the preview
        setRequests(response.data.slice(0, 3));
      } catch (err) {
        setError('Không thể tải danh sách yêu cầu khẩn cấp.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUrgentRequests();
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <div className="relative flex justify-center items-center mb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Trường hợp cần giúp đỡ</h2>
                <Link 
                    to="/urgent-requests"
                    className="absolute right-0 flex items-center text-red-600 font-semibold hover:text-red-700 transition-colors"
                >
                    Xem tất cả <ArrowRight size={20} className="ml-1" />
                </Link>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Những trường hợp đang cần máu khẩn cấp gần đây. Hãy tham gia hiến máu nếu bạn có thể giúp đỡ.
            </p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg flex items-center justify-center">
            <AlertTriangle className="mr-2" /> {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {requests.map(request => (
              <UrgentRequestCard 
                key={request.id} 
                request={request} 
                onViewDetails={() => onSelectRequest(request)} 
              />
            ))}
          </div>
        )}
         <div className="text-center mt-12">
            <Link to="/schedule-donation">
                <button className="bg-white border border-red-600 text-red-600 font-bold py-3 px-8 rounded-lg hover:bg-red-50 transition-colors shadow-sm">
                    Đăng ký hiến máu ngay
                </button>
            </Link>
        </div>
      </div>
    </section>
  );
};

export default UrgentRequestsPreview;
