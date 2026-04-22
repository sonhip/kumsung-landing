"use client";

import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Popconfirm, Space, Table, Tag, Typography, message } from "antd";
import Link from "next/link";
import { useState } from "react";

const { Text } = Typography;

const formatDate = (value) => {
  if (!value) return "Chưa xuất bản";

  try {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "Chưa xuất bản";
  }
};

export default function NewsList({ initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);

  const loadItems = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/news");
      const result = await response.json();

      if (!response.ok) {
        message.error(result.error || "Không thể tải danh sách tin tức.");
        return;
      }

      setItems(result);
    } catch {
      message.error("Không thể tải danh sách tin tức.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const response = await fetch(`/api/admin/news/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      message.error(result.error || "Không thể xoá bài viết.");
      return;
    }

    message.success("Đã xoá bài viết.");
    loadItems();
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (value, item) => (
        <div>
          <Text strong>{value}</Text>
          <div style={{ color: "#7b8a99" }}>/news/{item.slug}</div>
        </div>
      ),
    },
    {
      title: "Ngày xuất bản",
      dataIndex: "publishedAt",
      key: "publishedAt",
      width: 220,
      render: (value) => formatDate(value),
    },
    {
      title: "Trạng thái",
      dataIndex: "isPublished",
      key: "isPublished",
      width: 140,
      render: (value) =>
        value ? <Tag color="green">Đã xuất bản</Tag> : <Tag>Nháp</Tag>,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 170,
      render: (_, item) => (
        <Space>
          <Link href={`/admin/news/${item.id}`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Xoá bài viết này?"
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
      title="Quản lý tin tức"
      extra={
        <Link href="/admin/news/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm bài viết
          </Button>
        </Link>
      }
    >
      <Table rowKey="id" columns={columns} dataSource={items} loading={loading} />
    </Card>
  );
}
