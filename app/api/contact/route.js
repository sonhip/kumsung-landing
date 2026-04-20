import { prisma } from "../../../src/lib/prisma";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAILJS_API_URL = "https://api.emailjs.com/api/v1.0/email/send";

const getClientMeta = (request) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ipAddress = forwardedFor?.split(",")[0]?.trim() || null;
  const userAgent = request.headers.get("user-agent") || null;

  return {
    ipAddress,
    userAgent,
  };
};

const validatePayload = ({ name, email, subject, message }) => {
  const normalizedName = name?.trim();
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedSubject = subject?.trim() || null;
  const normalizedMessage = message?.trim();

  if (!normalizedName || normalizedName.length < 2) {
    return { error: "Họ và tên cần có ít nhất 2 ký tự." };
  }

  if (!normalizedEmail || !EMAIL_PATTERN.test(normalizedEmail)) {
    return { error: "Vui lòng nhập địa chỉ email hợp lệ." };
  }

  if (!normalizedMessage || normalizedMessage.length < 10) {
    return { error: "Nội dung cần có ít nhất 10 ký tự." };
  }

  return {
    data: {
      name: normalizedName,
      email: normalizedEmail,
      subject: normalizedSubject,
      message: normalizedMessage,
    },
  };
};

const verifyRecaptcha = async (token) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    return {
      verified: false,
      required: true,
      error:
        "Hệ thống chưa cấu hình RECAPTCHA_SECRET_KEY. Vui lòng liên hệ quản trị viên.",
    };
  }

  if (!token) {
    return {
      verified: false,
      required: true,
      error: "Vui lòng xác nhận reCAPTCHA trước khi gửi.",
    };
  }

  const payload = new URLSearchParams({
    secret: secretKey,
    response: token,
  });

  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return {
      verified: false,
      required: true,
      error: "Không thể xác thực reCAPTCHA. Vui lòng thử lại.",
    };
  }

  const result = await response.json();

  return {
    verified: Boolean(result.success),
    required: true,
    error: result.success
      ? ""
      : "Xác thực reCAPTCHA không thành công. Vui lòng thử lại.",
  };
};

const getEmailJsConfig = () => ({
  serviceId: process.env.EMAILJS_SERVICE_ID?.trim() || "",
  templateId: process.env.EMAILJS_TEMPLATE_ID?.trim() || "",
  publicKey: process.env.EMAILJS_PUBLIC_KEY?.trim() || "",
  privateKey: process.env.EMAILJS_PRIVATE_KEY?.trim() || "",
});

const isEmailJsConfigured = (config) =>
  Boolean(config.serviceId && config.templateId && config.publicKey);

const formatSubmissionTime = (date = new Date()) =>
  new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);

const buildTemplateParams = ({
  submission,
  metadata,
  recipientEmail,
  companyName,
  request,
}) => {
  const resolvedSubject =
    submission.subject || "Khách hàng gửi liên hệ từ website";
  const websiteUrl = request.headers.get("origin") || "Không xác định";
  const submittedAt = formatSubmissionTime();

  const emailBody = [
    "Bạn vừa nhận được một liên hệ mới từ form Contact.",
    "",
    `- Họ và tên: ${submission.name}`,
    `- Email: ${submission.email}`,
    `- Chủ đề: ${resolvedSubject}`,
    "- Nội dung:",
    submission.message,
    "",
    "--- Thông tin hệ thống ---",
    `- Thời gian gửi: ${submittedAt}`,
    `- Website: ${websiteUrl}`,
    `- IP: ${metadata.ipAddress || "Không xác định"}`,
    `- User Agent: ${metadata.userAgent || "Không xác định"}`,
  ].join("\n");

  return {
    to_email: recipientEmail,
    email_subject: `[${companyName}] ${resolvedSubject}`,
    email_body: emailBody,
    form_name: submission.name,
    from_name: submission.name,
    form_email: submission.email,
    reply_to: submission.email,
    form_subject: resolvedSubject,
    form_message: submission.message,
    submitted_at: submittedAt,
    user_ip: metadata.ipAddress || "Không xác định",
    user_agent: metadata.userAgent || "Không xác định",
    website_url: websiteUrl,
    company_name: companyName,
  };
};

const sendEmailWithEmailJs = async ({ config, templateParams }) => {
  const payload = {
    service_id: config.serviceId,
    template_id: config.templateId,
    user_id: config.publicKey,
    template_params: templateParams,
  };

  if (config.privateKey) {
    payload.accessToken = config.privateKey;
  }

  const response = await fetch(EMAILJS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "EmailJS request failed.");
  }
};

export async function POST(request) {
  try {
    const body = await request.json();
    const validation = validatePayload(body);

    if (validation.error) {
      return Response.json({ error: validation.error }, { status: 400 });
    }

    const recaptcha = await verifyRecaptcha(body.recaptchaToken);

    if (recaptcha.required && !recaptcha.verified) {
      return Response.json(
        { error: recaptcha.error || "Xác thực reCAPTCHA không thành công." },
        { status: 400 },
      );
    }

    const metadata = getClientMeta(request);
    const emailConfig = getEmailJsConfig();

    const [submission, siteSettings] = await Promise.all([
      prisma.contactSubmission.create({
        data: {
          ...validation.data,
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent,
          recaptchaVerified: recaptcha.verified,
        },
      }),
      prisma.siteSettings.findUnique({
        where: { id: "default" },
        select: {
          contactEmail: true,
          companyShortName: true,
          companyName: true,
        },
      }),
    ]);

    if (!isEmailJsConfigured(emailConfig)) {
      console.error("EmailJS is not configured.");
      return Response.json(
        {
          error:
            "Chưa cấu hình EmailJS đầy đủ. Cần EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID và EMAILJS_PUBLIC_KEY.",
        },
        { status: 500 },
      );
    }

    const recipientEmail =
      process.env.CONTACT_RECEIVER_EMAIL?.trim() ||
      siteSettings?.contactEmail?.trim() ||
      "";

    if (!recipientEmail) {
      console.error("Missing recipient email for contact notifications.");
      return Response.json(
        {
          error:
            "Chưa có email nhận liên hệ. Vui lòng cập nhật email liên hệ trong admin hoặc CONTACT_RECEIVER_EMAIL.",
        },
        { status: 500 },
      );
    }

    const companyName =
      siteSettings?.companyShortName ||
      siteSettings?.companyName ||
      "Tân Việt";

    const templateParams = buildTemplateParams({
      submission,
      metadata,
      recipientEmail,
      companyName,
      request,
    });

    await sendEmailWithEmailJs({
      config: emailConfig,
      templateParams,
    });

    return Response.json({
      message: "Tân Việt đã nhận được thông tin. Chúng tôi sẽ liên hệ lại sớm.",
    });
  } catch (error) {
    console.error("Failed to handle contact submission", error);

    return Response.json(
      { error: "Không thể gửi biểu mẫu vào lúc này. Vui lòng thử lại sau." },
      { status: 500 },
    );
  }
}
