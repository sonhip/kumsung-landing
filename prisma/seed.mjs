import { PrismaClient } from "@prisma/client";
import { SITE_TEXT } from "../src/constants/siteText.js";
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
      companyName: SITE_TEXT.company.name,
      companyShortName: SITE_TEXT.company.shortName,
      companyHomeAriaLabel: SITE_TEXT.company.homeAriaLabel,
      companyTagline: SITE_TEXT.company.tagline,
      companyDistributorLabel: SITE_TEXT.company.distributorLabel,
      companyDistributorValue: SITE_TEXT.company.distributorValue,
      companyQuoteButton: SITE_TEXT.company.quoteButton,
      contactPhone: SITE_TEXT.contact.phone,
      contactHours: SITE_TEXT.contact.hours,
      contactAddressFull: SITE_TEXT.contact.addressFull,
      contactAddressShort: SITE_TEXT.contact.addressShort,
      contactEmail: SITE_TEXT.contact.email,
      contactEmailAriaLabel: SITE_TEXT.contact.emailAriaLabel,
      contactFacebookUrl: SITE_TEXT.contact.facebookUrl,
      contactFacebookAriaLabel: SITE_TEXT.contact.facebookAriaLabel,
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

  const heroSlides = SITE_TEXT.hero.backgroundImages.map((imageUrl, index) => ({
    section: "hero_slide",
    imageUrl,
    altText: `Hero ${index + 1}`,
    sortOrder: index,
  }));

  const statsHighlights = SITE_TEXT.stats.highlights.map((item, index) => ({
    section: "stats_highlight",
    title: item.title,
    subtitle: item.subtitle,
    imageUrl: item.image,
    altText: item.title,
    sortOrder: index,
  }));

  const serviceTiles = SITE_TEXT.services.tiles.map((item, index) => ({
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

  const previousWorks = SITE_TEXT.previousWorks.items.map((item, index) => ({
    section: "previous_work",
    title: item.title,
    subtitle: item.subtitle,
    imageUrl: item.image,
    altText: item.title,
    sortOrder: index,
  }));

  const partnerLogos = SITE_TEXT.companyProfile.partners.map((item, index) => ({
    section: "partner_logo",
    title: item.name,
    imageUrl: item.logo,
    altText: item.name,
    sortOrder: index,
  }));

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

  for (const product of SITE_TEXT.products.list) {
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
