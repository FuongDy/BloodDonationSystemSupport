// frontendv2/src/pages/BloodCompatibilityCheckerPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Droplets, FlaskConical, CircleHelp, Handshake, HeartPulse, ShieldCheck, XCircle, Info, Beaker } from 'lucide-react';
import toast from 'react-hot-toast';
import bloodTypeService from '../services/bloodTypeService'; // cite: frontendv2/src/services/bloodTypeService.js
import bloodCompatibilityService from '../services/bloodCompatibilityService'; // cite: frontendv2/src/services/bloodCompatibilityService.js
import LoadingSpinner from '../components/common/LoadingSpinner'; // cite: frontendv2/src/components/common/LoadingSpinner.jsx
import InputField from '../components/common/InputField'; // cite: frontendv2/src/components/common/InputField.jsx
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';

const BloodCompatibilityCheckerPage = () => {
    const [bloodTypes, setBloodTypes] = useState([]);
    const [compatibilityRules, setCompatibilityRules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBloodTypeId, setSelectedBloodTypeId] = useState('');
    const [compatibleDonors, setCompatibleDonors] = useState([]);
    const [compatibleRecipients, setCompatibleRecipients] = useState([]);

    const fetchBloodData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [typesData, rulesData] = await Promise.all([
                bloodTypeService.getAll(), // Lấy tất cả loại máu
                bloodCompatibilityService.getAll(0, 1000) // Lấy tất cả quy tắc tương thích
            ]);
            setBloodTypes(typesData || []);
            setCompatibilityRules(rulesData.content || []);
        } catch (error) {
            toast.error("Lỗi khi tải dữ liệu nhóm máu hoặc quy tắc tương thích: " + error.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBloodData();
    }, [fetchBloodData]);

    // Logic để xác định người cho/người nhận tương thích dựa trên nhóm máu đã chọn
    useEffect(() => {
        if (selectedBloodTypeId && bloodTypes.length > 0 && compatibilityRules.length > 0) {
            const selectedType = bloodTypes.find(bt => bt.id === parseInt(selectedBloodTypeId));
            if (!selectedType) {
                setCompatibleDonors([]);
                setCompatibleRecipients([]);
                return;
            }

            // Tìm những nhóm máu có thể hiến cho selectedType
            const donors = new Set();
            compatibilityRules.forEach(rule => {
                if (rule.recipientBloodType?.id === selectedType.id && rule.isCompatible) {
                    donors.add(rule.donorBloodType.id);
                }
            });
            setCompatibleDonors(Array.from(donors).map(id => bloodTypes.find(bt => bt.id === id)));

            // Tìm những nhóm máu mà selectedType có thể hiến cho
            const recipients = new Set();
            compatibilityRules.forEach(rule => {
                if (rule.donorBloodType?.id === selectedType.id && rule.isCompatible) {
                    recipients.add(rule.recipientBloodType.id);
                }
            });
            setCompatibleRecipients(Array.from(recipients).map(id => bloodTypes.find(bt => bt.id === id)));

        } else {
            setCompatibleDonors([]);
            setCompatibleRecipients([]);
        }
    }, [selectedBloodTypeId, bloodTypes, compatibilityRules]);


    const formatBloodTypeDisplay = (bloodType) => {
        if (!bloodType) return 'N/A';
        return `${bloodType.bloodGroup}${bloodType.rhFactor || ''} (${bloodType.componentType})`;
    };

    const simplifiedBloodGroups = [
        { group: "A+", donateTo: ["A+", "AB+"], receiveFrom: ["A+", "A-", "O+", "O-"], description: "Người có nhóm máu A+ có kháng nguyên A và Rh trên bề mặt hồng cầu. Có thể hiến cho A+ và AB+." },
        { group: "A-", donateTo: ["A+", "A-", "AB+", "AB-"], receiveFrom: ["A-", "O-"], description: "Người có nhóm máu A- có kháng nguyên A nhưng không có Rh. Là người cho quan trọng cho A-" },
        { group: "B+", donateTo: ["B+", "AB+"], receiveFrom: ["B+", "B-", "O+", "O-"], description: "Người có nhóm máu B+ có kháng nguyên B và Rh trên bề mặt hồng cầu. Có thể hiến cho B+ và AB+." },
        { group: "B-", donateTo: ["B+", "B-", "AB+", "AB-"], receiveFrom: ["B-", "O-"], description: "Người có nhóm máu B- có kháng nguyên B nhưng không có Rh." },
        { group: "AB+", donateTo: ["AB+"], receiveFrom: ["Tất cả"], description: "Người có nhóm máu AB+ là 'người nhận toàn năng', có thể nhận máu từ bất kỳ nhóm máu nào." },
        { group: "AB-", donateTo: ["AB+", "AB-"], receiveFrom: ["A-", "B-", "AB-", "O-"], description: "Người có nhóm máu AB- có kháng nguyên A và B nhưng không có Rh." },
        { group: "O+", donateTo: ["A+", "B+", "AB+", "O+"], receiveFrom: ["O+", "O-"], description: "Người có nhóm máu O+ là 'người cho phổ biến' cho các nhóm máu Rh+." },
        { group: "O-", donateTo: ["Tất cả"], receiveFrom: ["O-"], description: "Người có nhóm máu O- là 'người cho toàn năng', có thể hiến máu cho bất kỳ nhóm máu nào." },
    ];


    return (
        <>
        <Navbar/>
            <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
                        <Droplets size={32} className="text-red-600 mr-3" /> Kiểm Tra Tương Thích Nhóm Máu
                    </h1>

                    {/* Mục đích của chức năng */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center"><Info size={24} className="mr-2 text-blue-600" /> Mục đích</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Cung cấp thông tin rõ ràng: Giúp người dùng hiểu nhóm máu nào có thể hiến cho hoặc nhận từ nhóm máu nào, đảm bảo an toàn trong quá trình truyền máu.</li>
                            <li>Hỗ trợ quyết định hiến máu: Người dùng (người hiến máu, nhân viên y tế, hoặc bệnh nhân) có thể dựa vào thông tin này để xác định các lựa chọn phù hợp.</li>
                            <li>Nâng cao nhận thức: Giáo dục cộng đồng về tầm quan trọng của việc tương thích nhóm máu trong y khoa.</li>
                        </ul>
                    </section>

                    {/* Công cụ tương tác */}
                    <section className="mb-8 p-6 bg-red-50 rounded-lg shadow-inner">
                        <h2 className="text-2xl font-semibold text-red-700 mb-4 flex items-center">
                            <Beaker size={24} className="mr-2 text-red-600" /> Công cụ kiểm tra nhanh
                        </h2>
                        {isLoading ? (
                            <div className="flex justify-center items-center py-4"><LoadingSpinner size="8" /></div>
                        ) : (
                            <div>
                                <label htmlFor="selectBloodType" className="block text-lg font-medium text-gray-700 mb-2">
                                    Chọn nhóm máu của bạn để xem khả năng tương thích:
                                </label>
                                <select
                                    id="selectBloodType"
                                    value={selectedBloodTypeId}
                                    onChange={(e) => setSelectedBloodTypeId(e.target.value)}
                                    className="block w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-base"
                                >
                                    <option value="">-- Chọn nhóm máu --</option>
                                    {bloodTypes.map(bt => (
                                        <option key={bt.id} value={bt.id}>
                                            {formatBloodTypeDisplay(bt)}
                                        </option>
                                    ))}
                                </select>

                                {selectedBloodTypeId && (
                                    <div className="mt-6 space-y-4">
                                        <div className="bg-white p-4 rounded-md shadow-sm border border-green-200">
                                            <h3 className="text-xl font-semibold text-green-700 flex items-center mb-2">
                                                <Handshake size={20} className="mr-2" /> Có thể Hiến cho:
                                            </h3>
                                            {compatibleRecipients.length > 0 ? (
                                                <p className="text-gray-800 text-lg">
                                                    {compatibleRecipients.map(formatBloodTypeDisplay).join(', ')}
                                                </p>
                                            ) : (
                                                <p className="text-gray-500 italic">Không tìm thấy nhóm máu có thể hiến cho.</p>
                                            )}
                                        </div>
                                        <div className="bg-white p-4 rounded-md shadow-sm border border-blue-200">
                                            <h3 className="text-xl font-semibold text-blue-700 flex items-center mb-2">
                                                <HeartPulse size={20} className="mr-2" /> Có thể Nhận từ:
                                            </h3>
                                            {compatibleDonors.length > 0 ? (
                                                <p className="text-gray-800 text-lg">
                                                    {compatibleDonors.map(formatBloodTypeDisplay).join(', ')}
                                                </p>
                                            ) : (
                                                <p className="text-gray-500 italic">Không tìm thấy nhóm máu có thể nhận từ.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>


                    {/* Nội dung chi tiết - Bảng tương thích máu */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center"><FlaskConical size={24} className="mr-2 text-orange-600" /> Bảng tóm tắt tương thích nhóm máu ABO và Rh</h2>
                        <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-inner">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhóm máu</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hiến cho</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhận từ</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giải thích</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {simplifiedBloodGroups.map((group, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-700">{group.group}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{group.donateTo.join(', ')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{group.receiveFrom.join(', ')}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700 max-w-sm">{group.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/*  */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center"><ShieldCheck size={24} className="mr-2 text-green-600" /> Ứng dụng </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Thông tin này rất quan trọng để tránh các phản ứng miễn dịch nguy hiểm (như phản ứng tan máu) khi truyền máu không tương thích.</li>
                            <li>Giúp các tổ chức hiến máu xác định nguồn máu phù hợp cho bệnh nhân.</li>
                            <li>Khuyến khích mọi người hiểu về nhóm máu của mình và tham gia hiến máu, đặc biệt với nhóm O- (hiến toàn năng).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center"><CircleHelp size={24} className="mr-2 text-purple-600" /> Hạn chế và Gợi ý cải thiện</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center"><XCircle size={20} className="mr-2 text-red-500" /> Hạn chế tiềm tàng</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    <li>--</li>
                                    <li>--</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center"><Info size={20} className="mr-2 text-green-500" />Gợi ý</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    <li>--</li>
                                    <li>--</li>
                                    <li>--</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default BloodCompatibilityCheckerPage;