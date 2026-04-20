"use client";

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tag,
  message,
} from "antd";
import { useState } from "react";

const initialValues = {
  username: "",
  email: "",
  recoveryEmail: "",
  password: "",
  isActive: true,
};

export default function UserManager({ initialItems = [] }) {
  const [form] = Form.useForm();
  const [items, setItems] = useState(initialItems);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadItems = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/users");
      const result = await response.json();

      if (!response.ok) {
        message.error(result.error || "Không thể tải danh sách user.");
        return;
      }

      setItems(result);
    } catch {
      message.error("Không thể tải danh sách user.");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingItem(null);
    form.setFieldsValue(initialValues);
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    form.setFieldsValue({
      username: item.username,
      email: item.email,
      recoveryEmail: item.recoveryEmail || "",
      password: "",
      isActive: item.isActive,
    });
    setOpen(true);
  };

  const handleFinish = async (values) => {
    setSaving(true);

    const payload = {
      ...values,
      recoveryEmail: values.recoveryEmail || null,
    };

    if (editingItem && !payload.password) {
      delete payload.password;
    }

    const endpoint = editingItem
      ? `/api/admin/users/${editingItem.id}`
      : "/api/admin/users";

    const method = editingItem ? "PATCH" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        message.error(result.error || "Không thể lưu user.");
        return;
      }

      message.success(editingItem ? "Đã cập nhật user." : "Đã tạo user.");
      setOpen(false);
      loadItems();
    } catch {
      message.error("Không thể lưu user.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    try {
      const response = await fetch(`/api/admin/users/${item.id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        message.error(result.error || "Không thể xoá user.");
        return;
      }

      message.success("Đã xoá user.");
      loadItems();
    } catch {
      message.error("Không thể xoá user.");
    }
  };

  const columns = [
    {
      title: "Tài khoản",
      dataIndex: "username",
      key: "username",
      render: (value, item) => (
        <Space>
          <strong>{value}</strong>
          {item.isRoot ? (
            <Tag color="gold" icon={<SafetyCertificateOutlined />}>
              Root
            </Tag>
          ) : null}
        </Space>
      ),
    },
    {
      title: "Email đăng nhập",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Email reset password",
      dataIndex: "recoveryEmail",
      key: "recoveryEmail",
      render: (value) => value || "-",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (value) => (value ? <Tag color="green">Hoạt động</Tag> : <Tag>Tạm khoá</Tag>),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_, item) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEdit(item)} />
          <Popconfirm
            title="Xoá user này?"
            onConfirm={() => handleDelete(item)}
            disabled={item.isRoot}
          >
            <Button danger icon={<DeleteOutlined />} disabled={item.isRoot} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Quản lý user hệ thống"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Thêm user
        </Button>
      }
    >
      <Table
        rowKey="id"
        loading={loading}
        dataSource={items}
        columns={columns}
      />

      <Modal
        title={editingItem ? "Cập nhật user" : "Thêm user"}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={640}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleFinish}
        >
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập." }]}
          >
            <Input disabled={editingItem?.isRoot} />
          </Form.Item>

          <Form.Item
            label="Email đăng nhập"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email." },
              { type: "email", message: "Email không hợp lệ." },
            ]}
          >
            <Input disabled={editingItem?.isRoot} />
          </Form.Item>

          <Form.Item
            label="Email reset password"
            name="recoveryEmail"
            rules={[{ type: "email", message: "Email không hợp lệ." }]}
          >
            <Input placeholder="Ví dụ: tanvietref@gmail.com" />
          </Form.Item>

          <Form.Item
            label={editingItem ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"}
            name="password"
            rules={
              editingItem
                ? []
                : [{ required: true, message: "Vui lòng nhập mật khẩu." }]
            }
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Hoạt động"
            name="isActive"
            valuePropName="checked"
          >
            <Switch disabled={Boolean(editingItem?.isRoot)} />
          </Form.Item>

          <Space>
            <Button onClick={() => setOpen(false)}>Huỷ</Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              {editingItem ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Space>
        </Form>
      </Modal>
    </Card>
  );
}
