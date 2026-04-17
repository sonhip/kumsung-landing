import { prisma } from "../../../../src/lib/prisma";

const validateSiteSettingsPayload = (payload) => {
  if (!payload.company?.name?.trim()) {
    return { error: "Vui lòng nhập tên công ty." };
  }

  if (!payload.company?.shortName?.trim()) {
    return { error: "Vui lòng nhập tên thương hiệu ngắn." };
  }

  if (!payload.contact?.email?.trim()) {
    return { error: "Vui lòng nhập email liên hệ." };
  }

  return {
    data: {
      companyName: payload.company.name.trim(),
      companyShortName: payload.company.shortName.trim(),
      companyHomeAriaLabel:
        payload.company.homeAriaLabel?.trim() || `Trang chủ ${payload.company.shortName.trim()}`,
      companyTagline: payload.company.tagline?.trim() || "",
      companyDistributorLabel: payload.company.distributorLabel?.trim() || "",
      companyDistributorValue: payload.company.distributorValue?.trim() || "",
      companyQuoteButton: payload.company.quoteButton?.trim() || "Liên hệ tư vấn",
      contactPhone: payload.contact.phone?.trim() || "",
      contactHours: payload.contact.hours?.trim() || "",
      contactAddressFull: payload.contact.addressFull?.trim() || "",
      contactAddressShort: payload.contact.addressShort?.trim() || "",
      contactEmail: payload.contact.email.trim(),
      contactEmailAriaLabel:
        payload.contact.emailAriaLabel?.trim() ||
        `Gửi email đến ${payload.company.shortName.trim()}`,
      contactFacebookUrl: payload.contact.facebookUrl?.trim() || "",
      contactFacebookAriaLabel:
        payload.contact.facebookAriaLabel?.trim() || "Truy cập Facebook",
    },
  };
};

const mapSiteSettingsRecord = (settings) => ({
  company: {
    name: settings.companyName,
    shortName: settings.companyShortName,
    homeAriaLabel: settings.companyHomeAriaLabel,
    tagline: settings.companyTagline,
    distributorLabel: settings.companyDistributorLabel,
    distributorValue: settings.companyDistributorValue,
    quoteButton: settings.companyQuoteButton,
  },
  contact: {
    phone: settings.contactPhone,
    hours: settings.contactHours,
    addressFull: settings.contactAddressFull,
    addressShort: settings.contactAddressShort,
    email: settings.contactEmail,
    emailAriaLabel: settings.contactEmailAriaLabel,
    facebookUrl: settings.contactFacebookUrl,
    facebookAriaLabel: settings.contactFacebookAriaLabel,
  },
});

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({
    where: {
      id: "default",
    },
  });

  return Response.json(settings ? mapSiteSettingsRecord(settings) : null);
}

export async function PUT(request) {
  try {
    const payload = await request.json();
    const validation = validateSiteSettingsPayload(payload);

    if (validation.error) {
      return Response.json({ error: validation.error }, { status: 400 });
    }

    const settings = await prisma.siteSettings.upsert({
      where: {
        id: "default",
      },
      update: validation.data,
      create: {
        id: "default",
        ...validation.data,
      },
    });

    return Response.json(mapSiteSettingsRecord(settings));
  } catch (error) {
    console.error("Failed to update site settings", error);
    return Response.json(
      { error: "Không thể cập nhật thông tin công ty." },
      { status: 500 },
    );
  }
}
