"use client";

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tag,
  Upload,
} from "antd";
import { useState } from "react";

const initialValues = {
  fullName: "",
  role: "",
  email: "",
  phone: "",
  imageUrl: "",
  bio: "",
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

export default function TeamMemberManager({ initialItems = [] }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadItems = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/team-members");
      const result = await response.json();

      if (!response.ok) {
        message.error(result.error || "Không thể tải thành viên.");
        return;
      }

      setItems(result);
    } catch {
      message.error("Không thể tải thành viên.");
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
      ...item,
      isActive: Boolean(item.isActive),
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    const response = await fetch(`/api/admin/team-members/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      message.error(result.error || "Không thể xóa thành viên.");
      return;
    }

    message.success("Đã xóa thành viên.");
    loadItems();
  };

  const handleFinish = async (values) => {
    setSaving(true);

    const response = await fetch(
      editingItem
        ? `/api/admin/team-members/${editingItem.id}`
        : "/api/admin/team-members",
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
      message.error(result.error || "Không thể lưu thành viên.");
      return;
    }

    message.success(editingItem ? "Đã cập nhật thành viên." : "Đã tạo thành viên.");
    setOpen(false);
    loadItems();
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 96,
      render: (value, item) =>
        value ? (
          <Image
            src={value}
            alt={item.fullName}
            width={58}
            height={58}
            style={{ objectFit: "cover", borderRadius: 10 }}
          />
        ) : (
          <Tag>Không có ảnh</Tag>
        ),
    },
    {
      title: "Thành viên",
      key: "member",
      render: (_, item) => (
        <div>
          <div style={{ fontWeight: 600 }}>{item.fullName}</div>
          <div style={{ color: "#7b8a99" }}>{item.role || "Đang cập nhật"}</div>
        </div>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      render: (_, item) => (
        <div>
          <div>{item.email || "-"}</div>
          <div style={{ color: "#7b8a99" }}>{item.phone || "-"}</div>
        </div>
      ),
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
      render: (value) =>
        value ? <Tag color="green">Bật</Tag> : <Tag>Tắt</Tag>,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_, item) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEdit(item)} />
          <Popconfirm
            title="Xóa thành viên này?"
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
      title="Quản lý thành viên"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Thêm thành viên
        </Button>
      }
    >
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={items}
        scroll={{ x: 980 }}
      />

      <Modal
        title={editingItem ? "Cập nhật thành viên" : "Thêm thành viên"}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={760}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleFinish}
        >
          <Space style={{ display: "flex" }} align="start">
            <Form.Item
              label="Họ và tên"
              name="fullName"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Vui lòng nhập họ và tên." }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Thứ tự" name="sortOrder" style={{ width: 120 }}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Space>

          <Form.Item label="Chức danh" name="role">
            <Input />
          </Form.Item>

          <Space style={{ display: "flex" }} align="start">
            <Form.Item label="Email" name="email" style={{ flex: 1 }}>
              <Input type="email" />
            </Form.Item>
            <Form.Item label="Số điện thoại" name="phone" style={{ flex: 1 }}>
              <Input />
            </Form.Item>
          </Space>

          <Form.Item label="Tiểu sử ngắn" name="bio">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Ảnh đại diện (URL)" name="imageUrl">
            <Input
              addonAfter={
                <Upload
                  showUploadList={false}
                  beforeUpload={async (file) => {
                    try {
                      const url = await uploadImage(file);
                      form.setFieldValue("imageUrl", url);
                      message.success("Upload ảnh thành công.");
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

          <Form.Item name="isActive" valuePropName="checked" label="Hiển thị">
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
