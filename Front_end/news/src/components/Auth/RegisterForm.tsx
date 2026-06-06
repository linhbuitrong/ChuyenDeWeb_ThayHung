import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const RegisterForm: React.FC = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Tạo tài khoản thành công cho ${username}`);
        navigate("/login");
    };

    return (
        <form onSubmit={handleRegister}>
            <h2>Đăng ký</h2>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Tên đăng nhập" />
            <button type="submit">Đăng ký</button>
        </form>
    );
};
