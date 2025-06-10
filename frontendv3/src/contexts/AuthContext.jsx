// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const initializeAuth = useCallback(() => {
        setLoading(true);
        const currentUserData = authService.getCurrentUser(); // Lấy từ localStorage
        const token = authService.getAuthToken();

        if (currentUserData && token) {
            setUser(currentUserData); // user từ localStorage đã có role
            setIsAuthenticated(true);
        } else {
            setUser(null);
            setIsAuthenticated(false);
            if (token) { // Nếu có token mà không có user data thì xóa token
                authService.logout();
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        initializeAuth();

        const handleStorageChange = (event) => {
            if (event.key === 'authToken' || event.key === 'user') {
                initializeAuth();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };

    }, [initializeAuth]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const loginResponseData = await authService.login(email, password);
            const userDataFromStorage = authService.getCurrentUser(); // Lấy lại user data đã chuẩn hóa từ localStorage
            setUser(userDataFromStorage);
            setIsAuthenticated(true);
            setLoading(false);
            return userDataFromStorage; // Trả về user data có role
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            throw error;
        }
    };

    const register = async (fullName, email, password, phone, address, dateOfBirth, bloodTypeId) => {
        setLoading(true);
        try {
            const response = await authService.register({ fullName, email, password, phone, address, dateOfBirth, bloodTypeId }); // Truyền object
            setLoading(false);
            return response;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUserContext = (updatedPartialUserData) => {
        // Hàm này được gọi khi user tự cập nhật profile
        // hoặc khi admin cập nhật thông tin user (nếu cần phản ánh ngay)
        const currentUserData = authService.getCurrentUser(); // Lấy user data hiện tại (có role)
        const mergedUser = { ...currentUserData, ...updatedPartialUserData };
        setUser(mergedUser);
        localStorage.setItem('user', JSON.stringify(mergedUser)); // Cập nhật localStorage
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading, initializeAuth, updateUserContext }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;