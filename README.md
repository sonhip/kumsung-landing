# Next.js + Prisma

Ứng dụng này đã được chuyển sang `Next.js` App Router để chạy frontend + backend trong cùng một repo, dùng `PostgreSQL` qua `Prisma`.

## Stack

- Next.js 15
- React 18
- PostgreSQL
- Prisma ORM
- Ant Design + Framer Motion

## Cấu hình môi trường

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

## Chạy dự án

```bash
npm install
npm run db:generate
npm run db:push
npm run dev
```

## Backend đã tích hợp

- `POST /api/contact`
- Prisma model `ContactSubmission`
- Form liên hệ ở `/contact` sẽ lưu xuống PostgreSQL và gửi email qua EmailJS

## Cấu hình EmailJS

- `EMAILJS_SERVICE_ID`: Service ID (ví dụ `service_z31k7vs`)
- `EMAILJS_TEMPLATE_ID`: Template ID của EmailJS
- `EMAILJS_PUBLIC_KEY`: Public key của EmailJS
- `EMAILJS_PRIVATE_KEY` (không bắt buộc): private access token cho server-side
- Luồng hiện tại: gửi email **xác nhận đã tiếp nhận yêu cầu** cho chính khách hàng (`to_email = form_email`).

Template variables được route `/api/contact` gửi lên:

- `to_email`
- `email_subject`
- `email_body`
- `form_name`
- `from_name`
- `form_email`
- `reply_to`
- `form_subject`
- `form_message`
- `submitted_at`
- `user_ip`
- `user_agent`
- `website_url`
- `company_name`

## Deploy bằng Docker (không build trên VPS)

### 1. Build và push image từ local

```bash
docker build -t ghcr.io/<github-username>/kumsung-landing:latest .
echo <GITHUB_TOKEN> | docker login ghcr.io -u <github-username> --password-stdin
docker push ghcr.io/<github-username>/kumsung-landing:latest
```

### 2. Trên VPS: pull image và chạy bằng compose

Chuẩn bị `.env` trên VPS với các biến production (đặc biệt `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`, EmailJS, reCAPTCHA).

```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

### Trường hợp đã có sẵn container DB trên VPS

Nếu bạn đã có Postgres container riêng (ví dụ `tanviet-postgres`) và chỉ muốn chạy app container:

```bash
docker network create tanviet-net || true
docker network connect tanviet-net tanviet-postgres || true
```

`.env` trên VPS cần để:

```bash
APP_IMAGE=ghcr.io/<github-username>/kumsung-landing:latest
DATABASE_URL=postgresql://admin:123456@tanviet-postgres:5432/mydb?schema=public
```

Chạy app:

```bash
docker compose -f docker-compose.app.yml --env-file .env pull
docker compose -f docker-compose.app.yml --env-file .env up -d
```

### 3. Apply Prisma schema trên VPS (sau mỗi lần đổi schema)

```bash
docker exec -it tan-viet-web npx prisma db push
```

Nếu cần seed dữ liệu:

```bash
docker exec -it tan-viet-web npm run db:seed
```
