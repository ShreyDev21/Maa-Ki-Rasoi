import { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../api/services.js";

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const { data } = await authAPI.getMe();
            setUser(data.data);
        } catch {
            localStorage.removeItem("accessToken");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        const { data } = await authAPI.login(credentials);
        localStorage.setItem("accessToken", data.data.accessToken);
        setUser(data.data.user);
        return data;
    };

    const register = async (userData) => {
        const { data } = await authAPI.register(userData);
        return data;
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch {
            // ignore
        }
        localStorage.removeItem("accessToken");
        setUser(null);
    };

    const isAdmin = user?.role === "admin";
    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                login,
                register,
                logout,
                isAdmin,
                isAuthenticated,
                fetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
