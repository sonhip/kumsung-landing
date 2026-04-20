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

export default function AboutPageContentForm({ initialValues }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingHeroBanner, setUploadingHeroBanner] = useState(false);
  const [uploadingMilestoneBanner, setUploadingMilestoneBanner] = useState(false);

  return (
    <Card>
      <Title level={3} style={{ color: "#16365f", marginTop: 0 }}>
        Nội dung trang About
      </Title>
      <Paragraph style={{ color: "#5f7e9d" }}>
        Chỉnh banner, tiêu đề và các đoạn văn mô tả trên trang /about.
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
                aboutPage: values,
              }),
            });

            const result = await response.json();

            if (!response.ok) {
              message.error(result.error || "Không thể lưu trang about.");
              return;
            }

            form.setFieldsValue(result.aboutPage);
            message.success("Đã cập nhật nội dung trang about.");
          } catch {
            message.error("Không thể lưu trang about.");
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
                  setUploadingHeroBanner(true);
                  try {
                    const url = await uploadImage(file, "media");
                    form.setFieldValue("heroImage", url);
                    message.success("Upload ảnh banner thành công.");
                  } catch (error) {
                    message.error(error.message || "Upload thất bại.");
                  } finally {
                    setUploadingHeroBanner(false);
                  }

                  return false;
                }}
              >
                <Button icon={<UploadOutlined />} loading={uploadingHeroBanner}>
                  {uploadingHeroBanner ? "Đang upload..." : "Upload"}
                </Button>
              </Upload>
            }
          />
        </Form.Item>

        <Form.Item label="Tiêu đề công ty" name="companyTitle">
          <Input />
        </Form.Item>

        <Form.Item label="Tên công ty" name="companyName">
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả công ty" name="description">
          <Input.TextArea rows={5} />
        </Form.Item>

        <Form.Item label="Tiêu đề năng lực" name="milestonesTitle">
          <Input />
        </Form.Item>

        <Form.Item label="Text highlight năng lực" name="milestonesHighlight">
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả năng lực" name="milestonesSubtitle">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Ảnh banner năng lực" name="milestonesImage">
          <Input
            addonAfter={
              <Upload
                showUploadList={false}
                beforeUpload={async (file) => {
                  setUploadingMilestoneBanner(true);
                  try {
                    const url = await uploadImage(file, "media");
                    form.setFieldValue("milestonesImage", url);
                    message.success("Upload ảnh năng lực thành công.");
                  } catch (error) {
                    message.error(error.message || "Upload thất bại.");
                  } finally {
                    setUploadingMilestoneBanner(false);
                  }

                  return false;
                }}
              >
                <Button icon={<UploadOutlined />} loading={uploadingMilestoneBanner}>
                  {uploadingMilestoneBanner ? "Đang upload..." : "Upload"}
                </Button>
              </Upload>
            }
          />
        </Form.Item>

        <Form.Item label="Tiêu đề section đội ngũ" name="teamTitle">
          <Input />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={isSaving || uploadingHeroBanner || uploadingMilestoneBanner}
        >
          Lưu nội dung About
        </Button>
      </Form>
    </Card>
  );
}
