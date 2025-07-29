import { Clock, Heart, MapPin, Users } from 'lucide-react';

const FindDonorsHeroSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-red-600 to-pink-600 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-white bg-opacity-5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:60px_60px]"></div>
        </div>
      </div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          {/* Main Title */}
          <div className="flex justify-center items-center mb-4">
            <Heart className="w-12 h-12 text-white/90 mr-3 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Tìm người hiến máu
            </h1>
          </div>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-6 max-w-3xl mx-auto leading-relaxed">
            Kết nối với những người hiến máu tận tâm trong khu vực của bạn. 
            Mỗi giọt máu là một cơ hội cứu sống.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FindDonorsHeroSection;
