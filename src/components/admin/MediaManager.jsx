"use client";

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Upload,
  message,
} from "antd";
import { useMemo, useState } from "react";

const sectionOptions = [
  { label: "Brand Logo", value: "brand_logo" },
  { label: "Hero Slide", value: "hero_slide" },
  { label: "Stats Highlight", value: "stats_highlight" },
  { label: "Service Tile", value: "service_tile" },
  { label: "Previous Work", value: "previous_work" },
  { label: "Partner Logo", value: "partner_logo" },
];

const initialValues = {
  section: "hero_slide",
  title: "",
  subtitle: "",
  description: "",
  imageUrl: "",
  altText: "",
  tone: "",
  variant: "image",
  sortOrder: 0,
  isActive: true,
};

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "media");

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

export default function MediaManager({ initialItems = [] }) {
  const [form] = Form.useForm();
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [sectionFilter, setSectionFilter] = useState("all");

  const loadItems = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/media");
      const result = await response.json();

      if (!response.ok) {
        message.error(result.error || "Không thể tải media.");
        return;
      }

      setItems(result);
    } catch {
      message.error("Không thể tải media.");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    if (sectionFilter === "all") {
      return items;
    }

    return items.filter((item) => item.section === sectionFilter);
  }, [items, sectionFilter]);

  const openCreate = () => {
    setEditingItem(null);
    form.setFieldsValue(initialValues);
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    form.setFieldsValue({
      ...item,
      isActive: Boolean(item.isActive),
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    const response = await fetch(`/api/admin/media/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      message.error(result.error || "Không thể xóa media.");
      return;
    }

    message.success("Đã xóa media.");
    loadItems();
  };

  const handleFinish = async (values) => {
    setSaving(true);

    const response = await fetch(
      editingItem ? `/api/admin/media/${editingItem.id}` : "/api/admin/media",
      {
        method: editingItem ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      },
    );

    const result = await response.json();

    setSaving(false);

    if (!response.ok) {
      message.error(result.error || "Không thể lưu media.");
      return;
    }

    message.success(editingItem ? "Đã cập nhật media." : "Đã tạo media.");
    setOpen(false);
    loadItems();
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 110,
      render: (value, item) => (
        <Image
          src={value}
          alt={item.altText || item.title || "media"}
          width={72}
          height={56}
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
      ),
    },
    {
      title: "Section",
      dataIndex: "section",
      key: "section",
      render: (value) => <Tag color="blue">{value}</Tag>,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (value) => value || <span style={{ color: "#9aa8b6" }}>Không có</span>,
    },
    {
      title: "Variant",
      dataIndex: "variant",
      key: "variant",
      render: (value) => value || "-",
    },
    {
      title: "Thứ tự",
      dataIndex: "sortOrder",
      key: "sortOrder",
      width: 90,
    },
    {
      title: "Hiển thị",
      dataIndex: "isActive",
      key: "isActive",
      width: 110,
      render: (value) => (value ? <Tag color="green">Bật</Tag> : <Tag>Tắt</Tag>),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_, item) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEdit(item)} />
          <Popconfirm
            title="Xóa media này?"
            onConfirm={() => handleDelete(item.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Quản lý media homepage"
      extra={
        <Space>
          <Select
            value={sectionFilter}
            style={{ minWidth: 180 }}
            onChange={setSectionFilter}
            options={[{ label: "Tất cả section", value: "all" }, ...sectionOptions]}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Thêm media
          </Button>
        </Space>
      }
    >
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={filteredItems}
        scroll={{ x: 1100 }}
      />

      <Modal
        title={editingItem ? "Cập nhật media" : "Thêm media"}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={760}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleFinish}
        >
          <Form.Item label="Section" name="section" rules={[{ required: true }]}>
            <Select options={sectionOptions} />
          </Form.Item>

          <Space style={{ display: "flex" }} align="start">
            <Form.Item label="Tiêu đề" name="title" style={{ flex: 1 }}>
              <Input />
            </Form.Item>
            <Form.Item label="Thứ tự" name="sortOrder" style={{ width: 120 }}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Space>

          <Form.Item label="Subtitle" name="subtitle">
            <Input />
          </Form.Item>

          <Form.Item label="Mô tả thêm" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="URL hình ảnh" name="imageUrl" rules={[{ required: true }]}>
            <Input
              addonAfter={
                <Upload
                  showUploadList={false}
                  beforeUpload={async (file) => {
                    try {
                      const url = await uploadImage(file);
                      form.setFieldValue("imageUrl", url);
                      message.success("Upload thành công.");
                    } catch (error) {
                      message.error(error.message);
                    }

                    return false;
                  }}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              }
            />
          </Form.Item>

          <Space style={{ display: "flex" }} align="start">
            <Form.Item label="Alt text" name="altText" style={{ flex: 1 }}>
              <Input />
            </Form.Item>
            <Form.Item label="Variant" name="variant" style={{ width: 160 }}>
              <Select
                allowClear
                options={[
                  { label: "image", value: "image" },
                  { label: "content", value: "content" },
                ]}
              />
            </Form.Item>
            <Form.Item label="Tone" name="tone" style={{ width: 160 }}>
              <Select
                allowClear
                options={[
                  { label: "dark", value: "dark" },
                  { label: "gold", value: "gold" },
                ]}
              />
            </Form.Item>
          </Space>

          <Form.Item label="Hiển thị" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Space>
            <Button onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              {editingItem ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Space>
        </Form>
      </Modal>
    </Card>
  );
}
