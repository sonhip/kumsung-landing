"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

export default function Providers({ children }) {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#2F5F93",
            borderRadius: 4,
            colorBgContainer: "#16365F",
          },
        }}
      >
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}
