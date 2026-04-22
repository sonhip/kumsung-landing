import { prisma } from "../../../../../src/lib/prisma";
import { deleteUploadIfUnused } from "../../../../../src/lib/uploadStorage";
import { toSlug } from "../../../../../src/utils/productCatalog";

const parsePublishedAt = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const validatePayload = (payload) => {
  if (!payload.title?.trim()) {
    return { error: "Vui lòng nhập tiêu đề bài viết." };
  }

  if (!payload.contentHtml?.trim()) {
    return { error: "Vui lòng nhập nội dung bài viết." };
  }

  const slug = payload.slug?.trim() || toSlug(payload.title);

  if (!slug) {
    return { error: "Slug bài viết không hợp lệ." };
  }

  const isPublished =
    payload.isPublished === true || payload.isPublished === "true";
  const publishedAt = parsePublishedAt(payload.publishedAt);

  return {
    data: {
      title: payload.title.trim(),
      slug,
      excerpt: payload.excerpt?.trim() || null,
      contentHtml: payload.contentHtml,
      coverImage: payload.coverImage?.trim() || null,
      isPublished,
      publishedAt: isPublished ? publishedAt || new Date() : null,
    },
  };
};

const findDuplicateSlug = (slug, excludeId) =>
  prisma.newsPost.findFirst({
    where: {
      slug,
      NOT: excludeId ? { id: excludeId } : undefined,
    },
  });

export async function GET(_request, { params }) {
  const item = await prisma.newsPost.findUnique({
    where: { id: params.id },
  });

  if (!item) {
    return Response.json({ error: "Không tìm thấy bài viết." }, { status: 404 });
  }

  return Response.json(item);
}

export async function PATCH(request, { params }) {
  try {
    const payload = await request.json();
    const validation = validatePayload(payload);

    if (validation.error) {
      return Response.json({ error: validation.error }, { status: 400 });
    }

    const existingItem = await prisma.newsPost.findUnique({
      where: { id: params.id },
    });

    if (!existingItem) {
      return Response.json({ error: "Không tìm thấy bài viết." }, { status: 404 });
    }

    const duplicate = await findDuplicateSlug(validation.data.slug, params.id);

    if (duplicate) {
      return Response.json({ error: "Slug bài viết đã tồn tại." }, { status: 400 });
    }

    const item = await prisma.newsPost.update({
      where: { id: params.id },
      data: validation.data,
    });

    if (
      existingItem.coverImage &&
      existingItem.coverImage !== validation.data.coverImage
    ) {
      await deleteUploadIfUnused(existingItem.coverImage);
    }

    return Response.json(item);
  } catch (error) {
    console.error("Failed to update news post", error);
    return Response.json(
      { error: "Không thể cập nhật bài viết." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const existingItem = await prisma.newsPost.findUnique({
      where: { id: params.id },
    });

    if (!existingItem) {
      return Response.json({ error: "Không tìm thấy bài viết." }, { status: 404 });
    }

    await prisma.newsPost.delete({
      where: { id: params.id },
    });

    if (existingItem.coverImage) {
      await deleteUploadIfUnused(existingItem.coverImage);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete news post", error);
    return Response.json(
      { error: "Không thể xoá bài viết." },
      { status: 500 },
    );
  }
}
