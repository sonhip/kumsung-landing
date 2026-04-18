import { prisma } from "../../../../src/lib/prisma";

const validateHeroPayload = (payload) => {
  const hero = payload?.hero;

  if (!hero) {
    return { error: "Thiếu dữ liệu hero." };
  }

  const headlineWordsText = hero.headlineWordsText?.trim() || "";
  const headlineWords = headlineWordsText
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

  return {
    data: {
      kicker: hero.kicker?.trim() || "",
      headlineWords,
      subtitle: hero.subtitle?.trim() || "",
      viewProductsButton: hero.viewProductsButton?.trim() || "Xem sản phẩm",
      contactButton: hero.contactButton?.trim() || "Liên hệ ngay",
    },
  };
};

const mapHeroContent = (hero = {}) => ({
  kicker: hero.kicker || "",
  headlineWordsText: Array.isArray(hero.headlineWords)
    ? hero.headlineWords.join(" ")
    : "",
  subtitle: hero.subtitle || "",
  viewProductsButton: hero.viewProductsButton || "Xem sản phẩm",
  contactButton: hero.contactButton || "Liên hệ ngay",
});

export async function GET() {
  const content = await prisma.siteContent.findUnique({
    where: { id: "default" },
    select: { hero: true },
  });

  if (!content) {
    return Response.json(
      { error: "Thiếu dữ liệu SiteContent trong database." },
      { status: 404 },
    );
  }

  return Response.json({
    hero: mapHeroContent(content.hero),
  });
}

export async function PUT(request) {
  try {
    const payload = await request.json();
    const validation = validateHeroPayload(payload);

    if (validation.error) {
      return Response.json({ error: validation.error }, { status: 400 });
    }

    const existing = await prisma.siteContent.findUnique({
      where: { id: "default" },
      select: { hero: true },
    });

    if (!existing) {
      return Response.json(
        { error: "Thiếu dữ liệu SiteContent trong database." },
        { status: 404 },
      );
    }

    const updatedHero = {
      ...(existing.hero || {}),
      ...validation.data,
    };

    const updated = await prisma.siteContent.update({
      where: { id: "default" },
      data: {
        hero: updatedHero,
      },
      select: { hero: true },
    });

    return Response.json({
      hero: mapHeroContent(updated.hero),
    });
  } catch (error) {
    console.error("Failed to update hero content", error);
    return Response.json(
      { error: "Không thể cập nhật nội dung hero." },
      { status: 500 },
    );
  }
}
