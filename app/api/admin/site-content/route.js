import { prisma } from "../../../../src/lib/prisma";

const mapHeroContent = (hero = {}) => ({
  kicker: hero.kicker || "",
  headlineWordsText: Array.isArray(hero.headlineWords)
    ? hero.headlineWords.join(" ")
    : "",
  subtitle: hero.subtitle || "",
  viewProductsButton: hero.viewProductsButton || "Xem sản phẩm",
  contactButton: hero.contactButton || "Liên hệ ngay",
});

const mapContactPageContent = (contactPage = {}) => ({
  heroTitle: contactPage.heroTitle || "",
  heroImage: contactPage.heroImage || "",
  phoneTitle: contactPage.phoneTitle || "",
  phoneDescription: contactPage.phoneDescription || "",
  emailTitle: contactPage.emailTitle || "",
  emailDescription: contactPage.emailDescription || "",
  locationTitle: contactPage.locationTitle || "",
  locationMapLabel: contactPage.locationMapLabel || "",
  formTitle: contactPage.formTitle || "",
  formSubtitle: contactPage.formSubtitle || "",
  submitLabel: contactPage.submitLabel || "",
});

const mapAboutPageContent = (aboutPage = {}) => ({
  heroTitle: aboutPage.heroTitle || "",
  heroImage: aboutPage.heroImage || "",
  companyTitle: aboutPage.companyTitle || "",
  companyName: aboutPage.companyName || "",
  description: aboutPage.description || "",
  milestonesTitle: aboutPage.milestonesTitle || "",
  milestonesHighlight: aboutPage.milestonesHighlight || "",
  milestonesSubtitle: aboutPage.milestonesSubtitle || "",
  milestonesImage: aboutPage.milestonesImage || "",
  teamTitle: aboutPage.teamTitle || "",
});

const normalizeHeroPayload = (hero = {}) => {
  const headlineWordsText = hero.headlineWordsText?.trim() || "";
  const headlineWords = headlineWordsText
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

  return {
    kicker: hero.kicker?.trim() || "",
    headlineWords,
    subtitle: hero.subtitle?.trim() || "",
    viewProductsButton: hero.viewProductsButton?.trim() || "Xem sản phẩm",
    contactButton: hero.contactButton?.trim() || "Liên hệ ngay",
  };
};

const normalizeContactPagePayload = (contactPage = {}) => ({
  heroTitle: contactPage.heroTitle?.trim() || "",
  heroImage: contactPage.heroImage?.trim() || "",
  phoneTitle: contactPage.phoneTitle?.trim() || "",
  phoneDescription: contactPage.phoneDescription?.trim() || "",
  emailTitle: contactPage.emailTitle?.trim() || "",
  emailDescription: contactPage.emailDescription?.trim() || "",
  locationTitle: contactPage.locationTitle?.trim() || "",
  locationMapLabel: contactPage.locationMapLabel?.trim() || "",
  formTitle: contactPage.formTitle?.trim() || "",
  formSubtitle: contactPage.formSubtitle?.trim() || "",
  submitLabel: contactPage.submitLabel?.trim() || "Gửi liên hệ",
});

const normalizeAboutPagePayload = (aboutPage = {}) => ({
  heroTitle: aboutPage.heroTitle?.trim() || "",
  heroImage: aboutPage.heroImage?.trim() || "",
  companyTitle: aboutPage.companyTitle?.trim() || "",
  companyName: aboutPage.companyName?.trim() || "",
  description: aboutPage.description?.trim() || "",
  milestonesTitle: aboutPage.milestonesTitle?.trim() || "",
  milestonesHighlight: aboutPage.milestonesHighlight?.trim() || "",
  milestonesSubtitle: aboutPage.milestonesSubtitle?.trim() || "",
  milestonesImage: aboutPage.milestonesImage?.trim() || "",
  teamTitle: aboutPage.teamTitle?.trim() || "",
});

export async function GET() {
  const content = await prisma.siteContent.findUnique({
    where: { id: "default" },
    select: { hero: true, contactPage: true, aboutPage: true },
  });

  if (!content) {
    return Response.json(
      { error: "Thiếu dữ liệu SiteContent trong database." },
      { status: 404 },
    );
  }

  return Response.json({
    hero: mapHeroContent(content.hero),
    contactPage: mapContactPageContent(content.contactPage),
    aboutPage: mapAboutPageContent(content.aboutPage),
  });
}

export async function PUT(request) {
  try {
    const payload = await request.json();

    if (!payload?.hero && !payload?.contactPage && !payload?.aboutPage) {
      return Response.json(
        { error: "Thiếu dữ liệu cần cập nhật." },
        { status: 400 },
      );
    }

    const existing = await prisma.siteContent.findUnique({
      where: { id: "default" },
      select: { hero: true, contactPage: true, aboutPage: true },
    });

    if (!existing) {
      return Response.json(
        { error: "Thiếu dữ liệu SiteContent trong database." },
        { status: 404 },
      );
    }

    const data = {};

    if (payload.hero) {
      data.hero = {
        ...(existing.hero || {}),
        ...normalizeHeroPayload(payload.hero),
      };
    }

    if (payload.contactPage) {
      data.contactPage = {
        ...(existing.contactPage || {}),
        ...normalizeContactPagePayload(payload.contactPage),
      };
    }

    if (payload.aboutPage) {
      data.aboutPage = {
        ...(existing.aboutPage || {}),
        ...normalizeAboutPagePayload(payload.aboutPage),
      };
    }

    const updated = await prisma.siteContent.update({
      where: { id: "default" },
      data,
      select: { hero: true, contactPage: true, aboutPage: true },
    });

    return Response.json({
      hero: mapHeroContent(updated.hero),
      contactPage: mapContactPageContent(updated.contactPage),
      aboutPage: mapAboutPageContent(updated.aboutPage),
    });
  } catch (error) {
    console.error("Failed to update site content", error);
    return Response.json(
      { error: "Không thể cập nhật nội dung trang." },
      { status: 500 },
    );
  }
}
