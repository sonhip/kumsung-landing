"use client";

import { Card, Typography } from "antd";
import SiteSettingsForm from "./SiteSettingsForm";

const { Paragraph, Title } = Typography;

export default function AdminDashboard({
  mediaCount,
  productCount,
  siteSettings,
}) {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div>
        <Card>
          <Title level={2} style={{ color: "#16365f", marginTop: 0 }}>
            Tổng quan quản trị
          </Title>
          <Paragraph style={{ color: "#5f7e9d", marginBottom: 0 }}>
            Khu vực này cho phép quản lý đăng nhập admin hardcode, media
            homepage, upload ảnh và CRUD sản phẩm với nội dung chi tiết dạng
            HTML.
          </Paragraph>
        </Card>
      </div>

      <div>
        <SiteSettingsForm initialValues={siteSettings} />
      </div>

      <div
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        <Card title="Media homepage">
          <Title level={2} style={{ color: "#16365f", marginTop: 0 }}>
            {mediaCount}
          </Title>
          <Paragraph style={{ marginBottom: 0 }}>
            Tổng số media assets đang được quản lý cho homepage và logo.
          </Paragraph>
        </Card>

        <Card title="Sản phẩm">
          <Title level={2} style={{ color: "#16365f", marginTop: 0 }}>
            {productCount}
          </Title>
          <Paragraph style={{ marginBottom: 0 }}>
            Tổng số sản phẩm đang nằm trong CMS quản trị.
          </Paragraph>
        </Card>
      </div>
    </div>
  );
}
