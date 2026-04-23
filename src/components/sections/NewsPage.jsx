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

const buildPageHref = (page, keyword) => {
  const params = new URLSearchParams();

  if (keyword) {
    params.set("q", keyword);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `/news?${query}` : "/news";
};

export default function NewsPage({
  posts = [],
  routes = {},
  keyword = "",
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
}) {
  const title = routes?.news?.title || "Tin tức";
  const description = routes?.news?.description || "";
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <section className="products-page" aria-label="Tin tức">
      <div className="container products-page-header">
        <p className="products-page-overline">News</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="container" style={{ paddingBottom: 64 }}>
        <form
          action="/news"
          method="GET"
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 24,
            alignItems: "center",
          }}
        >
          <input
            type="text"
            name="q"
            defaultValue={keyword}
            placeholder="Tìm kiếm bài viết..."
            style={{
              minWidth: 260,
              flex: "1 1 260px",
              border: "1px solid rgba(22, 54, 95, 0.2)",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 16,
            }}
          />
          <button
            type="submit"
            style={{
              border: "none",
              borderRadius: 10,
              padding: "10px 18px",
              background: "#1f4f88",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Tìm kiếm
          </button>
          {keyword ? (
            <Link href="/news" style={{ fontWeight: 600 }}>
              Xoá lọc
            </Link>
          ) : null}
        </form>

        {totalItems ? (
          <p style={{ color: "#5f7e9d", marginTop: 0 }}>
            Tìm thấy {totalItems} bài viết
            {keyword ? ` cho từ khoá "${keyword}"` : ""}.
          </p>
        ) : null}

        {!posts.length ? (
          <div className="products-empty">
            <h2>Chưa có bài viết</h2>
            <p>
              {keyword
                ? "Không có bài viết phù hợp với từ khoá bạn tìm."
                : "Nội dung tin tức sẽ được cập nhật sớm."}
            </p>
          </div>
        ) : (
          <>
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

            {totalPages > 1 ? (
              <nav
                aria-label="Phân trang tin tức"
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginTop: 28,
                }}
              >
                <Link
                  href={buildPageHref(Math.max(1, currentPage - 1), keyword)}
                  aria-disabled={currentPage <= 1}
                  style={{
                    pointerEvents: currentPage <= 1 ? "none" : "auto",
                    opacity: currentPage <= 1 ? 0.5 : 1,
                  }}
                >
                  Trước
                </Link>

                {pageNumbers.map((pageNumber) => (
                  <Link
                    key={pageNumber}
                    href={buildPageHref(pageNumber, keyword)}
                    style={{
                      minWidth: 34,
                      textAlign: "center",
                      fontWeight: pageNumber === currentPage ? 800 : 500,
                      color: pageNumber === currentPage ? "#1f4f88" : "#16365f",
                    }}
                  >
                    {pageNumber}
                  </Link>
                ))}

                <Link
                  href={buildPageHref(Math.min(totalPages, currentPage + 1), keyword)}
                  aria-disabled={currentPage >= totalPages}
                  style={{
                    pointerEvents: currentPage >= totalPages ? "none" : "auto",
                    opacity: currentPage >= totalPages ? 0.5 : 1,
                  }}
                >
                  Sau
                </Link>
              </nav>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
