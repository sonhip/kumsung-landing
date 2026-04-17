"use client";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Paragraph, Title } = Typography;

export default function AdminLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        message.error(result.error || "Đăng nhập thất bại.");
        return;
      }

      message.success(result.message);
      router.replace("/admin");
      router.refresh();
    } catch {
      message.error("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background:
          "linear-gradient(180deg, rgba(242,248,253,1) 0%, rgba(225,239,250,1) 100%)",
        padding: 24,
      }}
    >
      <Card style={{ width: "100%", maxWidth: 460, borderRadius: 20 }}>
        <Title level={2} style={{ color: "#16365f", marginBottom: 8 }}>
          Đăng nhập quản trị
        </Title>
        <Paragraph style={{ color: "#5f7e9d", marginBottom: 24 }}>
          Tạm thời hệ thống dùng tài khoản hardcode: <strong>admin / admin</strong>
        </Paragraph>

        <Form layout="vertical" onFinish={handleSubmit} initialValues={{ username: "admin", password: "admin" }}>
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập." }]}
          >
            <Input prefix={<UserOutlined />} size="large" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu." }]}
          >
            <Input.Password prefix={<LockOutlined />} size="large" />
          </Form.Item>

          <Button type="primary" htmlType="submit" size="large" loading={loading} block>
            Đăng nhập
          </Button>
        </Form>
      </Card>
    </div>
  );
}
