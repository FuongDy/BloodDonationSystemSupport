import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ... useEffect để kiểm tra người dùng đã đăng nhập chưa ...
    useEffect(() => {
        setLoading(true);
        try {
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng từ localStorage:", error);
            authService.logout();
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        setLoading(true);
        try {
            // FIX: `authData` đã là dữ liệu người dùng, không phải response đầy đủ
            const authData = await authService.login(credentials);

            // Lấy `accessToken` trực tiếp từ `authData`
            const { accessToken } = authData;
            if (accessToken) {
                setUser(authData); // Cập nhật state của context với toàn bộ thông tin người dùng
            }
            return authData; // Trả về dữ liệu để component có thể dùng nếu cần
        } catch (error) {
            throw error; // Ném lỗi đã được xử lý ở service ra cho component
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const register = async (userData) => {
        // Tương tự, hàm register trong service cũng có thể đã trả về data
        // Bạn chỉ cần gọi nó, không cần xử lý kết quả ở đây nếu không cần thiết
        await authService.register(userData);
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};