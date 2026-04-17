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
- Form liên hệ ở `/contact` sẽ lưu xuống PostgreSQL
