import { prisma } from "../../../../src/lib/prisma";
import { Prisma } from "@prisma/client";

const siteSettingsModel = Prisma.dmmf.datamodel.models.find(
  (model) => model.name === "SiteSettings",
);
const siteSettingsFieldNames = new Set(
  (siteSettingsModel?.fields || []).map((field) => field.name),
);

const getUnsupportedSiteSettingsFields = (data) =>
  Object.keys(data).filter((key) => !siteSettingsFieldNames.has(key));

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

  const rawStartYear = payload.footer?.copyrightStartYear;
  const parsedStartYear =
    rawStartYear === undefined || rawStartYear === null || rawStartYear === ""
      ? null
      : Number(rawStartYear);

  if (
    parsedStartYear !== null &&
    (!Number.isInteger(parsedStartYear) || parsedStartYear < 1900)
  ) {
    return { error: "Năm bắt đầu bản quyền không hợp lệ." };
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
      companyLogoUrl: payload.branding?.logoUrl?.trim() || null,
      companyLogoAltText:
        payload.branding?.logoAltText?.trim() ||
        payload.company.shortName.trim() ||
        null,
      faviconUrl: payload.branding?.faviconUrl?.trim() || null,
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
      contactZaloUrl: payload.contact?.zaloUrl?.trim() || null,
      contactMessengerUrl: payload.contact?.messengerUrl?.trim() || null,
      footerContactInfoTitle:
        payload.footer?.contactInfoTitle?.trim() || null,
      footerRightsText: payload.footer?.rightsText?.trim() || null,
      footerCopyrightStartYear: parsedStartYear,
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
    zaloUrl: settings.contactZaloUrl || "",
    messengerUrl: settings.contactMessengerUrl || "",
  },
  branding: {
    logoUrl: settings.companyLogoUrl,
    logoAltText: settings.companyLogoAltText,
    faviconUrl: settings.faviconUrl,
  },
  footer: {
    contactInfoTitle: settings.footerContactInfoTitle || "",
    rightsText: settings.footerRightsText || "",
    copyrightStartYear: settings.footerCopyrightStartYear || null,
  },
});

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({
    where: {
      id: "default",
    },
  });

  if (!settings) {
    return Response.json(
      { error: "Thiếu dữ liệu SiteSettings trong database." },
      { status: 404 },
    );
  }

  return Response.json(mapSiteSettingsRecord(settings));
}

export async function PUT(request) {
  try {
    const payload = await request.json();
    const validation = validateSiteSettingsPayload(payload);

    if (validation.error) {
      return Response.json({ error: validation.error }, { status: 400 });
    }

    const unsupportedFields = getUnsupportedSiteSettingsFields(validation.data);

    if (unsupportedFields.length > 0) {
      return Response.json(
        {
          error:
            "Prisma Client chưa đồng bộ schema mới. Hãy chạy db:generate, db:push và khởi động lại server.",
          details: unsupportedFields,
        },
        { status: 500 },
      );
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
