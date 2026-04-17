"use client";

import { App, Button, Card, Form, Input, Typography } from "antd";
import { useState } from "react";

const { Paragraph, Title } = Typography;

export default function SiteSettingsForm({ initialValues }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);

  return (
    <Card>
      <Title level={3} style={{ color: "#16365f", marginTop: 0 }}>
        Thông tin chung công ty
      </Title>
      <Paragraph style={{ color: "#5f7e9d" }}>
        Chỉnh trực tiếp phần thương hiệu và liên hệ đang hiển thị ở header,
        topbar, footer, trang liên hệ và nút CTA của website.
      </Paragraph>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={async (values) => {
          setIsSaving(true);

          try {
            const response = await fetch("/api/admin/site-settings", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            });

            const result = await response.json();

            if (!response.ok) {
              message.error(result.error || "Không thể lưu cấu hình.");
              return;
            }

            form.setFieldsValue(result);
            message.success("Đã cập nhật thông tin công ty.");
          } catch {
            message.error("Không thể lưu cấu hình.");
          } finally {
            setIsSaving(false);
          }
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 24,
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            marginBottom: 24,
          }}
        >
          <div>
            <Card
              size="small"
              title="Thông tin công ty"
              styles={{ body: { paddingBottom: 0 } }}
            >
              <Form.Item
                label="Tên công ty"
                name={["company", "name"]}
                rules={[
                  { required: true, message: "Vui lòng nhập tên công ty." },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Tên thương hiệu ngắn"
                name={["company", "shortName"]}
                rules={[
                  { required: true, message: "Vui lòng nhập tên thương hiệu." },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Aria label trang chủ"
                name={["company", "homeAriaLabel"]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Tagline" name={["company", "tagline"]}>
                <Input />
              </Form.Item>

              <Form.Item
                label="Nhãn đối tác phân phối"
                name={["company", "distributorLabel"]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Giá trị đối tác phân phối"
                name={["company", "distributorValue"]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>

              <Form.Item
                label="Nhãn nút liên hệ"
                name={["company", "quoteButton"]}
              >
                <Input />
              </Form.Item>
            </Card>
          </div>

          <div>
            <Card
              size="small"
              title="Thông tin liên hệ"
              styles={{ body: { paddingBottom: 0 } }}
            >
              <Form.Item label="Số điện thoại" name={["contact", "phone"]}>
                <Input />
              </Form.Item>

              <Form.Item label="Giờ làm việc" name={["contact", "hours"]}>
                <Input />
              </Form.Item>

              <Form.Item
                label="Địa chỉ đầy đủ"
                name={["contact", "addressFull"]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>

              <Form.Item
                label="Địa chỉ ngắn"
                name={["contact", "addressShort"]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name={["contact", "email"]}
                rules={[
                  { required: true, message: "Vui lòng nhập email." },
                  { type: "email", message: "Email không hợp lệ." },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Aria label email"
                name={["contact", "emailAriaLabel"]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Facebook URL" name={["contact", "facebookUrl"]}>
                <Input />
              </Form.Item>

              <Form.Item
                label="Aria label Facebook"
                name={["contact", "facebookAriaLabel"]}
              >
                <Input />
              </Form.Item>
            </Card>
          </div>
        </div>

        <Button type="primary" htmlType="submit" loading={isSaving}>
          Lưu thông tin công ty
        </Button>
      </Form>
    </Card>
  );
}
