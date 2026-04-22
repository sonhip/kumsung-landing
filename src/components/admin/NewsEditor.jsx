"use client";

import {
  ArrowLeftOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Space,
  Typography,
  Upload,
  message,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import HtmlEditor from "./HtmlEditor";

const { Paragraph, Title } = Typography;

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "editor");

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

const toDateTimeLocalValue = (value) => {
  if (!value) return "";
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

export default function NewsEditor({
  mode,
  initialItem = null,
  mediaLibrary = [],
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [contentHtml, setContentHtml] = useState(initialItem?.contentHtml || "");
  const [coverImage, setCoverImage] = useState(initialItem?.coverImage || "");

  const [form] = Form.useForm();

  const initialValues = useMemo(
    () => ({
      title: initialItem?.title || "",
      slug: initialItem?.slug || "",
      excerpt: initialItem?.excerpt || "",
      publishedAt: toDateTimeLocalValue(initialItem?.publishedAt),
      isPublished: initialItem?.isPublished ?? false,
    }),
    [initialItem],
  );

  const handleSubmit = async (values) => {
    setSaving(true);

    try {
      const payload = {
        ...values,
        coverImage,
        contentHtml,
        publishedAt: values.publishedAt || null,
      };

      const response = await fetch(
        mode === "edit" ? `/api/admin/news/${initialItem.id}` : "/api/admin/news",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        message.error(result.error || "Không thể lưu bài viết.");
        return;
      }

      message.success(mode === "edit" ? "Đã cập nhật bài viết." : "Đã tạo bài viết.");
      router.push("/admin/news");
      router.refresh();
    } catch {
      message.error("Không thể lưu bài viết.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Space direction="vertical" size={24} style={{ display: "flex" }}>
      <Card>
        <Space direction="vertical" size={4}>
          <Link href="/admin/news">
            <Button icon={<ArrowLeftOutlined />}>Quay lại danh sách</Button>
          </Link>
          <Title level={3} style={{ margin: 0, color: "#16365f" }}>
            {mode === "edit" ? "Cập nhật bài viết" : "Thêm bài viết mới"}
          </Title>
          <Paragraph style={{ margin: 0, color: "#5f7e9d" }}>
            Soạn nội dung tin tức và xuất bản trực tiếp lên trang công khai.
          </Paragraph>
        </Space>
      </Card>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSubmit}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} xl={8}>
            <Card title="Thông tin bài viết">
              <Form.Item
                label="Tiêu đề"
                name="title"
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề." }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Slug (tùy chọn)" name="slug">
                <Input placeholder="de-trong-de-tu-tao-theo-tieu-de" />
              </Form.Item>

              <Form.Item label="Mô tả ngắn" name="excerpt">
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item label="Ảnh cover">
                <Input
                  value={coverImage}
                  onChange={(event) => setCoverImage(event.target.value)}
                  placeholder="/uploads/..."
                />
              </Form.Item>

              <Upload
                showUploadList={false}
                beforeUpload={async (file) => {
                  setUploadingCover(true);

                  try {
                    const url = await uploadImage(file);
                    setCoverImage(url);
                    message.success("Upload ảnh cover thành công.");
                  } catch (error) {
                    message.error(error.message);
                  } finally {
                    setUploadingCover(false);
                  }

                  return false;
                }}
              >
                <Button
                  icon={<UploadOutlined />}
                  loading={uploadingCover}
                  block
                  style={{ marginBottom: 12 }}
                >
                  {uploadingCover ? "Đang upload..." : "Upload ảnh cover"}
                </Button>
              </Upload>

              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Cover preview"
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderRadius: 10,
                    marginBottom: 14,
                  }}
                />
              ) : null}

              <Form.Item
                label="Thời gian xuất bản"
                name="publishedAt"
                tooltip="Để trống nếu muốn lấy thời gian hiện tại lúc xuất bản."
              >
                <Input type="datetime-local" />
              </Form.Item>

              <Form.Item name="isPublished" valuePropName="checked">
                <Checkbox>Xuất bản bài viết</Checkbox>
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} xl={16}>
            <HtmlEditor
              value={contentHtml}
              onChange={setContentHtml}
              mediaOptions={mediaLibrary}
            />
            <Card style={{ marginTop: 16 }}>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                htmlType="submit"
                loading={saving}
                block
              >
                {mode === "edit" ? "Lưu thay đổi" : "Tạo bài viết"}
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>
    </Space>
  );
}
