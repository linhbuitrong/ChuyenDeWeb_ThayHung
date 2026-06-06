import React from "react";
import { Modal, Button, Form, Input, DatePicker, message } from "antd";
import { useAuth } from "../../context/AuthContext"; // chỉnh đúng path
import axios from "axios";
import { useTranslation } from "react-i18next";
import {useNavigate} from "react-router-dom";

type AuthModalProps = {
    visible: boolean;
    onClose: () => void;
    type: "login" | "register";
};

const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose, type }) => {
    const [form] = Form.useForm();
    const { login } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        try {
            if (type === "login") {
                const response = await axios.post("http://localhost:8081/api/auth/login", {
                    username: values.username,
                    password: values.password,
                });

                const { username, accountType } = response.data;
                const token = response.data.token;
                localStorage.setItem("token", token);

                login({
                    username: values.username,
                    accountType,
                });
                // const token = response.data.token;
                sessionStorage.setItem("token",token);
                console.log(token)

                message.success(t("login_success"));

                const redirectPath = localStorage.getItem("redirectAfterLogin");

                if (accountType === 0) {
                    navigate("/admin-dashboard"); // Admin thì vẫn về trang admin
                } else {
                    navigate(redirectPath || "/category/trang-chu");
                }

                //  Xoá redirect path để không ảnh hưởng lần sau
                localStorage.removeItem("redirectAfterLogin");
            } else {
                await axios.post("http://localhost:8081/api/auth/register", {
                    username: values.username,
                    password: values.password,
                    email: values.email,
                    phone: values.phone,
                    birthday: values.birthday.format("YYYY-MM-DD"),
                });

                message.success(t("register_success"));
            }

            form.resetFields();
            onClose();
        } catch (error: any) {
            const data = error.response?.data;
            const errorMsg =
                typeof data === "string" ? data : data?.message || JSON.stringify(data) || t("error_generic");
            message.error(errorMsg);
        }
    };


    const handleForgotPassword = () => {
        message.info(t("forgot_password_message"));
    };

    return (
        <Modal
            title={type === "login" ? t("login") : t("register")}
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="username"
                    label={t("username")}
                    rules={[{ required: true, message: t("username_required") }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label={t("password")}
                    rules={[
                        { required: true, message: t("password_required") },
                        { min: 8, message: t("password_min") },
                        {
                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                            message: t("password_pattern"),
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>


                {type === "login" && (
                    <div style={{ textAlign: "right", marginBottom: 16 }}>
                        <Button type="link" onClick={handleForgotPassword} style={{ padding: 0 }}>
                            {t("forgot_password")}
                        </Button>
                    </div>
                )}

                {type === "register" && (
                    <>
                        <Form.Item
                            name="phone"
                            label={t("phone")}
                            rules={[{ required: true, message: t("phone_required") }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="birthday"
                            label={t("birthday")}
                            rules={[{ required: true, message: t("birthday_required") }]}
                        >
                            <DatePicker style={{ width: "100%" }} />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label={t("email")}
                            rules={[
                                { required: true, message: t("email_required") },
                                { type: "email", message: t("email_invalid") },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </>
                )}

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        {type === "login" ? t("login") : t("register")}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AuthModal;
