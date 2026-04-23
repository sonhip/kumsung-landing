"use client";

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { useState } from "react";

const { Text } = Typography;

const requestCategories = async (method = "GET", payload = null) => {
  const response = await fetch("/api/admin/product-categories", {
    method,
    headers: payload
      ? {
          "Content-Type": "application/json",
        }
      : undefined,
    body: payload ? JSON.stringify(payload) : undefined,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Không thể xử lý danh mục.");
  }

  return result.items || [];
};

export default function ProductCategoryManager({ initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const loadItems = async () => {
    setLoading(true);
    try {
      const nextItems = await requestCategories("GET");
      setItems(nextItems);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    form.setFieldsValue({ name: "" });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    form.setFieldsValue({ name: item.name });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    setSaving(true);

    try {
      const payload = editingItem
        ? { originalName: editingItem.name, name: values.name }
        : { name: values.name };
      const method = editingItem ? "PATCH" : "POST";
      const nextItems = await requestCategories(method, payload);

      setItems(nextItems);
      message.success(
        editingItem ? "Đã cập nhật danh mục." : "Đã tạo danh mục mới.",
      );
      closeModal();
    } catch (error) {
      message.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    try {
      const nextItems = await requestCategories("DELETE", { name: item.name });
      setItems(nextItems);
      message.success("Đã xoá danh mục.");
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Danh mục",
      dataIndex: "name",
      key: "name",
      render: (value, item) => (
        <div>
          <Text strong>{value}</Text>
          <div style={{ color: "#7b8a99" }}>/products/{item.slug}</div>
        </div>
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "productCount",
      key: "productCount",
      width: 140,
      render: (value) => <Tag color={value > 0 ? "blue" : "default"}>{value}</Tag>,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 180,
      render: (_, item) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEditModal(item)} />
          <Popconfirm
            title="Xoá danh mục này?"
            description="Không thể xoá nếu danh mục đang có sản phẩm."
            onConfirm={() => handleDelete(item)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title="Quản lý danh mục sản phẩm"
        extra={
          <Space>
            <Button onClick={loadItems}>Tải lại</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              Thêm danh mục
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="name"
          columns={columns}
          dataSource={items}
          loading={loading}
          pagination={false}
        />
      </Card>

      <Modal
        title={editingItem ? "Sửa danh mục" : "Thêm danh mục"}
        open={modalOpen}
        onCancel={closeModal}
        onOk={() => form.submit()}
        confirmLoading={saving}
        okText={editingItem ? "Lưu" : "Tạo mới"}
        cancelText="Huỷ"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục." }]}
          >
            <Input placeholder="Ví dụ: Máy nén lạnh" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
