import { PrismaClient } from "@prisma/client";
import { STATIC_CONTENT } from "../src/constants/staticContent.js";
import { toSlug } from "../src/utils/productCatalog.js";

const prisma = new PrismaClient();

async function seedSiteSettings() {
  await prisma.siteSettings.upsert({
    where: {
      id: "default",
    },
    update: {},
    create: {
      id: "default",
      companyName: STATIC_CONTENT.company.name,
      companyShortName: STATIC_CONTENT.company.shortName,
      companyHomeAriaLabel: STATIC_CONTENT.company.homeAriaLabel,
      companyTagline: STATIC_CONTENT.company.tagline,
      companyDistributorLabel: STATIC_CONTENT.company.distributorLabel,
      companyDistributorValue: STATIC_CONTENT.company.distributorValue,
      companyQuoteButton: STATIC_CONTENT.company.quoteButton,
      contactPhone: STATIC_CONTENT.contact.phone,
      contactHours: STATIC_CONTENT.contact.hours,
      contactAddressFull: STATIC_CONTENT.contact.addressFull,
      contactAddressShort: STATIC_CONTENT.contact.addressShort,
      contactEmail: STATIC_CONTENT.contact.email,
      contactEmailAriaLabel: STATIC_CONTENT.contact.emailAriaLabel,
      contactFacebookUrl: STATIC_CONTENT.contact.facebookUrl,
      contactFacebookAriaLabel: STATIC_CONTENT.contact.facebookAriaLabel,
    },
  });
}

async function seedSiteContent() {
  await prisma.siteContent.upsert({
    where: {
      id: "default",
    },
    update: {
      nav: STATIC_CONTENT.nav,
      hero: STATIC_CONTENT.hero,
      stats: STATIC_CONTENT.stats,
      previousWorks: STATIC_CONTENT.previousWorks,
      services: STATIC_CONTENT.services,
      companyProfile: STATIC_CONTENT.companyProfile,
      products: STATIC_CONTENT.products,
      cta: STATIC_CONTENT.cta,
      contactPage: STATIC_CONTENT.contactPage,
      aboutPage: STATIC_CONTENT.aboutPage,
      footer: STATIC_CONTENT.footer,
      routes: STATIC_CONTENT.routes,
    },
    create: {
      id: "default",
      nav: STATIC_CONTENT.nav,
      hero: STATIC_CONTENT.hero,
      stats: STATIC_CONTENT.stats,
      previousWorks: STATIC_CONTENT.previousWorks,
      services: STATIC_CONTENT.services,
      companyProfile: STATIC_CONTENT.companyProfile,
      products: STATIC_CONTENT.products,
      cta: STATIC_CONTENT.cta,
      contactPage: STATIC_CONTENT.contactPage,
      aboutPage: STATIC_CONTENT.aboutPage,
      footer: STATIC_CONTENT.footer,
      routes: STATIC_CONTENT.routes,
    },
  });
}

const buildProductHtml = (product) => {
  const features = product.features?.length
    ? `<ul>${product.features.map((feature) => `<li>${feature}</li>`).join("")}</ul>`
    : "";

  return `<p>${product.description}</p>${features}`;
};

async function seedMediaAssets() {
  const count = await prisma.mediaAsset.count();

  if (count > 0) {
    return;
  }

  const heroSlides = STATIC_CONTENT.hero.backgroundImages.map(
    (imageUrl, index) => ({
      section: "hero_slide",
      imageUrl,
      altText: `Hero ${index + 1}`,
      sortOrder: index,
    }),
  );

  const statsHighlights = STATIC_CONTENT.stats.highlights.map(
    (item, index) => ({
      section: "stats_highlight",
      title: item.title,
      subtitle: item.subtitle,
      imageUrl: item.image,
      altText: item.title,
      sortOrder: index,
    }),
  );

  const serviceTiles = STATIC_CONTENT.services.tiles.map((item, index) => ({
    section: "service_tile",
    title: item.title || null,
    subtitle: item.description || null,
    description: item.description || null,
    imageUrl: item.image,
    altText: item.alt || item.title || `Dịch vụ ${index + 1}`,
    tone: item.tone || null,
    variant: item.type,
    sortOrder: index,
  }));

  const previousWorks = STATIC_CONTENT.previousWorks.items.map(
    (item, index) => ({
      section: "previous_work",
      title: item.title,
      subtitle: item.subtitle,
      imageUrl: item.image,
      altText: item.title,
      sortOrder: index,
    }),
  );

  const partnerLogos = STATIC_CONTENT.companyProfile.partners.map(
    (item, index) => ({
      section: "partner_logo",
      title: item.name,
      imageUrl: item.logo,
      altText: item.name,
      sortOrder: index,
    }),
  );

  await prisma.mediaAsset.createMany({
    data: [
      ...heroSlides,
      ...statsHighlights,
      ...serviceTiles,
      ...previousWorks,
      ...partnerLogos,
    ],
  });
}

async function seedProducts() {
  const count = await prisma.product.count();

  if (count > 0) {
    return;
  }

  for (const product of STATIC_CONTENT.products.list) {
    await prisma.product.create({
      data: {
        category: product.category,
        title: product.title,
        model: product.model || product.title,
        slug: toSlug(product.model || product.title),
        shortDescription: product.description,
        contentHtml: buildProductHtml(product),
        tags: [toSlug(product.category), toSlug(product.title)],
        isActive: true,
        images: {
          create: [
            {
              url: product.image,
              altText: product.title,
              sortOrder: 0,
            },
          ],
        },
      },
    });
  }
}

async function main() {
  await seedSiteSettings();
  await seedSiteContent();
  await seedMediaAssets();
  await seedProducts();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
