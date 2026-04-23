"use client";

import { SaveOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Col, Form, Input, Row, Space, message } from "antd";

const defaultVisibility = {
  home: true,
  products: true,
  news: true,
  contact: true,
  about: true,
};

export default function NavbarSettingsForm({ initialValues }) {
  const [form] = Form.useForm();

  const mergedInitialValues = {
    home: initialValues?.home || "Trang chủ",
    products: initialValues?.products || "Sản phẩm",
    news: initialValues?.news || "Tin tức",
    contact: initialValues?.contact || "Liên hệ",
    about: initialValues?.about || "Giới thiệu",
    toggleMenuAriaLabel:
      initialValues?.toggleMenuAriaLabel || "Mở hoặc đóng menu điều hướng",
    toggleProductsAriaLabel:
      initialValues?.toggleProductsAriaLabel || "Mở menu sản phẩm",
    visibility: {
      ...defaultVisibility,
      ...(initialValues?.visibility || {}),
    },
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={mergedInitialValues}
      onFinish={async (values) => {
        try {
          const response = await fetch("/api/admin/navbar-settings", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ nav: values }),
          });

          const result = await response.json();

          if (!response.ok) {
            message.error(result.error || "Không thể lưu cài đặt navbar.");
            return;
          }

          form.setFieldsValue(result.nav);
          message.success("Đã cập nhật cài đặt navbar.");
        } catch {
          message.error("Không thể lưu cài đặt navbar.");
        }
      }}
    >
      <Space direction="vertical" size={16} style={{ display: "flex" }}>
        <Card title="Nhãn menu điều hướng">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Trang chủ" name="home">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Sản phẩm" name="products">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Tin tức" name="news">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Liên hệ" name="contact">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Giới thiệu" name="about">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Hiển thị menu">
          <Row gutter={[16, 8]}>
            <Col xs={24} md={12}>
              <Form.Item name={["visibility", "home"]} valuePropName="checked">
                <Checkbox>Hiển thị Trang chủ</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name={["visibility", "products"]}
                valuePropName="checked"
              >
                <Checkbox>Hiển thị Sản phẩm</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name={["visibility", "news"]} valuePropName="checked">
                <Checkbox>Hiển thị Tin tức</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name={["visibility", "contact"]} valuePropName="checked">
                <Checkbox>Hiển thị Liên hệ</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name={["visibility", "about"]} valuePropName="checked">
                <Checkbox>Hiển thị Giới thiệu</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Accessibility">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Aria label nút menu" name="toggleMenuAriaLabel">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Aria label menu sản phẩm"
                name="toggleProductsAriaLabel"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Button htmlType="submit" type="primary" icon={<SaveOutlined />}>
          Lưu cài đặt navbar
        </Button>
      </Space>
    </Form>
  );
}
