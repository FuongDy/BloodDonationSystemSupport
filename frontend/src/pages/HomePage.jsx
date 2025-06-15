import React from 'react'
import { Heart, Users, MapPin, Shield, ArrowRight, Droplet, Calendar, Phone, Star } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export default function HomePage() {
    const features = [
        {
            icon: Heart,
            title: "Hiến máu dễ dàng",
            description: "Đăng ký và đặt lịch hiến máu chỉ với vài thao tác đơn giản.",
            color: "text-red-500"
        },
        {
            icon: Users,
            title: "Cộng đồng lớn mạnh",
            description: "Kết nối với hàng ngàn người hiến máu tình nguyện trên cả nước.",
            color: "text-blue-500"
        },
        {
            icon: MapPin,
            title: "Tìm kiếm nhanh chóng",
            description: "Dễ dàng tìm kiếm các địa điểm hiến máu hoặc người cần máu gần bạn.",
            color: "text-green-500"
        },
        {
            icon: Shield,
            title: "An toàn & Bảo mật",
            description: "Thông tin cá nhân của bạn được bảo vệ và bảo mật tuyệt đối.",
            color: "text-purple-500"
        }
    ];

    return (
        <>
            <div className="min-h-screen bg-white">
                <main className="pt-16">
                                      
                    {/* Features Section */}
                    <section className="section-padding bg-gray-50">
                        <div className="text-center mb-16 animate-fade-in-up">
                            <h2 className="heading-2 mb-4">
                                Tại sao chọn BloodConnect?
                            </h2>
                            <p className="text-body-large max-w-2xl mx-auto">
                                Chúng tôi cung cấp một nền tảng an toàn, minh bạch và tiện lợi để kết nối cộng đồng hiến máu.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <Card key={feature.title} hover className="text-center group animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <CardContent className="p-6">
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-50 group-hover:bg-red-50 transition-colors ${feature.color}`}>
                                            <feature.icon className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </>
    )
}
