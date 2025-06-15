import React, { createContext, useState, useEffect } from 'react';

// Tạo Context
export const AuthContext = createContext(null);

// Tạo Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Lưu trữ thông tin người dùng
    const [loading, setLoading] = useState(true); // Trạng thái loading để kiểm tra auth ban đầu

    // Ví dụ: Kiểm tra xem người dùng đã đăng nhập trước đó chưa (ví dụ: từ localStorage)
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse stored user:", error);
                localStorage.removeItem('user');
            }
        }
        setLoading(false); // Kết thúc loading
    }, []);

    // Hàm đăng nhập
    const login = async (email, password) => {
        // Logic gọi API đăng nhập ở đây
        // Ví dụ:
        // const response = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) });
        // const data = await response.json();
        // if (response.ok) {
        //     setUser(data.user);
        //     localStorage.setItem('user', JSON.stringify(data.user));
        //     return data.user;
        // } else {
        //     throw new Error(data.message || 'Login failed');
        // }

        // Giả lập đăng nhập thành công
        const fakeUserData = { id: '1', email, fullName: 'Người dùng Demo', role: 'User' };
        setUser(fakeUserData);
        localStorage.setItem('user', JSON.stringify(fakeUserData));
        console.log('User logged in:', fakeUserData);
        return fakeUserData;
    };

    // Hàm đăng xuất
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        console.log('User logged out');
        // Chuyển hướng về trang login nếu cần
    };

    // Giá trị cung cấp bởi Context
    const value = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading, // Để các component có thể biết khi nào auth đang được kiểm tra
    };

    // Không render children cho đến khi quá trình loading auth ban đầu hoàn tất
    // if (loading) {
    //     return <div>Loading authentication...</div>; // Hoặc một spinner
    // }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
