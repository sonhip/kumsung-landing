"use client";

import {
  AppstoreOutlined,
  FileImageOutlined,
  LogoutOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { App, Button, Layout, Menu, Typography } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const brandColor = "#16365F";
const shellBorder = "1px solid rgba(22, 54, 95, 0.08)";
const shellShadow = "0 18px 40px rgba(22, 54, 95, 0.08)";

const menuItems = [
  {
    key: "/admin",
    icon: <AppstoreOutlined />,
    label: <Link href="/admin">Tổng quan</Link>,
  },
  {
    key: "/admin/media",
    icon: <FileImageOutlined />,
    label: <Link href="/admin/media">Quản lý media</Link>,
  },
  {
    key: "/admin/products",
    icon: <AppstoreOutlined />,
    label: <Link href="/admin/products">Quản lý sản phẩm</Link>,
  },
  {
    key: "/admin/team-members",
    icon: <TeamOutlined />,
    label: <Link href="/admin/team-members">Quản lý thành viên</Link>,
  },
  {
    key: "/admin/users",
    icon: <UserOutlined />,
    label: <Link href="/admin/users">Quản lý user</Link>,
  },
];

export default function AdminLayoutShell({ children }) {
  const { message, modal } = App.useApp();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  const selectedKey =
    menuItems
      .filter(
        (item) => pathname === item.key || pathname.startsWith(`${item.key}/`),
      )
      .sort((left, right) => right.key.length - left.key.length)?.[0]?.key ||
    "/admin";

  const handleLogout = () => {
    modal.confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn có chắc muốn đăng xuất khỏi khu vực quản trị?",
      okText: "Đăng xuất",
      cancelText: "Huỷ",
      okButtonProps: { danger: true },
      onOk: async () => {
        const response = await fetch("/api/admin/logout", {
          method: "POST",
        });

        if (!response.ok) {
          message.error("Không thể đăng xuất.");
          return;
        }

        router.replace("/admin/login");
        router.refresh();
      },
    });
  };

  if (isLoginPage) {
    return children;
  }

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f7fbfe 0%, #eef4fa 100%)",
      }}
    >
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        width={260}
        theme="light"
        style={{
          background: "rgba(255, 255, 255, 0.92)",
          borderRight: shellBorder,
          boxShadow: "12px 0 32px rgba(22, 54, 95, 0.06)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            padding: 24,
            color: brandColor,
            borderBottom: shellBorder,
            background:
              "linear-gradient(180deg, rgba(220, 232, 244, 0.65) 0%, rgba(255, 255, 255, 0.8) 100%)",
          }}
        >
          <Title level={3} style={{ color: brandColor, margin: 0 }}>
            Tân Việt Admin
          </Title>
          <Text style={{ color: "#5F7E9D" }}>Quản trị nội dung website</Text>
        </div>

        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{
            background: "transparent",
            borderInlineEnd: 0,
            padding: 16,
            color: brandColor,
          }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            padding: "12px 24px",
            borderBottom: shellBorder,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backdropFilter: "blur(10px)",
            position: "sticky",
            top: 0,
            zIndex: 20,
            height: "auto",
            lineHeight: "normal",
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0, color: brandColor }}>
              Khu vực quản trị
            </Title>
            <Text style={{ color: "#5f7e9d" }}>
              Đăng nhập theo tài khoản user trong database
            </Text>
          </div>

          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{
              borderColor: "#BFD0E0",
              color: brandColor,
              background: "#FFFFFF",
            }}
          >
            Đăng xuất
          </Button>
        </Header>

        <Content
          style={{
            padding: 24,
            background: "transparent",
          }}
        >
          <div
            style={{
              minHeight: "calc(100vh - 112px)",
              border: shellBorder,
              background: "rgba(255, 255, 255, 0.72)",
              boxShadow: shellShadow,
              borderRadius: 20,
              padding: 24,
              backdropFilter: "blur(10px)",
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
