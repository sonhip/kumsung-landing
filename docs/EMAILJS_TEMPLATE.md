# EmailJS Contact Template

Dùng cho form `/contact` trong website.

## 1) Service

- Service ID: `service_z31k7vs`

## 2) Template config (gợi ý)

- Subject: `{{email_subject}}`
- To Email: `{{to_email}}`
- From Name: `{{from_name}}`
- Reply To: `{{reply_to}}`
- Content: `{{email_body}}`

## 3) Nội dung email chuẩn (khuyên dùng)

Bạn có thể dùng trực tiếp nội dung dưới trong phần `Content`:

```text
Xin chào {{form_name}},

Chúng tôi đã tiếp nhận yêu cầu liên hệ của bạn.
Đội ngũ tư vấn sẽ phản hồi trong thời gian sớm nhất, vui lòng chờ thêm.

Thông tin bạn đã gửi:
- Họ và tên: {{form_name}}
- Email: {{form_email}}
- Chủ đề: {{form_subject}}
- Nội dung: {{form_message}}

Mã xác nhận: CONTACT-{{submitted_at}}
Thời gian tiếp nhận: {{submitted_at}}
- Website: {{website_url}}
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
