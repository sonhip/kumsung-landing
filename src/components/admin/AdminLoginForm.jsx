"use client";

import { LockOutlined, MailOutlined } from "@ant-design/icons";
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
          "radial-gradient(circle at top left, rgba(220, 232, 244, 0.85) 0%, rgba(244, 248, 252, 1) 42%, rgba(234, 241, 248, 1) 100%)",
        padding: 24,
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 460,
          borderRadius: 20,
          border: "1px solid rgba(22, 54, 95, 0.08)",
          boxShadow: "0 24px 60px rgba(22, 54, 95, 0.12)",
          background: "rgba(255, 255, 255, 0.94)",
        }}
      >
        <Title level={2} style={{ color: "#16365f", marginBottom: 8 }}>
          Đăng nhập quản trị
        </Title>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email." },
              { type: "email", message: "Email không hợp lệ." },
            ]}
          >
            <Input prefix={<MailOutlined />} size="large" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu." }]}
          >
            <Input.Password prefix={<LockOutlined />} size="large" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            block
            style={{
              height: 48,
              fontWeight: 600,
              borderRadius: 12,
              background: "linear-gradient(180deg, #2F5F93 0%, #244B73 100%)",
            }}
          >
            Đăng nhập
          </Button>
        </Form>
      </Card>
    </div>
  );
}
