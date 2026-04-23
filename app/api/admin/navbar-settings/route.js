import { prisma } from "../../../../src/lib/prisma";

const defaultVisibility = {
  home: true,
  products: true,
  news: true,
  contact: true,
  about: true,
};

const mapNavbarSettings = (nav = {}) => ({
  home: nav.home || "Trang chủ",
  products: nav.products || "Sản phẩm",
  news: nav.news || "Tin tức",
  contact: nav.contact || "Liên hệ",
  about: nav.about || "Giới thiệu",
  toggleMenuAriaLabel:
    nav.toggleMenuAriaLabel || "Mở hoặc đóng menu điều hướng",
  toggleProductsAriaLabel:
    nav.toggleProductsAriaLabel || "Mở menu sản phẩm",
  visibility: {
    ...defaultVisibility,
    ...(nav.visibility || {}),
  },
});

const normalizeNavbarPayload = (payload = {}, existingNav = {}) => ({
  ...existingNav,
  home: payload.home?.trim() || "Trang chủ",
  products: payload.products?.trim() || "Sản phẩm",
  news: payload.news?.trim() || "Tin tức",
  contact: payload.contact?.trim() || "Liên hệ",
  about: payload.about?.trim() || "Giới thiệu",
  toggleMenuAriaLabel:
    payload.toggleMenuAriaLabel?.trim() || "Mở hoặc đóng menu điều hướng",
  toggleProductsAriaLabel:
    payload.toggleProductsAriaLabel?.trim() || "Mở menu sản phẩm",
  visibility: {
    ...defaultVisibility,
    ...(existingNav.visibility || {}),
    ...(payload.visibility || {}),
  },
});

export async function GET() {
  const content = await prisma.siteContent.findUnique({
    where: { id: "default" },
    select: { nav: true },
  });

  if (!content) {
    return Response.json(
      { error: "Thiếu dữ liệu SiteContent trong database." },
      { status: 404 },
    );
  }

  return Response.json({ nav: mapNavbarSettings(content.nav) });
}

export async function PUT(request) {
  try {
    const payload = await request.json();

    if (!payload?.nav) {
      return Response.json(
        { error: "Thiếu dữ liệu navbar cần cập nhật." },
        { status: 400 },
      );
    }

    const existing = await prisma.siteContent.findUnique({
      where: { id: "default" },
      select: { nav: true },
    });

    if (!existing) {
      return Response.json(
        { error: "Thiếu dữ liệu SiteContent trong database." },
        { status: 404 },
      );
    }

    const nav = normalizeNavbarPayload(payload.nav, existing.nav || {});

    const updated = await prisma.siteContent.update({
      where: { id: "default" },
      data: { nav },
      select: { nav: true },
    });

    return Response.json({ nav: mapNavbarSettings(updated.nav) });
  } catch (error) {
    console.error("Failed to update navbar settings", error);
    return Response.json(
      { error: "Không thể cập nhật cài đặt navbar." },
      { status: 500 },
    );
  }
}
