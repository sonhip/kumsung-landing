# Static Assets

Thư mục này dùng để lưu toàn bộ file tĩnh cho app (ảnh, icon, media) để dễ cập nhật về sau.

## Cấu trúc

- `images/`: ảnh banner, hero, sản phẩm...
- `icons/`: icon custom dạng svg/png/webp...

## Cách sử dụng trong React (Vite)

Vì đây là thư mục trong `public`, bạn truy cập trực tiếp qua path bắt đầu bằng `/static/...`.

Ví dụ:

- Hero image: `/static/images/hero.jpg`
- Logo: `/static/images/logo.png`
- Icon: `/static/icons/company.svg`

## Lưu ý

- Có thể thay file ảnh cùng tên để cập nhật giao diện mà không cần đổi code.
- Nên dùng định dạng tối ưu (`webp`, `svg`) để tăng tốc tải trang.
