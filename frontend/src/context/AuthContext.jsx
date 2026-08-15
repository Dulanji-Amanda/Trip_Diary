import { createContext, useContext, useState, useEffect } from 'react';
import { profileService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Try to load user from local storage
        const storedUser = localStorage.getItem('tripdiary_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email) => {
        try {
            const response = await profileService.getUserByEmail(email);
            if (response.data) {
                setUser(response.data);
                localStorage.setItem('tripdiary_user', JSON.stringify(response.data));
                return { success: true };
            }
            return { success: false, error: 'User not found' };
        } catch (error) {
            console.error('Login error', error);
            return { success: false, error: 'Failed to login' };
        }
    };

    const register = async (userData) => {
        try {
            const response = await profileService.createUser(userData);
            if (response.data) {
                return { success: true };
            }
        } catch (error) {
            console.error('Register error', error);
            return { success: false, error: 'Failed to register' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('tripdiary_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
