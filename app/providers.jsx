"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider } from "antd";

export default function Providers({ children }) {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#2F5F93",
            colorInfo: "#2F5F93",
            colorSuccess: "#42AF54",
            colorText: "#16365F",
            colorTextSecondary: "#4F6B87",
            colorTextPlaceholder: "#7B91A8",
            colorBorder: "#C9D7E6",
            colorBgBase: "#FFFFFF",
            colorBgContainer: "#FFFFFF",
            colorBgElevated: "#FFFFFF",
            colorFillSecondary: "#EEF4FA",
            borderRadius: 10,
          },
          components: {
            Layout: {
              headerBg: "#FFFFFF",
              siderBg: "#F4F8FC",
              bodyBg: "#F7FAFD",
            },
            Menu: {
              itemBg: "transparent",
              itemColor: "#35506B",
              itemHoverColor: "#16365F",
              itemHoverBg: "#EAF1F8",
              itemSelectedColor: "#16365F",
              itemSelectedBg: "#DCE8F4",
            },
            Card: {
              colorBgContainer: "#FFFFFF",
            },
            Input: {
              colorBgContainer: "#FFFFFF",
              activeBorderColor: "#2F5F93",
              hoverBorderColor: "#5F86B1",
            },
            Button: {
              primaryShadow: "none",
            },
          },
        }}
      >
        <App>{children}</App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
