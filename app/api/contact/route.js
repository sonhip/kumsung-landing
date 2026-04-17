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
    return { error: "Name must be at least 2 characters long." };
  }

  if (!normalizedEmail || !EMAIL_PATTERN.test(normalizedEmail)) {
    return { error: "A valid email address is required." };
  }

  if (!normalizedMessage || normalizedMessage.length < 10) {
    return { error: "Message must be at least 10 characters long." };
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
        { error: "reCAPTCHA verification failed. Please try again." },
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
      message: "Your message has been received. We will contact you soon.",
    });
  } catch (error) {
    console.error("Failed to store contact submission", error);

    return Response.json(
      { error: "Unable to submit the form right now." },
      { status: 500 },
    );
  }
}
