// src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import { Heart, Users, MapPin, ShieldCheck, ArrowRight, Droplet, Star, CalendarDays, Search, PhoneCall, UserCheck, TrendingUp, Hospital } from 'lucide-react'; // Added more icons
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// Helper component for animated number
const AnimatedNumber = ({ value }) => {
    const [displayValue, setDisplayValue] = React.useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseInt(value.replace(/,/g, ''), 10);
        if (start === end) return;

        const duration = 1500; // ms
        const incrementTime = (duration / end);

        const timer = setInterval(() => {
            start += 1;
            setDisplayValue(start);
            if (start === end) clearInterval(timer);
        }, incrementTime);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{displayValue.toLocaleString()}</span>;
};


const HomePage = () => {
    useEffect(() => {
        // Chatbase integration (existing code, slightly modified for clarity)
        const chatbotId = "jsVrdpClgqrR5PDc76-dg";
        const chatbaseLoaderScriptId = "chatbase-loader-script";
        const previousChatbaseConfig = window.chatbaseConfig;

        window.chatbaseConfig = {
            chatbotId: chatbotId,
            theme: {
                button: { position: 'bottom-left' },
                chatWindow: { width: '300px', height: '450px' }
            }
        };

        if (!document.getElementById(chatbaseLoaderScriptId) && !document.getElementById(chatbotId)) {
            const scriptElement = document.createElement('script');
            scriptElement.id = chatbaseLoaderScriptId;
            scriptElement.type = 'text/javascript';
            scriptElement.innerHTML = '(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="' + chatbotId + '";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();';
            document.body.appendChild(scriptElement);
        }

        return () => {
            const loaderScript = document.getElementById(chatbaseLoaderScriptId);
            if (loaderScript) document.body.removeChild(loaderScript);
            const chatScript = document.getElementById(chatbotId);
            if (chatScript) document.body.removeChild(chatScript);
            if (previousChatbaseConfig) window.chatbaseConfig = previousChatbaseConfig;
            else delete window.chatbaseConfig;
            delete window.chatbase;
        };
    }, []);

    const features = [
        { icon: UserCheck, title: 'Hiến máu dễ dàng', desc: 'Đăng ký và đặt lịch hiến máu chỉ với vài thao tác đơn giản.' },
        { icon: Users, title: 'Cộng đồng lớn mạnh', desc: 'Kết nối với hàng ngàn người hiến máu tình nguyện trên cả nước.' },
        { icon: Search, title: 'Tìm kiếm nhanh chóng', desc: 'Dễ dàng tìm kiếm các địa điểm hiến máu hoặc người cần máu gần bạn.' },
        { icon: ShieldCheck, title: 'An toàn & Bảo mật', desc: 'Thông tin cá nhân của bạn được bảo vệ và bảo mật tuyệt đối.' },
    ];

    const stats = [
        { icon: Users, value: '12,500+', label: 'Người hiến máu' },
        { icon: TrendingUp, value: '8,200+', label: 'Lượt hiến thành công' },
        { icon: Hospital, value: '70+', label: 'Bệnh viện & Đối tác' },
    ];

    const testimonials = [
        {
            quote: "BloodConnect đã giúp tôi dễ dàng tìm được những người cần máu gần nhà. Cảm giác được giúp đỡ người khác thật tuyệt vời!",
            name: "Nguyễn Văn An",
            role: "Người hiến máu tình nguyện",
            avatar: "https://i.pravatar.cc/150?u=an"
        },
        {
            quote: "Hệ thống này đã giúp chúng tôi kết nối nhanh chóng với những người hiến máu khi cần thiết. Rất hữu ích cho công việc cứu chữa bệnh nhân.",
            name: "Trần Thị Bình",
            role: "Bác sĩ tại BV Chợ Rẫy",
            avatar: "https://i.pravatar.cc/150?u=binh"
        },
        {
            quote: "Với tư cách là BloodConnect, gia đình tôi đã tìm được máu kịp thời cho ca phẫu thuật khẩn cấp. Cảm ơn rất cả những người hiến máu tình nguyện!",
            name: "Lê Minh Châu",
            role: "Người nhận máu",
            avatar: "https://i.pravatar.cc/150?u=chau"
        }
    ];

    const actionCards = [
        { icon: CalendarDays, title: "Đặt lịch hiến máu", desc: "Chọn thời gian và địa điểm phù hợp để hiến máu.", buttonText: "Đặt lịch ngay", link: "/donate-info" },
        { icon: Heart, title: "Tìm người cần máu", desc: "Xem các yêu cầu máu khẩn cấp trong khu vực.", buttonText: "Xem yêu cầu", link: "/emergency-requests" }, // Assuming this route exists
        { icon: PhoneCall, title: "Liên hệ hỗ trợ", desc: "Cần hỗ trợ? Chúng tôi luôn sẵn sàng giúp đỡ bạn.", buttonText: "Liên hệ ngay", link: "/contact" }
    ];


    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <main className="flex-grow pt-16"> {/* Added flex-grow */}
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-red-50 via-pink-100 to-rose-100 py-24 md:py-32 lg:py-40 overflow-hidden">
                    <div className="absolute inset-0 opacity-30">
                        {/* Decorative shapes or image can go here */}
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <Droplet className="mx-auto text-red-500 h-16 w-16 mb-6 animate-bounce" />
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-800 mb-6 leading-tight">
                            Kết nối yêu thương, <br className="hidden sm:block" />
                            <span className="text-red-600">Chia sẻ sự sống</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                            BloodConnect là nền tảng kết nối người hiến máu tình nguyện với những người đang cần máu,
                            góp phần lan tỏa giá trị nhân ái và mang lại hy vọng cho cộng đồng.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register" // Assuming /register is the correct path for joining
                                className="bg-red-600 text-white px-8 py-3.5 rounded-lg hover:bg-red-700 transition-all duration-300 ease-in-out font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            >
                                Tham gia ngay <ArrowRight className="inline ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                to="/about-donation" // Assuming /about-donation is the correct path
                                className="bg-white text-red-600 px-8 py-3.5 rounded-lg hover:bg-red-50 border-2 border-red-600 transition-all duration-300 ease-in-out font-semibold text-lg shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300"
                            >
                                Tìm hiểu thêm
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 lg:py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
                            Tại sao chọn BloodConnect?
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg mb-12 leading-relaxed">
                            Chúng tôi cung cấp một nền tảng an toàn, minh bạch và tiện lợi để kết nối cộng đồng hiến máu.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((item, index) => (
                                <div 
                                    key={item.title} 
                                    className="bg-slate-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 flex flex-col items-center"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-red-200">
                                        <item.icon className="w-8 h-8 text-red-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-800 mb-2">{item.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="bg-red-600 py-16 lg:py-20 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                        {stats.map((item) => (
                            <div key={item.label} className="p-4 transform transition-transform hover:scale-110 duration-300">
                                <item.icon className="w-12 h-12 mx-auto mb-3 text-red-200" />
                                <div className="text-4xl lg:text-5xl font-bold mb-2"><AnimatedNumber value={item.value} /></div>
                                <div className="text-red-100 text-lg font-medium">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-16 lg:py-24 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-12 text-center">
                            Câu chuyện từ cộng đồng
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg mb-12 text-center leading-relaxed">
                            Những chia sẻ chân thực từ những người đã tham gia vào hành trình lan tỏa yêu thương.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <div 
                                    key={index} 
                                    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    <div className="flex mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-slate-600 italic mb-6 flex-grow">"{testimonial.quote}"</p>
                                    <div className="flex items-center mt-auto">
                                        <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
                                        <div>
                                            <p className="font-semibold text-slate-800">{testimonial.name}</p>
                                            <p className="text-sm text-slate-500">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Action Cards Section */}
                <section className="py-16 lg:py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-5">
                            Bắt đầu ngay hôm nay
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg mb-12 leading-relaxed">
                            Chọn hành động phù hợp với bạn để tham gia vào cộng đồng hiến máu.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {actionCards.map((card, index) => (
                                <div 
                                    key={index} 
                                    className="bg-slate-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 flex flex-col items-center text-center"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-red-200">
                                        <card.icon className="w-8 h-8 text-red-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-800 mb-2">{card.title}</h3>
                                    <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">{card.desc}</p>
                                    <Link
                                        to={card.link}
                                        className="mt-auto bg-white text-red-600 px-6 py-2.5 rounded-lg hover:bg-red-50 border-2 border-red-600 transition-all duration-300 ease-in-out font-semibold shadow-sm hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300"
                                    >
                                        {card.buttonText}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


                {/* Final Call to Action Section */}
                <section className="bg-gradient-to-r from-red-600 to-rose-600 py-16 lg:py-20 text-white text-center">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-5 leading-tight">
                            Sẵn sàng sẻ chia giọt máu, <br className="sm:hidden"/>cứu sống một cuộc đời?
                        </h2>
                        <p className="text-red-100 mb-10 text-lg max-w-2xl mx-auto leading-relaxed">
                            Tham gia cộng đồng BloodConnect ngay hôm nay và trở thành một phần của những điều kỳ diệu, 
                            mang lại hy vọng và sự sống cho những người cần giúp đỡ.
                        </p>
                        <Link
                            to="/register"
                            className="bg-white text-red-600 px-10 py-4 rounded-lg hover:bg-red-50 transition-all duration-300 ease-in-out font-semibold text-lg inline-flex items-center shadow-xl hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50"
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


