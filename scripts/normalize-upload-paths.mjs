import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const OLD_PREFIX = "/static/images/";
const NEW_PREFIX = "/uploads/seed/";

const replacePrefix = (value) =>
  typeof value === "string" ? value.replaceAll(OLD_PREFIX, NEW_PREFIX) : value;

async function updateMediaAssets() {
  const items = await prisma.mediaAsset.findMany({
    where: {
      imageUrl: {
        startsWith: OLD_PREFIX,
      },
    },
    select: {
      id: true,
      imageUrl: true,
    },
  });

  await Promise.all(
    items.map((item) =>
      prisma.mediaAsset.update({
        where: { id: item.id },
        data: {
          imageUrl: replacePrefix(item.imageUrl),
        },
      }),
    ),
  );

  return items.length;
}

async function updateProductImages() {
  const items = await prisma.productImage.findMany({
    where: {
      url: {
        startsWith: OLD_PREFIX,
      },
    },
    select: {
      id: true,
      url: true,
    },
  });

  await Promise.all(
    items.map((item) =>
      prisma.productImage.update({
        where: { id: item.id },
        data: {
          url: replacePrefix(item.url),
        },
      }),
    ),
  );

  return items.length;
}

async function updateProductContent() {
  const products = await prisma.product.findMany({
    where: {
      contentHtml: {
        contains: OLD_PREFIX,
      },
    },
    select: {
      id: true,
      contentHtml: true,
    },
  });

  await Promise.all(
    products.map((product) =>
      prisma.product.update({
        where: { id: product.id },
        data: {
          contentHtml: replacePrefix(product.contentHtml),
        },
      }),
    ),
  );

  return products.length;
}

async function main() {
  const [mediaCount, imageCount, contentCount] = await Promise.all([
    updateMediaAssets(),
    updateProductImages(),
    updateProductContent(),
  ]);

  console.log(
    JSON.stringify(
      {
        updatedMediaAssets: mediaCount,
        updatedProductImages: imageCount,
        updatedProductContent: contentCount,
      },
      null,
      2,
    ),
  );
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
