import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
    username: string;
    name?: string;
    email?: string;
    accountType?: number; //loại tài khoản
}

interface AuthContextType {
    user: User | null;
    login: (userInfo: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Lấy user từ localStorage lúc khởi tạo state
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (userInfo: User) => {
        setUser(userInfo);
        localStorage.setItem("user", JSON.stringify(userInfo)); // lưu vào localStorage
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user"); // xóa khỏi localStorage
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
