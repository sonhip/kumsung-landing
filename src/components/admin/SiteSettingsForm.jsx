"use client";

import { UploadOutlined } from "@ant-design/icons";
import { App, Button, Card, Form, Input, InputNumber, Typography, Upload } from "antd";
import { useState } from "react";

const { Paragraph, Title } = Typography;

const uploadImage = async (file, folder = "general") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    body: formData,
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Upload thất bại.");
  }

  return result.url;
};

export default function SiteSettingsForm({ initialValues }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

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

              <Form.Item label="URL Zalo" name={["contact", "zaloUrl"]}>
                <Input placeholder="https://zalo.me/..." />
              </Form.Item>

              <Form.Item
                label="URL Messenger"
                name={["contact", "messengerUrl"]}
              >
                <Input placeholder="https://m.me/..." />
              </Form.Item>

              <Form.Item
                label="URL Google Maps"
                name={["contact", "googleMapUrl"]}
              >
                <Input placeholder="https://maps.google.com/?q=..." />
              </Form.Item>
            </Card>
          </div>

          <div>
            <Card
              size="small"
              title="Logo, favicon và footer"
              styles={{ body: { paddingBottom: 0 } }}
            >
              <Form.Item label="Logo công ty (URL)" name={["branding", "logoUrl"]}>
                <Input
                  addonAfter={
                    <Upload
                      showUploadList={false}
                      beforeUpload={async (file) => {
                        setUploadingLogo(true);
                        try {
                          const url = await uploadImage(file, "media");
                          form.setFieldValue(["branding", "logoUrl"], url);
                          message.success("Upload logo thành công.");
                        } catch (error) {
                          message.error(error.message);
                        } finally {
                          setUploadingLogo(false);
                        }

                        return false;
                      }}
                    >
                      <Button icon={<UploadOutlined />} loading={uploadingLogo}>
                        {uploadingLogo ? "Đang upload..." : "Upload"}
                      </Button>
                    </Upload>
                  }
                />
              </Form.Item>

              <Form.Item label="Alt text logo" name={["branding", "logoAltText"]}>
                <Input />
              </Form.Item>

              <Form.Item label="Favicon (URL)" name={["branding", "faviconUrl"]}>
                <Input
                  addonAfter={
                    <Upload
                      showUploadList={false}
                      beforeUpload={async (file) => {
                        setUploadingFavicon(true);
                        try {
                          const url = await uploadImage(file, "general");
                          form.setFieldValue(["branding", "faviconUrl"], url);
                          message.success("Upload favicon thành công.");
                        } catch (error) {
                          message.error(error.message);
                        } finally {
                          setUploadingFavicon(false);
                        }

                        return false;
                      }}
                    >
                      <Button icon={<UploadOutlined />} loading={uploadingFavicon}>
                        {uploadingFavicon ? "Đang upload..." : "Upload"}
                      </Button>
                    </Upload>
                  }
                />
              </Form.Item>

              <Form.Item
                label="Tiêu đề khối liên hệ footer"
                name={["footer", "contactInfoTitle"]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Dòng bản quyền footer" name={["footer", "rightsText"]}>
                <Input />
              </Form.Item>

              <Form.Item
                label="Năm bắt đầu bản quyền"
                name={["footer", "copyrightStartYear"]}
              >
                <InputNumber min={1900} max={3000} style={{ width: "100%" }} />
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
