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
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_google_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_google_recaptcha_secret_key
EMAILJS_SERVICE_ID=service_xxxxxxx
EMAILJS_TEMPLATE_ID=template_xxxxxxx
EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
EMAILJS_PRIVATE_KEY=
CONTACT_RECEIVER_EMAIL=
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
- `CONTACT_RECEIVER_EMAIL` (không bắt buộc): email nhận cố định. Nếu bỏ trống, hệ thống dùng email liên hệ trong site settings.

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
