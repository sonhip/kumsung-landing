"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

export default function Providers({ children }) {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#F5A623",
            borderRadius: 4,
            colorBgContainer: "#1A1A1A",
          },
        }}
      >
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}
