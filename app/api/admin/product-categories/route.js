import { prisma } from "../../../../src/lib/prisma";
import { toSlug } from "../../../../src/utils/productCatalog";

const normalizeCategory = (value) => value?.trim() || "";

const readCategoriesFromNav = (nav = {}) =>
  (Array.isArray(nav.items) ? nav.items : [])
    .map((item) => normalizeCategory(item))
    .filter(Boolean);

const serializeCategories = (items, productsByCategory = new Map()) =>
  items.map((name) => ({
    name,
    slug: toSlug(name),
    productCount: productsByCategory.get(name) || 0,
  }));

const getCategoriesAndCounts = async () => {
  const [content, products] = await Promise.all([
    prisma.siteContent.findUnique({
      where: { id: "default" },
      select: { nav: true },
    }),
    prisma.product.findMany({
      select: { category: true },
    }),
  ]);

  if (!content) {
    return { error: "Thiếu dữ liệu SiteContent trong database." };
  }

  const categories = readCategoriesFromNav(content.nav);
  const productsByCategory = products.reduce((acc, item) => {
    const key = normalizeCategory(item.category);
    if (!key) return acc;
    acc.set(key, (acc.get(key) || 0) + 1);
    return acc;
  }, new Map());
  const productOnlyCategories = [...productsByCategory.keys()].filter(
    (name) => !categories.some((item) => item.toLowerCase() === name.toLowerCase()),
  );
  const mergedCategories = [...categories, ...productOnlyCategories];

  return {
    nav: content.nav || {},
    categories: mergedCategories,
    productsByCategory,
  };
};

const upsertNavItems = async (updater) => {
  const existing = await prisma.siteContent.findUnique({
    where: { id: "default" },
    select: { nav: true },
  });

  if (!existing) {
    return { error: "Thiếu dữ liệu SiteContent trong database." };
  }

  const currentItems = readCategoriesFromNav(existing.nav);
  const nextItems = updater(currentItems);

  const updated = await prisma.siteContent.update({
    where: { id: "default" },
    data: {
      nav: {
        ...(existing.nav || {}),
        items: nextItems,
      },
    },
    select: { nav: true },
  });

  return { nav: updated.nav };
};

export async function GET() {
  const result = await getCategoriesAndCounts();

  if (result.error) {
    return Response.json({ error: result.error }, { status: 404 });
  }

  return Response.json({
    items: serializeCategories(result.categories, result.productsByCategory),
  });
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const name = normalizeCategory(payload?.name);

    if (!name) {
      return Response.json(
        { error: "Vui lòng nhập tên danh mục." },
        { status: 400 },
      );
    }

    const snapshot = await getCategoriesAndCounts();
    const existingNames = snapshot.categories || [];

    const upsertResult = await upsertNavItems((items) => {
      if (
        existingNames.some((item) => item.toLowerCase() === name.toLowerCase())
      ) {
        throw new Error("DUPLICATE_CATEGORY");
      }

      return [...items, name];
    });

    if (upsertResult.error) {
      return Response.json({ error: upsertResult.error }, { status: 404 });
    }

    const result = await getCategoriesAndCounts();
    return Response.json({
      items: serializeCategories(result.categories, result.productsByCategory),
    });
  } catch (error) {
    if (error.message === "DUPLICATE_CATEGORY") {
      return Response.json(
        { error: "Danh mục đã tồn tại trong hệ thống." },
        { status: 400 },
      );
    }

    console.error("Failed to create product category", error);
    return Response.json(
      { error: "Không thể tạo danh mục sản phẩm." },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const payload = await request.json();
    const originalName = normalizeCategory(payload?.originalName);
    const name = normalizeCategory(payload?.name);

    if (!originalName || !name) {
      return Response.json(
        { error: "Thiếu thông tin danh mục cần cập nhật." },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const content = await tx.siteContent.findUnique({
        where: { id: "default" },
        select: { nav: true },
      });

      if (!content) {
        throw new Error("MISSING_SITE_CONTENT");
      }

      const categories = readCategoriesFromNav(content.nav);
      const index = categories.findIndex(
        (item) => item.toLowerCase() === originalName.toLowerCase(),
      );

      const duplicateIndex = categories.findIndex(
        (item) =>
          item.toLowerCase() === name.toLowerCase() &&
          item.toLowerCase() !== originalName.toLowerCase(),
      );
      const linkedDuplicateCount = await tx.product.count({
        where: {
          category: name,
          NOT: {
            category: originalName,
          },
        },
      });

      if (duplicateIndex >= 0 || linkedDuplicateCount > 0) {
        throw new Error("DUPLICATE_CATEGORY");
      }

      const nextCategories = [...categories];

      if (index >= 0) {
        nextCategories[index] = name;
      } else {
        const linkedProducts = await tx.product.count({
          where: {
            category: originalName,
          },
        });

        if (!linkedProducts) {
          throw new Error("CATEGORY_NOT_FOUND");
        }

        nextCategories.push(name);
      }

      await tx.siteContent.update({
        where: { id: "default" },
        data: {
          nav: {
            ...(content.nav || {}),
            items: nextCategories,
          },
        },
      });

      await tx.product.updateMany({
        where: { category: originalName },
        data: { category: name },
      });
    });

    void result;

    const categoriesAndCounts = await getCategoriesAndCounts();
    return Response.json({
      items: serializeCategories(
        categoriesAndCounts.categories,
        categoriesAndCounts.productsByCategory,
      ),
    });
  } catch (error) {
    if (error.message === "MISSING_SITE_CONTENT") {
      return Response.json(
        { error: "Thiếu dữ liệu SiteContent trong database." },
        { status: 404 },
      );
    }
    if (error.message === "CATEGORY_NOT_FOUND") {
      return Response.json(
        { error: "Không tìm thấy danh mục cần sửa." },
        { status: 404 },
      );
    }
    if (error.message === "DUPLICATE_CATEGORY") {
      return Response.json(
        { error: "Danh mục đã tồn tại trong hệ thống." },
        { status: 400 },
      );
    }

    console.error("Failed to update product category", error);
    return Response.json(
      { error: "Không thể cập nhật danh mục sản phẩm." },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const payload = await request.json();
    const name = normalizeCategory(payload?.name);

    if (!name) {
      return Response.json(
        { error: "Thiếu tên danh mục cần xoá." },
        { status: 400 },
      );
    }

    const linkedProducts = await prisma.product.count({
      where: { category: name },
    });

    if (linkedProducts > 0) {
      return Response.json(
        {
          error: `Không thể xoá vì còn ${linkedProducts} sản phẩm đang thuộc danh mục này.`,
        },
        { status: 400 },
      );
    }

    const upsertResult = await upsertNavItems((items) => {
      const nextItems = items.filter(
        (item) => item.toLowerCase() !== name.toLowerCase(),
      );

      if (nextItems.length === items.length) {
        throw new Error("CATEGORY_NOT_FOUND");
      }

      return nextItems;
    });

    if (upsertResult.error) {
      return Response.json({ error: upsertResult.error }, { status: 404 });
    }

    const result = await getCategoriesAndCounts();
    return Response.json({
      items: serializeCategories(result.categories, result.productsByCategory),
    });
  } catch (error) {
    if (error.message === "CATEGORY_NOT_FOUND") {
      return Response.json(
        { error: "Không tìm thấy danh mục cần xoá." },
        { status: 404 },
      );
    }

    console.error("Failed to delete product category", error);
    return Response.json(
      { error: "Không thể xoá danh mục sản phẩm." },
      { status: 500 },
    );
  }
}
