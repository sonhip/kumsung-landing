# Static Assets

Thư mục `public/static` hiện chỉ giữ lại icon và phần tương thích ngược.

## Cấu trúc hiện tại

- `icons/`: icon tĩnh
- `images/`: đã ngừng sử dụng trực tiếp

## Quy ước mới

- Ảnh mặc định/seed: `/uploads/seed/...`
- Ảnh admin upload: `/uploads/media/...`, `/uploads/products/...`, `/uploads/editor/...`

## Tương thích ngược

Middleware đang rewrite mọi request `/static/images/...` sang `/uploads/seed/...` để không làm vỡ dữ liệu cũ trong database.
