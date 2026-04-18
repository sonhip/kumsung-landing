"use client";

import { App, Button, Card, Form, Input, Typography } from "antd";
import { useState } from "react";

const { Paragraph, Title } = Typography;

export default function HeroContentForm({ initialValues }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);

  return (
    <Card>
      <Title level={3} style={{ color: "#16365f", marginTop: 0 }}>
        Nội dung Hero Banner
      </Title>
      <Paragraph style={{ color: "#5f7e9d" }}>
        Chỉnh các nội dung chữ hiển thị ở banner trang chủ.
      </Paragraph>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={async (values) => {
          setIsSaving(true);

          try {
            const response = await fetch("/api/admin/site-content", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                hero: values,
              }),
            });

            const result = await response.json();

            if (!response.ok) {
              message.error(result.error || "Không thể lưu nội dung hero.");
              return;
            }

            form.setFieldsValue(result.hero);
            message.success("Đã cập nhật nội dung hero.");
          } catch {
            message.error("Không thể lưu nội dung hero.");
          } finally {
            setIsSaving(false);
          }
        }}
      >
        <Form.Item label="Kicker" name="kicker">
          <Input />
        </Form.Item>

        <Form.Item
          label="Tiêu đề lớn (cách nhau bằng khoảng trắng)"
          name="headlineWordsText"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề hero." }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item label="Mô tả" name="subtitle">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Nhãn nút Xem sản phẩm" name="viewProductsButton">
          <Input />
        </Form.Item>

        <Form.Item label="Nhãn nút Liên hệ" name="contactButton">
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={isSaving}>
          Lưu nội dung hero
        </Button>
      </Form>
    </Card>
  );
}
