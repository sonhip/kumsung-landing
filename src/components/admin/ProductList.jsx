"use client";

import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Popconfirm, Space, Table, Tag, Typography, message } from "antd";
import Link from "next/link";
import { useState } from "react";

const { Text } = Typography;

export default function ProductList({ initialProducts = [] }) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/products");
      const result = await response.json();

      if (!response.ok) {
        message.error(result.error || "Không thể tải sản phẩm.");
        return;
      }

      setProducts(result);
    } catch {
      message.error("Không thể tải sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const response = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      message.error(result.error || "Không thể xóa sản phẩm.");
      return;
    }

    message.success("Đã xóa sản phẩm.");
    loadProducts();
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "title",
      key: "title",
      render: (value, item) => (
        <div>
          <Text strong>{value}</Text>
          <div style={{ color: "#7b8a99" }}>{item.model}</div>
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags = []) => (
        <Space wrap>
          {tags.length
            ? tags.map((tag) => <Tag key={tag}>{tag}</Tag>)
            : <Text type="secondary">Không có</Text>}
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      render: (value) => (value ? <Tag color="green">Hiển thị</Tag> : <Tag>Tắt</Tag>),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 160,
      render: (_, item) => (
        <Space>
          <Link href={`/admin/products/${item.id}`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Xóa sản phẩm này?"
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
      title="Quản lý sản phẩm"
      extra={
        <Link href="/admin/products/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm sản phẩm
          </Button>
        </Link>
      }
    >
      <Table rowKey="id" columns={columns} dataSource={products} loading={loading} />
    </Card>
  );
}
