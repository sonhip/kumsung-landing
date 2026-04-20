# EmailJS Contact Template

Dùng cho form `/contact` trong website.

## 1) Service

- Service ID: `service_z31k7vs`

## 2) Template config (gợi ý)

- Subject: `{{email_subject}}`
- To Email: `{{to_email}}`
- From Name: `{{form_name}}`
- Reply To: `{{reply_to}}`
- Content: `{{email_body}}`

## 3) Nội dung email chuẩn (khuyên dùng)

Bạn có thể dùng trực tiếp nội dung dưới trong phần `Content` nếu muốn format đầy đủ, rõ ràng:

```text
Bạn vừa nhận được liên hệ mới từ website {{company_name}}.

THÔNG TIN KHÁCH HÀNG
- Họ và tên: {{form_name}}
- Email: {{form_email}}
- Chủ đề: {{form_subject}}
- Nội dung:
{{form_message}}

THÔNG TIN HỆ THỐNG
- Thời gian gửi: {{submitted_at}}
- Website: {{website_url}}
- IP: {{user_ip}}
- User Agent: {{user_agent}}
```

## 4) Variables hiện có từ API

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
