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
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

const { Text } = Typography;

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const insertHtmlAtCursor = (editor, html, onChange) => {
  if (!editor) return;

  editor.focus();
  const selection = window.getSelection();

  if (
    !selection ||
    selection.rangeCount === 0 ||
    !editor.contains(selection.anchorNode)
  ) {
    editor.insertAdjacentHTML("beforeend", html);
    onChange(editor.innerHTML || "");
    return;
  }

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const template = document.createElement("template");
  template.innerHTML = html;
  const fragment = template.content;
  const lastNode = fragment.lastChild;

  range.insertNode(fragment);

  if (lastNode) {
    range.setStartAfter(lastNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  onChange(editor.innerHTML || "");
};

const HtmlEditor = forwardRef(function HtmlEditor(
  { value, onChange, mediaOptions = [] },
  ref,
) {
  const editorRef = useRef(null);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState();

  const dedupedMediaOptions = useMemo(() => {
    const seen = new Set();
    return mediaOptions.filter((item) => {
      if (!item?.imageUrl || seen.has(item.imageUrl)) {
        return false;
      }

      seen.add(item.imageUrl);
      return true;
    });
  }, [mediaOptions]);

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
    const html = `<p><img src="${escapeHtml(url)}" alt="" style="max-width:100%;height:auto;display:block;margin:12px 0;" /></p>`;
    insertHtmlAtCursor(editorRef.current, html, onChange);
  };

  useImperativeHandle(ref, () => ({
    insertHtml: (html) => insertHtmlAtCursor(editorRef.current, html, onChange),
    focus: focusEditor,
  }));

  return (
    <Card
      title="Nội dung chi tiết"
      extra={
        <Text type="secondary">
          Editor HTML đơn giản có chèn ảnh, file, video
        </Text>
      }
    >
      <Space wrap style={{ marginBottom: 16 }}>
        <Button icon={<BoldOutlined />} onClick={() => applyCommand("bold")}>
          Đậm
        </Button>
        <Button
          icon={<FontSizeOutlined />}
          onClick={() => applyCommand("formatBlock", "<h2>")}
        >
          Tiêu đề H2
        </Button>
        <Button
          icon={<OrderedListOutlined />}
          onClick={() => applyCommand("insertOrderedList")}
        >
          Danh sách số
        </Button>
        <Button
          icon={<UnorderedListOutlined />}
          onClick={() => applyCommand("insertUnorderedList")}
        >
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
          options={dedupedMediaOptions.map((item) => ({
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
});

export default HtmlEditor;
