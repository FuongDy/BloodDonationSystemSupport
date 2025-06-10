import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { jwtDecode } from 'jwt-decode';

// ĐÚNG: Export `AuthContext` như một hằng số (named export)
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // ... phần còn lại của component giữ nguyên
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const initializeAuth = useCallback(() => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    setUser({
                        id: decoded.userId,
                        email: decoded.sub,
                        role: decoded.role,
                        fullName: decoded.fullName,
                    });
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await authService.login(email, password);
            localStorage.setItem('token', response.token);
            initializeAuth();
            setLoading(false);
            return response;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };
    
    const register = async (userData) => {
        setLoading(true);
        try {
            const response = await authService.register(userData);
            setLoading(false);
            return response;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };
    
    const updateUserContext = (newUserData) => {
        setUser(prevUser => ({...prevUser, ...newUserData}));
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading, initializeAuth, updateUserContext }}>
            {children}
        </AuthContext.Provider>
    );
};

