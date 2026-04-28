tan-viet-web

Ứng dụng frontend + backend (Next.js App Router) kết hợp với PostgreSQL qua Prisma. Tài liệu này chia thành hai phần chính để phục vụ hai nhóm người dùng:

- Phần A — Hướng dẫn cho **Admin**: cách vận hành, upload media, quản lý nội dung và xử lý sự cố vận hành hàng ngày.
- Phần B — Hướng dẫn cho **Developer**: cách thiết lập môi trường, chạy local, chạy migration/seed, build và deploy bằng Docker.

**A. Hướng dẫn cho Admin (vận hành web)**

1. Truy cập & xác thực

- Panel quản trị: truy cập trên đường dẫn `/admin` (đăng nhập ở `/admin/login`).
- Nếu cần thay đổi tài khoản admin, xem module `app/admin` và `src/components/admin` để biết chỗ tạo/sửa user (yêu cầu quyền DB/seed nếu không thấy tài khoản).

2. Các tác vụ quản trị phổ biến

- Quản lý nội dung: chỉnh nội dung trang About, Contact, Hero, News, Products, Team Members, Navbar Settings, Site Settings từ giao diện Admin.
- Media: upload ảnh/asset qua module Media; sau khi upload, ảnh sẽ xuất hiện trong `public/uploads/media/...` và được phục vụ bởi Next.js qua URL `/uploads/...`.

3. Uploads & lưu trữ file

- Trong cấu hình Docker (compose), thư mục `./public/uploads` trên host được mount vào container tại `/app/public/uploads`.
- Vì vậy, khi deploy bằng Docker, file upload sẽ tồn trên host và không mất khi recreate container (nếu bạn không xóa thư mục host).
- Ví dụ host path (tuỳ VPS): `/root/tan-viet-web/app/public/uploads`.

Kiểm tra nhanh mount & file:

```bash
# Kiểm tra mount của container app
docker inspect tan-viet-web | grep -A 20 Mounts

# Kiểm tra URL ảnh
curl -I https://<your-site>/uploads/media/<file-name>.jpg

# Kiểm tra file tồn trên host
ls -lah /root/tan-viet-web/app/public/uploads/media | tail -n 5
```

4. Backup & phục hồi

- Media: backup định kỳ thư mục host `./public/uploads` (ví dụ rsync hoặc snapshot).
- Database: backup Postgres bằng công cụ dạng `pg_dump` hoặc snapshot volume/container.

5. Vận hành hàng ngày & checklist nhanh

- Đăng nhập admin và kiểm tra mục News / Products / Site Settings sau khi nhận yêu cầu cập nhật.
- Kiểm tra upload mới, đảm bảo ảnh hiển thị trên site public.
- Sau thay đổi cấu hình (ví dụ thay EMAILJS keys), khởi động lại container app.

6. Xử lý sự cố phổ biến

- Lỗi kết nối DB (Prisma `P1000`): kiểm tra `DATABASE_URL` trong `.env` hoặc biến môi trường container; kiểm tra container/postgres có đang chạy.
- Ảnh không hiển thị: kiểm tra Docker mount, quyền file trên host, và URL trả về 200.
- Email không gửi: kiểm tra `EMAILJS_*` trong biến môi trường, thử gửi test từ API `POST /api/contact`.
- reCAPTCHA lỗi: kiểm tra `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` và `RECAPTCHA_SECRET_KEY` đã đúng môi trường production chưa.

7. Lệnh tiện ích cho Admin trên VPS

```bash
# Xem logs app
docker compose -f docker-compose.app.yml logs -f

# Restart app
docker compose -f docker-compose.app.yml restart

# Cập nhật image và redeploy
docker compose -f docker-compose.app.yml pull
docker compose -f docker-compose.app.yml up -d
```

8. Bảo mật & quyền truy cập

- Giữ bí mật `EMAILJS_PRIVATE_KEY`, `RECAPTCHA_SECRET_KEY`, và `DATABASE_URL`.
- Hạn chế quyền truy cập tới thư mục chứa host `public/uploads` và tệp `.env` trên VPS.

---

**B. Hướng dẫn cho Developer (setup, chạy, deploy)**

1. Yêu cầu trước khi bắt đầu (Prerequisites)

- Node.js (khuyến nghị 18+). Kiểm tra với `node -v`.
- npm (hoặc pnpm/yarn nếu bạn thích)
- Docker & Docker Compose (cho chạy Postgres local hoặc deploy)
- PostgreSQL (local hoặc container)

2. Cấu hình biến môi trường mẫu
   Tạo file `.env` hoặc `.env.local` (cho local) với các biến tối thiểu sau:

```bash
DATABASE_URL=postgresql://admin:123456@localhost:5432/mydb?schema=public
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_google_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_google_recaptcha_secret_key
EMAILJS_SERVICE_ID=service_xxxxxxx
EMAILJS_TEMPLATE_ID=template_xxxxxxx
EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
EMAILJS_PRIVATE_KEY=
```

3. Chạy nhanh Postgres bằng Docker (nếu muốn local DB container)

```bash
docker run --name tanviet-postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=123456 -e POSTGRES_DB=mydb -p 5432:5432 -v $(pwd)/tmp-postgres-data:/var/lib/postgresql/data -d postgres:15
```

4. Cài đặt & chạy ứng dụng local

```bash
npm install
# Tạo Prisma Client
npm run db:generate
# Áp schema lên DB (cho dev nhanh):
npm run db:push
# Hoặc dùng migrations nếu bạn muốn lưu lịch sử:
# npx prisma migrate dev --name init

# (tùy dự án) seed dữ liệu
npm run db:seed

# Chạy dev server
npm run dev
```

Ghi chú: lệnh `npm run dev` dùng Next dev server. Để chạy production locally, sử dụng `npm run build` rồi `npm run start` (nếu package.json có định nghĩa). Nếu không chắc, chạy `npx next build` và `npx next start`.

5. Prisma — workflow khuyến nghị

- Local development: `npx prisma migrate dev` (tạo migration và cập nhật DB).
- CI / Production: commit migration files và chạy `npx prisma migrate deploy` trên môi trường production.
- Khi cần tạo client mới: `npm run db:generate`.

6. API & Email

- Endpoint liên hệ: `POST /api/contact` (xử lý lưu `ContactSubmission` và gửi email qua EmailJS).
- EmailJS: cấu hình `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`, và (tùy) `EMAILJS_PRIVATE_KEY` cho server.
- Template nhận các biến: `to_email`, `email_subject`, `email_body`, `form_name`, `from_name`, `form_email`, `reply_to`, `form_subject`, `form_message`, `submitted_at`, `user_ip`, `user_agent`, `website_url`, `company_name`.

7. Build & Docker (production)

- Build image và push (local):

```bash
docker buildx build --platform linux/amd64 \
  -t <dockerhub-username>/tan-viet-web:latest \
  --push .
```

- Trên VPS: chuẩn bị `.env` production (chứa `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`, EmailJS keys, reCAPTCHA), sau đó:

```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

- Nếu bạn đã có container Postgres riêng (ví dụ `tanviet-postgres`) và muốn kết nối app vào network đó:

```bash
docker network create tanviet-net || true
docker network connect tanviet-net tanviet-postgres || true
```

- Ví dụ `.env` trên VPS khi dùng DB container:

```bash
APP_IMAGE=<dockerhub-username>/tan-viet-web:latest
DATABASE_URL=postgresql://<db_user>:<db_password>@tanviet-postgres:5432/mydb?schema=public
```

- Pull & chạy bằng `docker-compose.app.yml`:

```bash
docker compose -f docker-compose.app.yml --env-file .env pull
docker compose -f docker-compose.app.yml --env-file .env up -d
```

8. Áp schema / seed trên container

```bash
docker exec -it tan-viet-web npx prisma db push
# Nếu cần seed
docker exec -it tan-viet-web npm run db:seed
```

9. Kiểm tra logs & trạng thái container

```bash
docker compose -f docker-compose.app.yml logs -f
docker compose -f docker-compose.app.yml ps
```

10. Những file/đường dẫn quan trọng trong repo

- `prisma/schema.prisma`: định nghĩa schema DB
- `prisma/seed.mjs` và `prisma/seedData.js`: seed dữ liệu
- `app/`: Next.js App Router pages & API routes (ví dụ `app/api/contact/route.js`)
- `src/components/admin`: các component UI cho Admin
- `public/uploads`: nơi lưu file upload (được mount khi chạy Docker)

11. Tips & best practices

- Giữ `.env` ngoài git; dùng Secret Manager hoặc environment variables trực tiếp trên VPS/container.
- Trong production, dùng `npx prisma migrate deploy` thay vì `db push` để có lịch sử migration an toàn.
- Kiểm tra quyền file trên host để tránh lỗi 403/404 với ảnh upload.

---

Liên hệ & bước tiếp theo

- Muốn tôi: commit thay đổi này, tạo checklist deploy chi tiết (playbook), hoặc chuyển README sang tiếng Anh, chọn một trong các tuỳ chọn và mình sẽ làm tiếp.

**A. Hướng dẫn cho Admin (vận hành web)**

- **Truy cập admin**: panel quản trị chạy tại `/admin` (login: `/admin/login`).
- **Các khu vực chính**: quản lý media, news, products, product-categories, team-members, users, site settings, navbar settings, trang nội dung (About, Contact, Hero, …).
- **Upload ảnh / media**:
  - Ảnh upload lưu tại `public/uploads` trong container.
  - Khi deploy bằng Docker, `docker-compose.app.yml` mount `./public/uploads:/app/public/uploads` nên file sẽ tồn trên host (không mất khi recreate container).
  - Trên VPS host path ví dụ: `/root/tan-viet-web/app/public/uploads` (tùy nơi bạn triển khai).
  - Kiểm tra nhanh URL ảnh: `curl -I https://<your-site>/uploads/media/<file-name>`
- **Sao lưu file upload**: backup thư mục host mount (`./public/uploads`) định kỳ trước khi làm thao tác xóa/cleanup.
- **Quản lý nội dung**: dùng các form trong Admin UI để chỉnh Hero, About, Contact page content, News, Products, v.v. Thay đổi lưu trực tiếp vào database qua API nội bộ.
- **Xử lý lỗi phổ biến**:
  - Lỗi kết nối DB (Prisma `P1000`): kiểm tra `DATABASE_URL` trong file `.env` hoặc biến môi trường container.
  - Không thấy ảnh sau deploy: kiểm tra Docker mount và quyền trên thư mục host.
- **Quy trình cơ bản vận hành**:
  1. Đăng nhập admin: `/admin/login`.
  2. Dùng module `Media` để upload hình mới.
  3. Chỉnh nội dung (News / Products / Navbar / Site Settings) và lưu.
  4. Kiểm tra site public để xác nhận thay đổi.

---

**B. Hướng dẫn cho Developer (setup, chạy, deploy)**

1. Tiên quyết (Prerequisites)

- Node.js (phù hợp với dự án; dùng Node 18+ là an toàn)
- npm
- PostgreSQL (local) hoặc Docker để chạy Postgres
- Docker & Docker Compose (cho deploy)

2. Biến môi trường (ví dụ `.env.local` / `.env`)

```bash
DATABASE_URL=postgresql://admin:123456@localhost:5432/mydb?schema=public
NEXT_PUBLIC_SITE_URL=https://tanvietref.com.vn
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_google_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_google_recaptcha_secret_key
EMAILJS_SERVICE_ID=service_xxxxxxx
EMAILJS_TEMPLATE_ID=template_xxxxxxx
EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
EMAILJS_PRIVATE_KEY=
```

3. Cài đặt & chạy local

```bash
npm install
# Tạo Prisma client
npm run db:generate
# Áp schema lên DB (push hoặc migrate tuỳ workflow)
npm run db:push
# (tùy dự án) seed dữ liệu
npm run db:seed
# Chạy dev
npm run dev
```

4. Prisma & Database

- Schema: `prisma/schema.prisma`
- Thao tác thường dùng:
  - `npm run db:generate`: tạo Prisma Client
  - `npm run db:push`: đưa schema lên DB (không tạo migration lịch sử)
  - (Nếu cần) `npx prisma migrate dev` hoặc `npx prisma migrate deploy` tuỳ chiến lược migration
  - `npm run db:seed`: chạy script seed

5. API / Email

- Endpoint contact: `POST /api/contact` — lưu `ContactSubmission` và gửi email qua EmailJS.
- EmailJS config (server + client): `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`, `EMAILJS_PRIVATE_KEY`.
- Template EmailJS nhận các biến: `to_email`, `email_subject`, `email_body`, `form_name`, `from_name`, `form_email`, `reply_to`, `form_subject`, `form_message`, `submitted_at`, `user_ip`, `user_agent`, `website_url`, `company_name`.

6. Deploy bằng Docker (khuyến nghị: build local → pull trên VPS)

- Build & push image (local):

```bash
docker buildx build --platform linux/amd64 \
  -t <dockerhub-username>/tan-viet-web:latest \
  --push .
```

- Trên VPS, chuẩn bị `.env` production (đảm bảo `DATABASE_URL` trỏ đúng DB) rồi:

```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

- Nếu sử dụng DB container tách rời (ví dụ `tanviet-postgres`):

```bash
docker network create tanviet-net || true
docker network connect tanviet-net tanviet-postgres || true
```

- Ví dụ `.env` trên VPS khi dùng DB container:

```bash
APP_IMAGE=<dockerhub-username>/tan-viet-web:latest
DATABASE_URL=postgresql://<db_user>:<db_password>@tanviet-postgres:5432/mydb?schema=public
```

- Pull & chạy app container (compose file `docker-compose.app.yml`):

```bash
docker compose -f docker-compose.app.yml --env-file .env pull
docker compose -f docker-compose.app.yml --env-file .env up -d
```

7. Sau deploy — thao tác thường gặp

- Áp Prisma schema trên container (nếu thay đổi):

```bash
docker exec -it tan-viet-web npx prisma db push
```

- Seed dữ liệu (nếu cần):

```bash
docker exec -it tan-viet-web npm run db:seed
```

8. Upload persistence & kiểm tra

- `docker-compose.app.yml` mount `./public/uploads` → đảm bảo host có thư mục và quyền ghi.
- Kiểm tra mount: `docker inspect tan-viet-web | grep -A 20 Mounts`
- Kiểm tra URL ảnh: `curl -I https://<your-site>/uploads/media/<file-name>.jpg`

9. Vị trí quan trọng trong repo (tham khảo nhanh)

- Prisma schema: `prisma/schema.prisma`
- Seed scripts: `prisma/seed.mjs`, `prisma/seedData.js`
- Admin UI & components: `src/components/admin/*` và trang admin trong `app/admin`
- API routes: `app/api/*` (ví dụ `app/api/contact/route.js`, `app/api/admin/*`)

---

Liên hệ / Ghi chú nhanh

- Muốn mình bổ sung: hướng dẫn backup DB, thêm checklist deploy, hoặc tách README thành tiếng Anh + tiếng Việt, mình sẽ cập nhật.

---
