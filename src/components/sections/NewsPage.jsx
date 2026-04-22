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

export default function NewsPage({ posts = [], routes = {} }) {
  const title = routes?.news?.title || "Tin tức";
  const description = routes?.news?.description || "";

  return (
    <section className="products-page" aria-label="Tin tức">
      <div className="container products-page-header">
        <p className="products-page-overline">News</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="container" style={{ paddingBottom: 64 }}>
        {!posts.length ? (
          <div className="products-empty">
            <h2>Chưa có bài viết</h2>
            <p>Nội dung tin tức sẽ được cập nhật sớm.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {posts.map((post) => (
              <article
                key={post.id}
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid rgba(22, 54, 95, 0.12)",
                  background: "#fff",
                  boxShadow: "0 14px 32px rgba(14, 34, 61, 0.08)",
                }}
              >
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    style={{
                      width: "100%",
                      height: 220,
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : null}
                <div style={{ padding: 20 }}>
                  <p style={{ margin: 0, color: "#5f7e9d", fontSize: 14 }}>
                    {formatDate(post.publishedAt || post.createdAt)}
                  </p>
                  <h2 style={{ marginTop: 10, marginBottom: 10 }}>
                    <Link href={`/news/${post.slug}`} style={{ color: "#16365f" }}>
                      {post.title}
                    </Link>
                  </h2>
                  <p style={{ marginTop: 0, color: "#3f5974" }}>
                    {post.excerpt || "Xem chi tiết bài viết."}
                  </p>
                  <Link href={`/news/${post.slug}`} style={{ fontWeight: 700 }}>
                    Đọc tiếp
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
