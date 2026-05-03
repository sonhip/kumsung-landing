"use client";

import {
  ArrowLeftOutlined,
  DeleteOutlined,
  FileOutlined,
  LinkOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Space,
  Typography,
  Upload,
  message,
} from "antd";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import HtmlEditor from "./HtmlEditor";

const { Paragraph, Title, Text } = Typography;

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "editor");

  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Upload thất bại.");
  }

  return result;
};

const toDateTimeLocalValue = (value) => {
  if (!value) return "";
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const getFileNameFromUrl = (value) => {
  if (!value) return "Tài liệu";

  try {
    const path = new URL(value, "https://example.com").pathname;
    const fileName = decodeURIComponent(
      path.split("/").filter(Boolean).pop() || "",
    );
    return fileName || "Tài liệu";
  } catch {
    const fileName = decodeURIComponent(
      value.split("/").filter(Boolean).pop() || "",
    );
    return fileName || "Tài liệu";
  }
};

const getFileTypeFromName = (fileName) => {
  const ext = fileName.includes(".")
    ? fileName.split(".").pop().toLowerCase()
    : "";

  const map = {
    pdf: "PDF",
    doc: "Word",
    docx: "Word",
    xls: "Excel",
    xlsx: "Excel",
    ppt: "PowerPoint",
    pptx: "PowerPoint",
    txt: "Text",
    csv: "CSV",
    zip: "ZIP",
  };

  return map[ext] || ext.toUpperCase() || "File";
};

const resolveYouTubeSrc = (value) => {
  if (!value) return "";

  const raw = String(value).trim();

  if (raw.startsWith("<iframe")) {
    const match = raw.match(/src=["']([^"']+)["']/i);
    return match?.[1] || "";
  }

  try {
    const url = new URL(raw);

    if (url.hostname.includes("youtu.be")) {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    }

    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.includes("/embed/")) {
        return raw;
      }

      const videoId = url.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    }
  } catch {
    return "";
  }

  return "";
};

const buildAttachmentInsertHtml = (item) => {
  const name = escapeHtml(item.fileName);
  const url = escapeHtml(item.url);

  return `
    <div style="margin:16px 0;padding:14px 16px;border:1px solid #d9e2ec;border-radius:12px;background:#f8fbff;">
      <div style="font-weight:700;color:#16365f;margin-bottom:4px;">📎 ${name}</div>
      <div style="font-size:13px;color:#5f7e9d;margin-bottom:8px;">${escapeHtml(item.fileType || "File")}</div>
      <a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#0b63ce;text-decoration:none;">Mở / tải tài liệu</a>
    </div>
  `;
};

const buildYouTubeInsertHtml = (value) => {
  const src = resolveYouTubeSrc(value);
  const safeRaw = escapeHtml(value);

  if (!src) {
    return `<p><a href="${safeRaw}" target="_blank" rel="noopener noreferrer">Xem video YouTube</a></p>`;
  }

  return `
    <div style="margin:16px 0;aspect-ratio:16/9;border:1px solid #d9e2ec;border-radius:12px;overflow:hidden;background:#000;">
      <iframe
        src="${escapeHtml(src)}"
        title="YouTube video"
        width="100%"
        height="100%"
        style="border:0;display:block;"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>
  `;
};

export default function NewsEditor({
  mode,
  initialItem = null,
  mediaLibrary = [],
}) {
  const router = useRouter();
  const editorRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingAttachments, setUploadingAttachments] = useState(false);
  const [contentHtml, setContentHtml] = useState(
    initialItem?.contentHtml || "",
  );
  const [coverImage, setCoverImage] = useState(initialItem?.coverImage || "");
  const [attachmentItems, setAttachmentItems] = useState(
    (initialItem?.attachmentUrls || [])
      .map((url) => {
        if (!url) return null;
        const fileName = getFileNameFromUrl(url);
        return {
          url,
          fileName,
          fileType: getFileTypeFromName(fileName),
        };
      })
      .filter(Boolean),
  );
  const [youtubeItems, setYoutubeItems] = useState(
    (initialItem?.youtubeEmbeds || [])
      .map((value) => (typeof value === "string" ? value.trim() : ""))
      .filter(Boolean),
  );
  const [youtubeDraft, setYoutubeDraft] = useState("");

  const [form] = Form.useForm();

  const initialValues = useMemo(
    () => ({
      title: initialItem?.title || "",
      slug: initialItem?.slug || "",
      excerpt: initialItem?.excerpt || "",
      publishedAt: toDateTimeLocalValue(initialItem?.publishedAt),
      isPublished: initialItem?.isPublished ?? false,
    }),
    [initialItem],
  );

  const insertIntoEditor = (html) => {
    editorRef.current?.insertHtml(html);
  };

  const handleAddAttachment = async (file) => {
    setUploadingAttachments(true);

    try {
      const result = await uploadFile(file);
      const fileName = result.fileName || getFileNameFromUrl(result.url);
      const fileType = result.fileType || getFileTypeFromName(fileName);

      setAttachmentItems((prev) => [
        ...prev,
        {
          url: result.url,
          fileName,
          fileType,
        },
      ]);
      message.success(`Upload "${file.name}" thành công.`);
    } catch (error) {
      message.error(error.message);
    } finally {
      setUploadingAttachments(false);
    }

    return false;
  };

  const handleAddYoutube = () => {
    const value = youtubeDraft.trim();
    if (!value) {
      message.warning("Vui lòng dán iframe hoặc URL YouTube.");
      return;
    }

    setYoutubeItems((prev) => [...prev, value]);
    setYoutubeDraft("");
  };

  const handleSubmit = async (values) => {
    setSaving(true);

    try {
      const payload = {
        ...values,
        coverImage,
        attachmentUrls: attachmentItems.map((item) => item.url),
        youtubeEmbeds: youtubeItems,
        contentHtml,
        publishedAt: values.publishedAt || null,
      };

      const response = await fetch(
        mode === "edit"
          ? `/api/admin/news/${initialItem.id}`
          : "/api/admin/news",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        message.error(result.error || "Không thể lưu bài viết.");
        return;
      }

      message.success(
        mode === "edit" ? "Đã cập nhật bài viết." : "Đã tạo bài viết.",
      );
      router.push("/admin/news");
      router.refresh();
    } catch {
      message.error("Không thể lưu bài viết.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Space direction="vertical" size={24} style={{ display: "flex" }}>
      <Card>
        <Space direction="vertical" size={4}>
          <Link href="/admin/news">
            <Button icon={<ArrowLeftOutlined />}>Quay lại danh sách</Button>
          </Link>
          <Title level={3} style={{ margin: 0, color: "#16365f" }}>
            {mode === "edit" ? "Cập nhật bài viết" : "Thêm bài viết mới"}
          </Title>
          <Paragraph style={{ margin: 0, color: "#5f7e9d" }}>
            Soạn nội dung tin tức, đính kèm tài liệu, chèn YouTube và xuất bản
            trực tiếp lên trang công khai.
          </Paragraph>
        </Space>
      </Card>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSubmit}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} xl={8}>
            <Card title="Thông tin bài viết">
              <Form.Item
                label="Tiêu đề"
                name="title"
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề." }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Slug (tùy chọn)" name="slug">
                <Input placeholder="de-trong-de-tu-tao-theo-tieu-de" />
              </Form.Item>

              <Form.Item label="Mô tả ngắn" name="excerpt">
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item label="Ảnh cover">
                <Input
                  value={coverImage}
                  onChange={(event) => setCoverImage(event.target.value)}
                  placeholder="/uploads/..."
                />
              </Form.Item>

              <Upload
                showUploadList={false}
                beforeUpload={async (file) => {
                  setUploadingCover(true);

                  try {
                    const result = await uploadFile(file);
                    setCoverImage(result.url);
                    message.success("Upload ảnh cover thành công.");
                  } catch (error) {
                    message.error(error.message);
                  } finally {
                    setUploadingCover(false);
                  }

                  return false;
                }}
              >
                <Button
                  icon={<UploadOutlined />}
                  loading={uploadingCover}
                  block
                  style={{ marginBottom: 12 }}
                >
                  {uploadingCover ? "Đang upload..." : "Upload ảnh cover"}
                </Button>
              </Upload>

              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Cover preview"
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderRadius: 10,
                    marginBottom: 14,
                  }}
                />
              ) : null}

              <Space direction="vertical" style={{ width: "100%" }} size={12}>
                <Text strong>Các file đính kèm (doc, excel, pdf, ...)</Text>
                <Upload
                  multiple
                  showUploadList={false}
                  beforeUpload={handleAddAttachment}
                >
                  <Button
                    icon={<UploadOutlined />}
                    loading={uploadingAttachments}
                    block
                  >
                    {uploadingAttachments
                      ? "Đang upload..."
                      : "Upload file đính kèm"}
                  </Button>
                </Upload>
              </Space>

              {attachmentItems.length > 0 ? (
                <div
                  style={{
                    padding: 12,
                    background: "#f5f7fa",
                    borderRadius: 10,
                    marginTop: 12,
                    marginBottom: 14,
                  }}
                >
                  <div style={{ marginBottom: 10, fontWeight: 600 }}>
                    Các file đã upload
                  </div>
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size={10}
                  >
                    {attachmentItems.map((item, index) => (
                      <div
                        key={`${item.url}-${index}`}
                        style={{
                          padding: 12,
                          background: "#fff",
                          border: "1px solid #e0e7ef",
                          borderRadius: 10,
                        }}
                      >
                        <div style={{ fontWeight: 600, color: "#16365f" }}>
                          <FileOutlined style={{ marginRight: 8 }} />
                          {item.fileName}
                        </div>
                        <div
                          style={{
                            color: "#5f7e9d",
                            fontSize: 12,
                            marginTop: 4,
                          }}
                        >
                          {item.fileType} · {item.url}
                        </div>
                        <Space wrap style={{ marginTop: 10 }}>
                          <Button
                            icon={<LinkOutlined />}
                            onClick={() =>
                              insertIntoEditor(buildAttachmentInsertHtml(item))
                            }
                          >
                            Chèn vào bàn viết
                          </Button>
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() =>
                              setAttachmentItems((prev) =>
                                prev.filter((_, i) => i !== index),
                              )
                            }
                          >
                            Xoá
                          </Button>
                        </Space>
                      </div>
                    ))}
                  </Space>
                </div>
              ) : null}

              <Space direction="vertical" style={{ width: "100%" }} size={12}>
                <Text strong>YouTube (iframe hoặc URL)</Text>
                <Input.TextArea
                  rows={3}
                  value={youtubeDraft}
                  onChange={(e) => setYoutubeDraft(e.target.value)}
                  placeholder='Dán URL YouTube hoặc iframe, ví dụ: https://www.youtube.com/watch?v=... hoặc <iframe src="...">'
                />
                <Button
                  icon={<LinkOutlined />}
                  block
                  onClick={handleAddYoutube}
                >
                  Thêm YouTube
                </Button>
              </Space>

              {youtubeItems.length > 0 ? (
                <div
                  style={{
                    padding: 12,
                    background: "#f5f7fa",
                    borderRadius: 10,
                    marginTop: 12,
                    marginBottom: 14,
                  }}
                >
                  <div style={{ marginBottom: 10, fontWeight: 600 }}>
                    Các video YouTube đã thêm
                  </div>
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size={10}
                  >
                    {youtubeItems.map((item, index) => (
                      <div
                        key={`${index}-${item.slice(0, 24)}`}
                        style={{
                          padding: 12,
                          background: "#fff",
                          border: "1px solid #e0e7ef",
                          borderRadius: 10,
                        }}
                      >
                        <div style={{ fontWeight: 600, color: "#16365f" }}>
                          🎬 YouTube {index + 1}
                        </div>
                        <div
                          style={{
                            color: "#5f7e9d",
                            fontSize: 12,
                            marginTop: 4,
                            wordBreak: "break-all",
                          }}
                        >
                          {item}
                        </div>
                        <Space wrap style={{ marginTop: 10 }}>
                          <Button
                            icon={<LinkOutlined />}
                            onClick={() =>
                              insertIntoEditor(buildYouTubeInsertHtml(item))
                            }
                          >
                            Chèn vào bàn viết
                          </Button>
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() =>
                              setYoutubeItems((prev) =>
                                prev.filter((_, i) => i !== index),
                              )
                            }
                          >
                            Xoá
                          </Button>
                        </Space>
                      </div>
                    ))}
                  </Space>
                </div>
              ) : null}

              <Form.Item
                label="Thời gian xuất bản"
                name="publishedAt"
                tooltip="Để trống nếu muốn lấy thời gian hiện tại lúc xuất bản."
              >
                <Input type="datetime-local" />
              </Form.Item>

              <Form.Item name="isPublished" valuePropName="checked">
                <Checkbox>Xuất bản bài viết</Checkbox>
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} xl={16}>
            <HtmlEditor
              ref={editorRef}
              value={contentHtml}
              onChange={setContentHtml}
              mediaOptions={mediaLibrary}
            />
            <Card style={{ marginTop: 16 }}>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                htmlType="submit"
                loading={saving}
                block
              >
                {mode === "edit" ? "Lưu thay đổi" : "Tạo bài viết"}
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>
    </Space>
  );
}
