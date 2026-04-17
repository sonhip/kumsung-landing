"use client";

import {
  ArrowLeftOutlined,
  DeleteOutlined,
  PlusOutlined,
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

export default function ProductEditor({
  mode,
  initialProduct = null,
  mediaLibrary = [],
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [contentHtml, setContentHtml] = useState(initialProduct?.contentHtml || "");
  const [images, setImages] = useState(
    initialProduct?.images?.length
      ? initialProduct.images.map((image, index) => ({
          url: image.url,
          altText: image.altText || "",
          sortOrder: image.sortOrder ?? index,
        }))
      : [{ url: "", altText: "", sortOrder: 0 }],
  );

  const [form] = Form.useForm();

  const initialValues = useMemo(
    () => ({
      category: initialProduct?.category || "",
      title: initialProduct?.title || "",
      model: initialProduct?.model || "",
      slug: initialProduct?.slug || "",
      shortDescription: initialProduct?.shortDescription || initialProduct?.description || "",
      tags: initialProduct?.tags?.join(", ") || "",
      isActive: initialProduct?.isActive ?? true,
    }),
    [initialProduct],
  );

  const updateImage = (index, patch) => {
    setImages((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  };

  const addImage = () => {
    setImages((current) => [
      ...current,
      { url: "", altText: "", sortOrder: current.length },
    ]);
  };

  const removeImage = (index) => {
    setImages((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleSubmit = async (values) => {
    setSaving(true);

    try {
      const payload = {
        ...values,
        contentHtml,
        images: images.map((item, index) => ({
          ...item,
          sortOrder: index,
        })),
      };

      const response = await fetch(
        mode === "edit" ? `/api/admin/products/${initialProduct.id}` : "/api/admin/products",
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
        message.error(result.error || "Không thể lưu sản phẩm.");
        return;
      }

      message.success(mode === "edit" ? "Đã cập nhật sản phẩm." : "Đã tạo sản phẩm.");
      router.push("/admin/products");
      router.refresh();
    } catch {
      message.error("Không thể lưu sản phẩm.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Space direction="vertical" size={24} style={{ display: "flex" }}>
      <Card>
        <Space direction="vertical" size={4}>
          <Link href="/admin/products">
            <Button icon={<ArrowLeftOutlined />}>Quay lại danh sách</Button>
          </Link>
          <Title level={3} style={{ margin: 0, color: "#16365f" }}>
            {mode === "edit" ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
          </Title>
          <Paragraph style={{ margin: 0, color: "#5f7e9d" }}>
            Editor hỗ trợ nhập HTML, chèn ảnh bằng URL hoặc chọn từ media library.
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
          <Col xs={24} xl={16}>
            <Card title="Thông tin cơ bản">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Danh mục"
                    name="category"
                    rules={[{ required: true, message: "Vui lòng nhập danh mục." }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Tên sản phẩm"
                    name="title"
                    rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm." }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Model" name="model">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Slug (tùy chọn)" name="slug">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Mô tả ngắn"
                name="shortDescription"
                rules={[{ required: true, message: "Vui lòng nhập mô tả ngắn." }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item label="Nhãn / tags (cách nhau bởi dấu phẩy)" name="tags">
                <Input placeholder="vd: may-nen, kho-lanh, samyoung" />
              </Form.Item>

              <Form.Item name="isActive" valuePropName="checked">
                <Checkbox>Hiển thị sản phẩm ngoài website</Checkbox>
              </Form.Item>
            </Card>

            <HtmlEditor
              value={contentHtml}
              onChange={setContentHtml}
              mediaOptions={mediaLibrary}
            />
          </Col>

          <Col xs={24} xl={8}>
            <Card
              title="Danh sách ảnh"
              extra={
                <Button icon={<PlusOutlined />} onClick={addImage}>
                  Thêm ảnh
                </Button>
              }
            >
              <Space direction="vertical" size={16} style={{ display: "flex" }}>
                {images.map((image, index) => (
                  <Card
                    key={`${image.url}-${index}`}
                    size="small"
                    title={`Ảnh ${index + 1}`}
                    extra={
                      images.length > 1 ? (
                        <Button
                          danger
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() => removeImage(index)}
                        />
                      ) : null
                    }
                  >
                    <Space direction="vertical" size={12} style={{ display: "flex" }}>
                      <Input
                        value={image.url}
                        placeholder="URL hình ảnh"
                        onChange={(event) =>
                          updateImage(index, { url: event.target.value })
                        }
                      />

                      <Input
                        value={image.altText}
                        placeholder="Alt text"
                        onChange={(event) =>
                          updateImage(index, { altText: event.target.value })
                        }
                      />

                      <Upload
                        showUploadList={false}
                        beforeUpload={async (file) => {
                          try {
                            const url = await uploadImage(file);
                            updateImage(index, { url });
                            message.success("Upload thành công.");
                          } catch (error) {
                            message.error(error.message);
                          }

                          return false;
                        }}
                      >
                        <Button icon={<UploadOutlined />} block>
                          Upload ảnh
                        </Button>
                      </Upload>

                      {image.url ? (
                        <>
                          <img
                            src={image.url}
                            alt={image.altText || `Ảnh ${index + 1}`}
                            style={{
                              width: "100%",
                              height: 160,
                              objectFit: "cover",
                              borderRadius: 10,
                            }}
                          />
                          <Button
                            onClick={() =>
                              setContentHtml(
                                (current) =>
                                  `${current}<p><img src="${image.url}" alt="${image.altText || ""}" /></p>`,
                              )
                            }
                          >
                            Chèn vào editor
                          </Button>
                        </>
                      ) : null}
                    </Space>
                  </Card>
                ))}
              </Space>
            </Card>

            <Card>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                htmlType="submit"
                loading={saving}
                block
              >
                {mode === "edit" ? "Lưu thay đổi" : "Tạo sản phẩm"}
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>
    </Space>
  );
}
