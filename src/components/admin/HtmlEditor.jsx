"use client";

import {
  BoldOutlined,
  FileImageOutlined,
  FontSizeOutlined,
  OrderedListOutlined,
  PictureOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Card, Select, Space, Typography } from "antd";
import { useEffect, useRef, useState } from "react";

const { Text } = Typography;

export default function HtmlEditor({
  value,
  onChange,
  mediaOptions = [],
}) {
  const editorRef = useRef(null);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState();

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const focusEditor = () => editorRef.current?.focus();

  const applyCommand = (command, commandValue = null) => {
    focusEditor();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current?.innerHTML || "");
  };

  const insertImageUrl = (url) => {
    if (!url) return;
    applyCommand("insertImage", url);
  };

  return (
    <Card
      title="Nội dung chi tiết"
      extra={<Text type="secondary">Editor HTML đơn giản có chèn ảnh</Text>}
    >
      <Space wrap style={{ marginBottom: 16 }}>
        <Button icon={<BoldOutlined />} onClick={() => applyCommand("bold")}>
          Đậm
        </Button>
        <Button icon={<FontSizeOutlined />} onClick={() => applyCommand("formatBlock", "<h2>")}>
          Tiêu đề H2
        </Button>
        <Button icon={<OrderedListOutlined />} onClick={() => applyCommand("insertOrderedList")}>
          Danh sách số
        </Button>
        <Button icon={<UnorderedListOutlined />} onClick={() => applyCommand("insertUnorderedList")}>
          Danh sách chấm
        </Button>
        <Button
          icon={<PictureOutlined />}
          onClick={() => {
            const imageUrl = window.prompt("Nhập URL hình ảnh");
            if (imageUrl) insertImageUrl(imageUrl);
          }}
        >
          Chèn ảnh theo URL
        </Button>
      </Space>

      <Space wrap style={{ marginBottom: 16 }}>
        <Select
          allowClear
          showSearch
          style={{ minWidth: 280 }}
          placeholder="Chọn ảnh từ media library"
          value={selectedMediaUrl}
          onChange={setSelectedMediaUrl}
          options={mediaOptions.map((item) => ({
            label: `${item.section} - ${item.title || item.imageUrl}`,
            value: item.imageUrl,
          }))}
        />
        <Button
          icon={<FileImageOutlined />}
          disabled={!selectedMediaUrl}
          onClick={() => insertImageUrl(selectedMediaUrl)}
        >
          Chèn ảnh đã upload
        </Button>
      </Space>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(editorRef.current?.innerHTML || "")}
        style={{
          minHeight: 320,
          border: "1px solid #d9e2ec",
          borderRadius: 12,
          padding: 16,
          background: "#fff",
          outline: "none",
        }}
      />
    </Card>
  );
}
