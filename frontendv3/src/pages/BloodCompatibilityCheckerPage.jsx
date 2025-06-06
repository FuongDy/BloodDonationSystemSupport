// src/pages/BloodCompatibilityCheckerPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { Link } from 'react-router-dom';
import { Search, Droplet, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';
import LoadingSpinner from '../components/common/LoadingSpinner';
import bloodTypeService from '../services/bloodTypeService';
import bloodCompatibilityService from '../services/bloodCompatibilityService';

const BloodCompatibilityCheckerPage = () => {
    const [donorBloodTypeId, setDonorBloodTypeId] = useState('');
    const [recipientBloodTypeId, setRecipientBloodTypeId] = useState('');
    const [bloodTypes, setBloodTypes] = useState([]);
    const [isLoadingBloodTypes, setIsLoadingBloodTypes] = useState(true);
    const [isCheckingCompatibility, setIsCheckingCompatibility] = useState(false);
    const [compatibilityResult, setCompatibilityResult] = useState(null); // null, or { isCompatible, isEmergencyCompatible, compatibilityScore, notes }
    const [errors, setErrors] = useState({});

    const fetchBloodTypes = useCallback(async () => {
        setIsLoadingBloodTypes(true);
        try {
            const data = await bloodTypeService.getAll();
            setBloodTypes(data || []);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách nhóm máu: " + error.message);
        } finally {
            setIsLoadingBloodTypes(false);
        }
    }, []);

    useEffect(() => {
        fetchBloodTypes();
    }, [fetchBloodTypes]);

    const handleCheckCompatibility = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!donorBloodTypeId || !recipientBloodTypeId) {
            setErrors({
                donorBloodTypeId: !donorBloodTypeId ? "Vui lòng chọn loại máu người cho." : null,
                recipientBloodTypeId: !recipientBloodTypeId ? "Vui lòng chọn loại máu người nhận." : null,
            });
            toast.error("Vui lòng chọn đầy đủ cả loại máu người cho và người nhận.");
            return;
        }

        setIsCheckingCompatibility(true);
        setCompatibilityResult(null);
        const toastId = toast.loading("Đang kiểm tra tương thích...");

        try {
            // Lấy tất cả các quy tắc tương thích
            const allRules = await bloodCompatibilityService.getAll(0, 100); // Lấy đủ các rule
            const foundRule = allRules.content.find(rule =>
                rule.donorBloodType.id === parseInt(donorBloodTypeId) &&
                rule.recipientBloodType.id === parseInt(recipientBloodTypeId)
            );

            if (foundRule) {
                setCompatibilityResult(foundRule);
                toast.success("Kiểm tra thành công!", { id: toastId });
            } else {
                setCompatibilityResult({
                    isCompatible: false,
                    isEmergencyCompatible: false,
                    compatibilityScore: 0,
                    notes: "Không tìm thấy quy tắc tương thích cho cặp nhóm máu này."
                });
                toast.success("Không tìm thấy quy tắc tương thích cho cặp nhóm máu này.", { id: toastId });
            }
        } catch (error) {
            toast.error("Lỗi khi kiểm tra tương thích: " + error.message, { id: toastId });
            setCompatibilityResult(null);
        } finally {
            setIsCheckingCompatibility(false);
        }
    };

    const getBloodTypeName = (id) => {
        const type = bloodTypes.find(bt => bt.id === parseInt(id));
        return type ? `${type.bloodGroup} (${type.componentType})` : 'N/A';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
                <div className="max-w-xl w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
                    <div className="text-center">
                        <Droplet className="mx-auto h-12 w-auto text-red-600" />
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Kiểm tra Tương thích nhóm máu
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Chọn loại máu người cho và người nhận để xem khả năng tương thích.
                        </p>
                    </div>

                    <form onSubmit={handleCheckCompatibility} className="space-y-6">
                        <div>
                            <label htmlFor="donorBloodType" className="block text-sm font-medium text-gray-700 mb-1">
                                Loại máu người cho <span className="text-red-500">*</span>
                            </label>
                            {isLoadingBloodTypes ? (
                                <LoadingSpinner size="6" />
                            ) : (
                                <select
                                    id="donorBloodType"
                                    name="donorBloodType"
                                    value={donorBloodTypeId}
                                    onChange={(e) => setDonorBloodTypeId(e.target.value)}
                                    disabled={isCheckingCompatibility || bloodTypes.length === 0}
                                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors.donorBloodTypeId ? 'border-red-500' : 'border-gray-300'}`}
                                    required
                                >
                                    <option value="">-- Chọn loại máu --</option>
                                    {bloodTypes.map(bt => (
                                        <option key={bt.id} value={bt.id}>{`${bt.bloodGroup} (${bt.componentType})`}</option>
                                    ))}
                                </select>
                            )}
                            {errors.donorBloodTypeId && <p className="mt-1 text-xs text-red-600">{errors.donorBloodTypeId}</p>}
                        </div>

                        <div>
                            <label htmlFor="recipientBloodType" className="block text-sm font-medium text-gray-700 mb-1">
                                Loại máu người nhận <span className="text-red-500">*</span>
                            </label>
                            {isLoadingBloodTypes ? (
                                <LoadingSpinner size="6" />
                            ) : (
                                <select
                                    id="recipientBloodType"
                                    name="recipientBloodType"
                                    value={recipientBloodTypeId}
                                    onChange={(e) => setRecipientBloodTypeId(e.target.value)}
                                    disabled={isCheckingCompatibility || bloodTypes.length === 0}
                                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors.recipientBloodTypeId ? 'border-red-500' : 'border-gray-300'}`}
                                    required
                                >
                                    <option value="">-- Chọn loại máu --</option>
                                    {bloodTypes.map(bt => (
                                        <option key={bt.id} value={bt.id}>{`${bt.bloodGroup} (${bt.componentType})`}</option>
                                    ))}
                                </select>
                            )}
                            {errors.recipientBloodTypeId && <p className="mt-1 text-xs text-red-600">{errors.recipientBloodTypeId}</p>}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isCheckingCompatibility || isLoadingBloodTypes}
                            isLoading={isCheckingCompatibility}
                            variant="primary"
                            size="lg"
                        >
                            <Search size={20} className="mr-2" />
                            Kiểm tra Tương thích
                        </Button>
                    </form>

                    {compatibilityResult && (
                        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                Kết quả kiểm tra
                                {compatibilityResult.isCompatible ?
                                    <CheckCircle size={24} className="text-green-500 ml-2" /> :
                                    <XCircle size={24} className="text-red-500 ml-2" />
                                }
                            </h3>
                            <div className="space-y-2 text-gray-700">
                                <p><span className="font-medium">Người cho:</span> {getBloodTypeName(donorBloodTypeId)}</p>
                                <p><span className="font-medium">Người nhận:</span> {getBloodTypeName(recipientBloodTypeId)}</p>
                                <p>
                                    <span className="font-medium">Tương thích:</span>{' '}
                                    {compatibilityResult.isCompatible ?
                                        <span className="text-green-600 font-semibold">Có</span> :
                                        <span className="text-red-600 font-semibold">Không</span>
                                    }
                                </p>
                                <p>
                                    <span className="font-medium">Tương thích khẩn cấp:</span>{' '}
                                    {compatibilityResult.isEmergencyCompatible ?
                                        <span className="text-orange-600 font-semibold">Có</span> :
                                        <span className="text-gray-500">Không</span>
                                    }
                                </p>
                                <p><span className="font-medium">Điểm tương thích:</span> {compatibilityResult.compatibilityScore}%</p>
                                <p><span className="font-medium">Ghi chú:</span> {compatibilityResult.notes || 'Không có ghi chú.'}</p>
                            </div>
                            {!compatibilityResult.isCompatible && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
                                    <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
                                    <p className="text-sm">
                                        Cặp nhóm máu này không tương thích cho việc truyền máu thông thường. Vui lòng tham khảo ý kiến chuyên gia y tế.
                                    </p>
                                </div>
                            )}
                            {compatibilityResult.isCompatible && !compatibilityResult.isEmergencyCompatible && (
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center text-yellow-700">
                                    <Info size={20} className="mr-2 flex-shrink-0" />
                                    <p className="text-sm">
                                        Cặp nhóm máu này tương thích nhưng không được khuyến nghị trong trường hợp khẩn cấp nếu có lựa chọn tốt hơn.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BloodCompatibilityCheckerPage;