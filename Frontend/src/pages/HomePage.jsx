// src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import { Heart, Users, MapPin, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const HomePage = () => {
    useEffect(() => {
        const chatbotId = "jsVrdpClgqrR5PDc76-dg";
        const chatbaseLoaderScriptId = "chatbase-loader-script"; // ID for the loader script itself

        // Store previous config if it exists, to restore on cleanup
        const previousChatbaseConfig = window.chatbaseConfig;

        // Configure Chatbase: must be done BEFORE the loader script is added and executed
        window.chatbaseConfig = {
            chatbotId: chatbotId, // Pass the chatbotId here as well
            theme: {
                button: {
                    position: 'bottom-left', // Move button to bottom-left
                },
                chatWindow: {
                    width: '300px',       // Set chat window width
                    height: '450px',      // Set chat window height
                }
            }
        };

        // Only add the loader script if neither it nor the main Chatbase script (loaded by the loader) already exists
        if (!document.getElementById(chatbaseLoaderScriptId) && !document.getElementById(chatbotId)) {
            const scriptElement = document.createElement('script');
            scriptElement.id = chatbaseLoaderScriptId; // ID for this loader script
            scriptElement.type = 'text/javascript';
            // Loader script content. This script will create another script tag with id = chatbotId
            scriptElement.innerHTML = '(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="' + chatbotId + '";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();';
            document.body.appendChild(scriptElement);
        }

        return () => {
            // Cleanup logic
            const loaderScript = document.getElementById(chatbaseLoaderScriptId);
            if (loaderScript) {
                document.body.removeChild(loaderScript);
            }

            const chatScript = document.getElementById(chatbotId); // This is the embed.min.js script
            if (chatScript) {
                document.body.removeChild(chatScript);
            }

            // Restore previous chatbaseConfig or delete if it was set by this component
            if (previousChatbaseConfig) {
                window.chatbaseConfig = previousChatbaseConfig;
            } else {
                delete window.chatbaseConfig;
            }
            // Force a more complete re-initialization by also deleting the main chatbase object
            delete window.chatbase;
        };
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-16">
                {/* Hero */}
                <section className="bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 py-20 lg:py-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                            Kết nối yêu thương, <br />
                            <span className="text-red-600">Chia sẻ sự sống</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                            BloodConnect là nền tảng kết nối người hiến máu tình nguyện với những người đang cần máu.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="bg-red-600 text-white px-8 py-3.5 rounded-lg hover:bg-red-700 transition font-semibold text-lg shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                                Tham gia ngay
                            </Link>
                            <Link
                                to="/about-donation"
                                className="bg-white text-red-600 px-8 py-3.5 rounded-lg hover:bg-red-50 border border-red-600 transition font-semibold text-lg shadow-md hover:shadow-lg"
                            >
                                Tìm hiểu thêm
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-16 lg:py-24 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Tại sao chọn BloodConnect?
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-12">
                            Nền tảng minh bạch, an toàn và tiện lợi để kết nối cộng đồng hiến máu.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: Heart, title: 'Hiến máu dễ dàng', desc: 'Đăng ký và đặt lịch chỉ với vài bước.' },
                                { icon: Users, title: 'Cộng đồng lớn mạnh', desc: 'Kết nối hàng ngàn người trên cả nước.' },
                                { icon: MapPin, title: 'Tìm kiếm nhanh', desc: 'Tìm địa điểm hiến hoặc nhận máu gần bạn.' },
                                { icon: Shield, title: 'An toàn bảo mật', desc: 'Thông tin cá nhân được bảo vệ tuyệt đối.' },
                            ].map((item) => (
                                <div key={item.title} className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <item.icon className="w-8 h-8 text-red-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-gray-600 text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="bg-red-600 py-16 text-white text-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { stat: '10,000+', label: 'Người hiến máu' },
                            { stat: '5,000+', label: 'Lượt hiến thành công' },
                            { stat: '50+', label: 'Bệnh viện & đối tác' },
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="text-4xl font-bold mb-2">{item.stat}</div>
                                <div className="text-red-100 text-lg">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-16 lg:py-24 text-center">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5">
                            Sẵn sàng sẻ chia giọt máu, cứu sống một cuộc đời?
                        </h2>
                        <p className="text-gray-600 mb-10 text-lg">
                            Tham gia BloodConnect ngay hôm nay để tạo nên điều kỳ diệu.
                        </p>
                        <Link
                            to="/register"
                            className="bg-red-600 text-white px-10 py-4 rounded-lg hover:bg-red-700 transition font-semibold text-lg inline-flex items-center shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                            Đăng ký hiến máu
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default HomePage;


