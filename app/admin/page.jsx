import { Card, Col, Row, Typography } from "antd";
import SiteSettingsForm from "../../src/components/admin/SiteSettingsForm";
import {
  getAdminMediaAssets,
  getAdminProducts,
  getSiteSettings,
} from "../../src/lib/cms";

const { Paragraph, Title } = Typography;

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [mediaAssets, products, siteSettings] = await Promise.all([
    getAdminMediaAssets(),
    getAdminProducts(),
    getSiteSettings(),
  ]);

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card>
          <Title level={2} style={{ color: "#16365f", marginTop: 0 }}>
            Tổng quan quản trị
          </Title>
          <Paragraph style={{ color: "#5f7e9d", marginBottom: 0 }}>
            Khu vực này cho phép quản lý đăng nhập admin hardcode, media homepage,
            upload ảnh và CRUD sản phẩm với nội dung chi tiết dạng HTML.
          </Paragraph>
        </Card>
      </Col>

      <Col span={24}>
        <SiteSettingsForm initialValues={siteSettings} />
      </Col>

      <Col xs={24} md={12}>
        <Card title="Media homepage">
          <Title level={2} style={{ color: "#16365f", marginTop: 0 }}>
            {mediaAssets.length}
          </Title>
          <Paragraph style={{ marginBottom: 0 }}>
            Tổng số media assets đang được quản lý cho homepage và logo.
          </Paragraph>
        </Card>
      </Col>

      <Col xs={24} md={12}>
        <Card title="Sản phẩm">
          <Title level={2} style={{ color: "#16365f", marginTop: 0 }}>
            {products.length}
          </Title>
          <Paragraph style={{ marginBottom: 0 }}>
            Tổng số sản phẩm đang nằm trong CMS quản trị.
          </Paragraph>
        </Card>
      </Col>
    </Row>
  );
}
