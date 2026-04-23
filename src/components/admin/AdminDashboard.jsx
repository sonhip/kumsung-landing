"use client";

import {
  AppstoreOutlined,
  ContactsOutlined,
  GlobalOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  MenuOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { Card, Tabs, Typography } from "antd";
import AboutPageContentForm from "./AboutPageContentForm";
import ContactPageContentForm from "./ContactPageContentForm";
import HeroContentForm from "./HeroContentForm";
import NavbarSettingsForm from "./NavbarSettingsForm";
import SiteSettingsForm from "./SiteSettingsForm";

const { Paragraph, Title } = Typography;

export default function AdminDashboard({
  mediaCount,
  productCount,
  siteSettings,
  heroContent,
  contactPageContent,
  aboutPageContent,
  navbarSettings,
}) {
  const overviewContent = (
    <div style={{ display: "grid", gap: 24 }}>
      <Card>
        <Title level={2} style={{ color: "#16365f", marginTop: 0 }}>
          Tổng quan quản trị
        </Title>
        <Paragraph style={{ color: "#5f7e9d", marginBottom: 0 }}>
          Chia theo tab để dễ thao tác nhanh: thông tin chung, banner hero,
          trang contact và trang about.
        </Paragraph>
      </Card>

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

  const tabItems = [
    {
      key: "overview",
      label: "Tổng quan",
      icon: <AppstoreOutlined />,
      children: overviewContent,
    },
    {
      key: "site-settings",
      label: "Thông tin chung",
      icon: <GlobalOutlined />,
      children: <SiteSettingsForm initialValues={siteSettings} />,
    },
    {
      key: "hero-content",
      label: "Hero Trang Chủ",
      icon: <HomeOutlined />,
      children: <HeroContentForm initialValues={heroContent} />,
    },
    {
      key: "navbar-settings",
      label: "Navbar",
      icon: <MenuOutlined />,
      children: <NavbarSettingsForm initialValues={navbarSettings} />,
    },
    {
      key: "contact-content",
      label: "Trang Contact",
      icon: <ContactsOutlined />,
      children: <ContactPageContentForm initialValues={contactPageContent} />,
    },
    {
      key: "about-content",
      label: "Trang About",
      icon: <ProfileOutlined />,
      children: <AboutPageContentForm initialValues={aboutPageContent} />,
    },
  ];

  return (
    <Card
      title={
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "#16365f",
          }}
        >
          <InfoCircleOutlined />
          Quản trị nội dung website
        </span>
      }
      styles={{
        body: {
          paddingTop: 12,
        },
      }}
    >
      <Tabs
        defaultActiveKey="overview"
        items={tabItems}
        destroyOnHidden
        tabBarGutter={8}
      />
    </Card>
  );
}
