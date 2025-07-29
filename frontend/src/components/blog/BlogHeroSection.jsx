import { BookOpen } from 'lucide-react';

const BlogHeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-red-600 to-pink-600 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative container mx-auto px-4 py-16 lg:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Blog Hiến Máu
          </h1>
          <p className="text-xl lg:text-2xl text-blue-100 mb-8 font-light max-w-3xl mx-auto">
            Chia sẻ kiến thức, kinh nghiệm và câu chuyện đầy cảm hứng về hoạt động hiến máu tình nguyện
          </p>

          {/* Quick Stats */}
          {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-white">50+</div>
              <div className="text-blue-200 text-sm">Bài viết hữu ích</div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-white">1000+</div>
              <div className="text-blue-200 text-sm">Người đọc hàng tháng</div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-white">5</div>
              <div className="text-blue-200 text-sm">Chủ đề chính</div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-white">24/7</div>
              <div className="text-blue-200 text-sm">Cập nhật liên tục</div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default BlogHeroSection;
