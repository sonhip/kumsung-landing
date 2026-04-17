import { prisma } from "../../../src/lib/prisma";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    return { verified: false, required: false };
  }

  if (!token) {
    return { verified: false, required: true };
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
    return { verified: false, required: true };
  }

  const result = await response.json();

  return {
    verified: Boolean(result.success),
    required: true,
  };
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
        { error: "Xác thực reCAPTCHA không thành công. Vui lòng thử lại." },
        { status: 400 },
      );
    }

    const metadata = getClientMeta(request);

    await prisma.contactSubmission.create({
      data: {
        ...validation.data,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
        recaptchaVerified: recaptcha.verified,
      },
    });

    return Response.json({
      message: "Tân Việt đã nhận được thông tin. Chúng tôi sẽ liên hệ lại sớm.",
    });
  } catch (error) {
    console.error("Failed to store contact submission", error);

    return Response.json(
      { error: "Không thể gửi biểu mẫu vào lúc này. Vui lòng thử lại sau." },
      { status: 500 },
    );
  }
}
