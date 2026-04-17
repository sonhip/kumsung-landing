"use client";

import { AppstoreOutlined, FileImageOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, Typography, message } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

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
];

export default function AdminLayoutShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const selectedKey =
    menuItems.find((item) => pathname === item.key || pathname.startsWith(`${item.key}/`))
      ?.key || "/admin";

  const handleLogout = async () => {
    const response = await fetch("/api/admin/logout", {
      method: "POST",
    });

    if (!response.ok) {
      message.error("Không thể đăng xuất.");
      return;
    }

    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f4f8fc" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        width={260}
        style={{ background: "#0f3359" }}
      >
        <div style={{ padding: 24, color: "#fff" }}>
          <Title level={3} style={{ color: "#fff", margin: 0 }}>
            Tân Việt Admin
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.72)" }}>
            Quản trị nội dung website
          </Text>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{ background: "#0f3359", borderInlineEnd: 0 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            borderBottom: "1px solid rgba(15, 51, 89, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0, color: "#16365f" }}>
              Khu vực quản trị
            </Title>
            <Text style={{ color: "#5f7e9d" }}>
              Đăng nhập với tài khoản hardcode `admin/admin`
            </Text>
          </div>

          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Header>

        <Content style={{ padding: 24 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
