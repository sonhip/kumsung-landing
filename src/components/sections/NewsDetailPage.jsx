import Link from "next/link";

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
            <Link href="/news" style={{ display: "inline-block", marginTop: 24 }}>
              {"<- Quay lại tin tức"}
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
