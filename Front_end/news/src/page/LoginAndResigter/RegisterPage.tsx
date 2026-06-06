import React, { useState } from "react";
import "../../css/RegisterPage.css";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        phone: "",
        dob: "",
        email: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.username.trim()) newErrors.username = "Tên đăng nhập là bắt buộc";
        if (!formData.password) newErrors.password = "Mật khẩu là bắt buộc";
        else if (formData.password.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";

        if (!formData.phone) newErrors.phone = "Số điện thoại là bắt buộc";
        else if (!/^\d{10,11}$/.test(formData.phone)) newErrors.phone = "Số điện thoại không hợp lệ";

        if (!formData.dob) newErrors.dob = "Ngày sinh là bắt buộc";

        if (!formData.email) newErrors.email = "Email là bắt buộc";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            alert("Đăng ký thành công!");
        }
    };

    return (
        <div className="register-container">
            <h2>Đăng ký</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                        Tên đăng nhập
                    </label>
                    <input
                        type="text"
                        className={`form-control ${errors.username ? "is-invalid" : ""}`}
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.username}</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Mật khẩu
                    </label>
                    <input
                        type="password"
                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.password}</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                        Số điện thoại
                    </label>
                    <input
                        type="text"
                        className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.phone}</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="dob" className="form-label">
                        Ngày sinh
                    </label>
                    <input
                        type="date"
                        className={`form-control ${errors.dob ? "is-invalid" : ""}`}
                        id="dob"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.dob}</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.email}</div>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    Đăng ký
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
