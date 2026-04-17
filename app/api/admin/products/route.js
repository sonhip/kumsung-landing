import { prisma } from "../../../../src/lib/prisma";
import { toSlug } from "../../../../src/utils/productCatalog";

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeImages = (images) =>
  (Array.isArray(images) ? images : [])
    .filter((image) => image?.url?.trim())
    .map((image, index) => ({
      url: image.url.trim(),
      altText: image.altText?.trim() || null,
      sortOrder:
        image.sortOrder === undefined ? index : Number(image.sortOrder || index),
    }));

const validateProductPayload = (payload) => {
  if (!payload.category?.trim()) {
    return { error: "Vui lòng nhập danh mục sản phẩm." };
  }

  if (!payload.title?.trim()) {
    return { error: "Vui lòng nhập tên sản phẩm." };
  }

  if (!payload.shortDescription?.trim()) {
    return { error: "Vui lòng nhập mô tả ngắn." };
  }

  const images = normalizeImages(payload.images);

  if (!images.length) {
    return { error: "Vui lòng thêm ít nhất 1 hình ảnh." };
  }

  const model = payload.model?.trim() || payload.title.trim();
  const slug = payload.slug?.trim() || toSlug(model);

  return {
    data: {
      category: payload.category.trim(),
      title: payload.title.trim(),
      model,
      slug,
      shortDescription: payload.shortDescription.trim(),
      contentHtml: payload.contentHtml?.trim() || "",
      tags: normalizeTags(payload.tags),
      isActive:
        payload.isActive === undefined
          ? true
          : payload.isActive === true || payload.isActive === "true",
      images,
    },
  };
};

const findDuplicateSlug = async (slug, excludeId) =>
  prisma.product.findFirst({
    where: {
      slug,
      NOT: excludeId ? { id: excludeId } : undefined,
    },
  });

export async function GET() {
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

  return Response.json(products);
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const validation = validateProductPayload(payload);

    if (validation.error) {
      return Response.json({ error: validation.error }, { status: 400 });
    }

    const existing = await findDuplicateSlug(validation.data.slug);

    if (existing) {
      return Response.json(
        { error: "Slug sản phẩm đã tồn tại." },
        { status: 400 },
      );
    }

    const product = await prisma.product.create({
      data: {
        category: validation.data.category,
        title: validation.data.title,
        model: validation.data.model,
        slug: validation.data.slug,
        shortDescription: validation.data.shortDescription,
        contentHtml: validation.data.contentHtml,
        tags: validation.data.tags,
        isActive: validation.data.isActive,
        images: {
          create: validation.data.images,
        },
      },
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    return Response.json(product);
  } catch (error) {
    console.error("Failed to create product", error);
    return Response.json(
      { error: "Không thể tạo sản phẩm." },
      { status: 500 },
    );
  }
}
