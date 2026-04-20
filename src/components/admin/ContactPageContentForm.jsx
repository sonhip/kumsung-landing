"use client";

import { UploadOutlined } from "@ant-design/icons";
import { App, Button, Card, Form, Input, Typography, Upload } from "antd";
import { useState } from "react";

const { Paragraph, Title } = Typography;

const uploadImage = async (file, folder = "media") => {
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

export default function ContactPageContentForm({ initialValues }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  return (
    <Card>
      <Title level={3} style={{ color: "#16365f", marginTop: 0 }}>
        Nội dung trang Contact
      </Title>
      <Paragraph style={{ color: "#5f7e9d" }}>
        Chỉnh banner và các nội dung chính trên trang /contact.
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
                contactPage: values,
              }),
            });

            const result = await response.json();

            if (!response.ok) {
              message.error(result.error || "Không thể lưu trang contact.");
              return;
            }

            form.setFieldsValue(result.contactPage);
            message.success("Đã cập nhật nội dung trang contact.");
          } catch {
            message.error("Không thể lưu trang contact.");
          } finally {
            setIsSaving(false);
          }
        }}
      >
        <Form.Item label="Tiêu đề banner" name="heroTitle">
          <Input />
        </Form.Item>

        <Form.Item label="Ảnh banner" name="heroImage">
          <Input
            addonAfter={
              <Upload
                showUploadList={false}
                beforeUpload={async (file) => {
                  setUploadingBanner(true);
                  try {
                    const url = await uploadImage(file, "media");
                    form.setFieldValue("heroImage", url);
                    message.success("Upload ảnh banner thành công.");
                  } catch (error) {
                    message.error(error.message || "Upload thất bại.");
                  } finally {
                    setUploadingBanner(false);
                  }

                  return false;
                }}
              >
                <Button icon={<UploadOutlined />} loading={uploadingBanner}>
                  {uploadingBanner ? "Đang upload..." : "Upload"}
                </Button>
              </Upload>
            }
          />
        </Form.Item>

        <Form.Item label="Tiêu đề khối điện thoại" name="phoneTitle">
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả khối điện thoại" name="phoneDescription">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Tiêu đề khối email" name="emailTitle">
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả khối email" name="emailDescription">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Tiêu đề khối địa chỉ" name="locationTitle">
          <Input />
        </Form.Item>

        <Form.Item label="Nhãn nút Google Maps" name="locationMapLabel">
          <Input />
        </Form.Item>

        <Form.Item label="Tiêu đề form" name="formTitle">
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả form" name="formSubtitle">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Nhãn nút gửi" name="submitLabel">
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={isSaving || uploadingBanner}>
          Lưu nội dung Contact
        </Button>
      </Form>
    </Card>
  );
}
