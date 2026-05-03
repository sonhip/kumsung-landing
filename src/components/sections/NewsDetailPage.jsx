import Link from "next/link";

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

const getFileTypeLabel = (fileName) => {
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
    zip: "ZIP",
    txt: "TXT",
    csv: "CSV",
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

const buildYouTubeTitle = (value, index) => {
  const raw = String(value || "").trim();
  if (raw.startsWith("<iframe")) {
    return `YouTube embed ${index + 1}`;
  }

  try {
    const url = new URL(raw);
    const videoId =
      url.searchParams.get("v") ||
      url.pathname.split("/").filter(Boolean).pop();
    return videoId ? `YouTube: ${videoId}` : `YouTube ${index + 1}`;
  } catch {
    return `YouTube ${index + 1}`;
  }
};

const formatDate = (value) => {
  if (!value) return "";

  try {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
};

export default function NewsDetailPage({ post }) {
  if (!post) {
    return (
      <section className="products-page" aria-label="Bài viết không tồn tại">
        <div className="container products-empty">
          <h1>Không tìm thấy bài viết</h1>
          <p>Bài viết có thể đã bị xoá hoặc chưa được xuất bản.</p>
          <Link href="/news">Quay lại trang tin tức</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="products-page" aria-label={post.title}>
      <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <article
          style={{
            maxWidth: 900,
            margin: "0 auto",
            borderRadius: 18,
            background: "#fff",
            boxShadow: "0 20px 44px rgba(14, 34, 61, 0.1)",
            overflow: "hidden",
            border: "1px solid rgba(22, 54, 95, 0.12)",
          }}
        >
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              style={{
                width: "100%",
                maxHeight: 420,
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : null}

          <div style={{ padding: "28px 28px 34px" }}>
            <p style={{ marginTop: 0, marginBottom: 10, color: "#5f7e9d" }}>
              {formatDate(post.publishedAt || post.createdAt)}
            </p>
            <h1 style={{ marginTop: 0, color: "#16365f", lineHeight: 1.25 }}>
              {post.title}
            </h1>
            {post.excerpt ? (
              <p style={{ color: "#345070", fontSize: 18, lineHeight: 1.6 }}>
                {post.excerpt}
              </p>
            ) : null}
            <div
              style={{ color: "#23384f", lineHeight: 1.75 }}
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />

            {post.attachmentUrls?.length ? (
              <section style={{ marginTop: 36 }}>
                <h2 style={{ color: "#16365f", marginBottom: 16 }}>
                  Tài liệu đính kèm
                </h2>
                <div style={{ display: "grid", gap: 12 }}>
                  {post.attachmentUrls.map((url, index) => {
                    const fileName = getFileNameFromUrl(url);
                    const fileType = getFileTypeLabel(fileName);

                    return (
                      <div
                        key={`${url}-${index}`}
                        style={{
                          border: "1px solid rgba(22, 54, 95, 0.14)",
                          borderRadius: 14,
                          padding: 16,
                          background: "#f9fbfd",
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                          gap: 12,
                          alignItems: "center",
                        }}
                      >
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontWeight: 700, color: "#16365f" }}>
                            📎 {fileName}
                          </div>
                          <div style={{ color: "#5f7e9d", fontSize: 14 }}>
                            Loại file: {fileType}
                          </div>
                          <div
                            style={{
                              color: "#8aa0b8",
                              fontSize: 12,
                              wordBreak: "break-all",
                              marginTop: 4,
                            }}
                          >
                            {url}
                          </div>
                        </div>
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: 42,
                            padding: "0 16px",
                            borderRadius: 10,
                            background: "#16365f",
                            color: "#fff",
                            textDecoration: "none",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          Mở file
                        </a>
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {post.youtubeEmbeds?.length ? (
              <section style={{ marginTop: 40 }}>
                <h2 style={{ color: "#16365f", marginBottom: 16 }}>
                  Video YouTube
                </h2>
                <div style={{ display: "grid", gap: 18 }}>
                  {post.youtubeEmbeds.map((item, index) => {
                    const src = resolveYouTubeSrc(item);
                    const title = buildYouTubeTitle(item, index);

                    return (
                      <div
                        key={`${index}-${title}`}
                        style={{
                          border: "1px solid rgba(22, 54, 95, 0.14)",
                          borderRadius: 14,
                          overflow: "hidden",
                          background: "#fff",
                        }}
                      >
                        <div
                          style={{
                            padding: 16,
                            borderBottom: "1px solid #eef2f6",
                          }}
                        >
                          <div style={{ fontWeight: 700, color: "#16365f" }}>
                            📺 {title}
                          </div>
                          <div
                            style={{
                              color: "#5f7e9d",
                              fontSize: 12,
                              wordBreak: "break-all",
                            }}
                          >
                            {item}
                          </div>
                        </div>
                        {src ? (
                          <div style={{ aspectRatio: "16 / 9" }}>
                            <iframe
                              src={src}
                              title={title}
                              width="100%"
                              height="100%"
                              style={{ border: 0, display: "block" }}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <div style={{ padding: 16, color: "#a33" }}>
                            Không thể hiển thị video này. Vui lòng mở liên kết ở
                            trên.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null}

            <Link
              href="/news"
              style={{ display: "inline-block", marginTop: 24 }}
            >
              {"<- Quay lại tin tức"}
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
