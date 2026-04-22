import { prisma } from "./prisma";
import { toSlug } from "../utils/productCatalog";

const mapProductImage = (image, index) => ({
  id: image.id,
  url: image.url,
  altText: image.altText || `Ảnh sản phẩm ${index + 1}`,
  sortOrder: image.sortOrder,
});

const mapTeamMemberRecord = (member) => ({
  id: member.id,
  fullName: member.fullName,
  role: member.role || "",
  email: member.email || "",
  phone: member.phone || "",
  imageUrl: member.imageUrl || "",
  bio: member.bio || "",
  sortOrder: member.sortOrder,
  isActive: member.isActive,
});

const mapNewsPostRecord = (post) => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt || "",
  contentHtml: post.contentHtml || "",
  coverImage: post.coverImage || "",
  isPublished: post.isPublished,
  publishedAt: post.publishedAt,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});

const mapProductRecord = (product) => {
  const images = [...product.images]
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map(mapProductImage);

  return {
    id: product.id,
    category: product.category,
    title: product.title,
    model: product.model || product.title,
    description: product.shortDescription,
    contentHtml: product.contentHtml || "",
    tags: product.tags || [],
    image: images[0]?.url || "/uploads/seed/product-other.jpg",
    images,
    categorySlug: toSlug(product.category),
    productSlug: product.slug,
  };
};

const getSectionItems = (items, section) =>
  items
    .filter((item) => item.section === section && item.isActive)
    .sort((left, right) => left.sortOrder - right.sortOrder);

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
    googleMapUrl: settings.contactGoogleMapUrl || "",
  },
  branding: {
    logoUrl: settings.companyLogoUrl || null,
    logoAltText: settings.companyLogoAltText || settings.companyShortName,
    faviconUrl: settings.faviconUrl || null,
  },
  footer: {
    contactInfoTitle: settings.footerContactInfoTitle || "",
    rightsText: settings.footerRightsText || "",
    copyrightStartYear: settings.footerCopyrightStartYear || null,
  },
});

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({
    where: {
      id: "default",
    },
  });

  if (!settings) {
    throw new Error(
      "Missing SiteSettings record (id=default). Seed database before running app.",
    );
  }

  return mapSiteSettingsRecord(settings);
}

const mapSiteContentRecord = (content) => ({
  nav: content.nav,
  hero: content.hero,
  stats: content.stats,
  previousWorks: content.previousWorks,
  services: content.services,
  companyProfile: content.companyProfile,
  products: content.products,
  cta: content.cta,
  contactPage: content.contactPage,
  aboutPage: content.aboutPage,
  footer: content.footer,
  routes: content.routes,
});

export async function getSiteContent() {
  const content = await prisma.siteContent.findUnique({
    where: {
      id: "default",
    },
  });

  if (!content) {
    throw new Error(
      "Missing SiteContent record (id=default). Seed database before running app.",
    );
  }

  return mapSiteContentRecord(content);
}

export async function getBrandLogo() {
  const siteSettings = await getSiteSettings();

  if (siteSettings.branding.logoUrl) {
    return {
      id: "site_settings_logo",
      imageUrl: siteSettings.branding.logoUrl,
      altText:
        siteSettings.branding.logoAltText || siteSettings.company.shortName,
    };
  }
  return null;
}

export async function getHomepageMedia() {
  const items = await prisma.mediaAsset.findMany({
    where: {
      isActive: true,
      section: {
        in: [
          "hero_slide",
          "stats_highlight",
          "service_tile",
          "previous_work",
          "partner_logo",
        ],
      },
    },
    orderBy: [{ section: "asc" }, { sortOrder: "asc" }],
  });

  return {
    heroSlides: getSectionItems(items, "hero_slide").map(
      (item) => item.imageUrl,
    ),
    statsHighlights: getSectionItems(items, "stats_highlight").map((item) => ({
      title: item.title || "",
      subtitle: item.subtitle || "",
      image: item.imageUrl,
    })),
    serviceTiles: getSectionItems(items, "service_tile").map((item) => ({
      type: item.variant || (item.title || item.description ? "content" : "image"),
      tone: item.tone || "dark",
      image: item.imageUrl,
      title: item.title || "",
      description: item.description || item.subtitle || "",
      alt: item.altText || item.title || "",
    })),
    previousWorks: getSectionItems(items, "previous_work").map((item) => ({
      title: item.title || "",
      subtitle: item.subtitle || "",
      image: item.imageUrl,
    })),
    partnerLogos: getSectionItems(items, "partner_logo").map((item) => ({
      name: item.title || item.altText || "Đối tác",
      logo: item.imageUrl,
    })),
  };
}

export async function getAdminMediaAssets() {
  return prisma.mediaAsset.findMany({
    orderBy: [{ section: "asc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getAdminProducts() {
  const products = await prisma.product.findMany({
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return products.map(mapProductRecord);
}

export async function getAdminTeamMembers() {
  const members = await prisma.teamMember.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return members.map(mapTeamMemberRecord);
}

export async function getAdminNewsPosts() {
  const posts = await prisma.newsPost.findMany({
    orderBy: [{ updatedAt: "desc" }],
  });

  return posts.map(mapNewsPostRecord);
}

export async function getPublicNewsPosts() {
  const posts = await prisma.newsPost.findMany({
    where: {
      isPublished: true,
      OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  return posts.map(mapNewsPostRecord);
}

export async function getPublicNewsPostBySlug(slug) {
  const post = await prisma.newsPost.findFirst({
    where: {
      slug,
      isPublished: true,
      OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
    },
  });

  return post ? mapNewsPostRecord(post) : null;
}

export async function getPublicTeamMembers() {
  const members = await prisma.teamMember.findMany({
    where: {
      isActive: true,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return members.map(mapTeamMemberRecord);
}

export async function getPublicProducts() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
    orderBy: [{ category: "asc" }, { title: "asc" }],
  });

  if (!products.length) {
    return [];
  }

  return products.map(mapProductRecord);
}

export async function getPublicProductBySlugs(categorySlug, productSlug) {
  const products = await getPublicProducts();
  return (
    products.find(
      (item) =>
        item.categorySlug === categorySlug && item.productSlug === productSlug,
    ) || null
  );
}

export async function getRelatedProducts(product, limit = 3) {
  if (!product?.tags?.length) {
    return [];
  }

  const products = await getPublicProducts();

  return products
    .filter((item) => item.id !== product.id)
    .map((item) => ({
      ...item,
      relevance: item.tags.filter((tag) => product.tags.includes(tag)).length,
    }))
    .filter((item) => item.relevance > 0)
    .sort((left, right) => right.relevance - left.relevance)
    .slice(0, limit);
}
