// src/pages/BlogPage.jsx
import React from 'react';
import { Rss } from 'lucide-react';

// Dữ liệu blog giả lập
const blogPosts = [
    {
        id: 1,
        title: 'Hiến máu cứu người: Một nghĩa cử cao đẹp',
        excerpt: 'Hiến máu không chỉ cứu sống người bệnh mà còn mang lại lợi ích sức khỏe cho chính người hiến. Hãy cùng tìm hiểu về những điều kỳ diệu từ việc hiến máu.',
        author: 'Admin',
        date: '10/06/2025',
        category: 'Kiến thức'
    },
    {
        id: 2,
        title: 'Chuẩn bị gì trước khi đi hiến máu?',
        excerpt: 'Để đảm bảo an toàn và sức khỏe, bạn cần chuẩn bị một số điều trước khi tham gia hiến máu. Bài viết này sẽ hướng dẫn bạn chi tiết.',
        author: 'Ban biên tập',
        date: '05/06/2025',
        category: 'Hướng dẫn'
    },
    {
        id: 3,
        title: 'Câu chuyện từ người được cứu sống nhờ máu hiến tặng',
        excerpt: 'Lắng nghe chia sẻ xúc động từ một bệnh nhân đã vượt qua cơn nguy kịch nhờ những giọt máu quý giá từ cộng đồng.',
        author: 'Khách mời',
        date: '01/06/2025',
        category: 'Câu chuyện'
    }
];

const BlogPage = () => {
    return (
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center">
                        <Rss className="mr-4 text-red-600" size={40} />
                        Blog & Tin Tức
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">
                        Cập nhật những kiến thức, câu chuyện và tin tức mới nhất về hiến máu.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="p-6">
                                <span className="text-sm font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">{post.category}</span>
                                <h2 className="mt-4 text-2xl font-bold text-gray-800 hover:text-red-700">
                                    <a href="#">{post.title}</a>
                                </h2>
                                <p className="mt-2 text-gray-600">{post.excerpt}</p>
                                <div className="mt-4 text-sm text-gray-500">
                                    <span>Bởi {post.author}</span>
                                    <span className="mx-2">•</span>
                                    <span>{post.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogPage;