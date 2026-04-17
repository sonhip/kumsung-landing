import { prisma } from "../../../../../src/lib/prisma";
import { deleteUploadIfUnused } from "../../../../../src/lib/uploadStorage";

const parseBoolean = (value) => value === true || value === "true";

const validateMediaPayload = (payload) => {
  if (!payload.section?.trim()) {
    return { error: "Vui lòng chọn section." };
  }

  if (!payload.imageUrl?.trim()) {
    return { error: "Vui lòng nhập hoặc upload hình ảnh." };
  }

  return {
    data: {
      section: payload.section.trim(),
      title: payload.title?.trim() || null,
      subtitle: payload.subtitle?.trim() || null,
      description: payload.description?.trim() || null,
      imageUrl: payload.imageUrl.trim(),
      altText: payload.altText?.trim() || null,
      tone: payload.tone?.trim() || null,
      variant: payload.variant?.trim() || null,
      sortOrder: Number(payload.sortOrder || 0),
      isActive: parseBoolean(payload.isActive),
    },
  };
};

export async function GET(_request, { params }) {
  const item = await prisma.mediaAsset.findUnique({
    where: { id: params.id },
  });

  if (!item) {
    return Response.json({ error: "Không tìm thấy media." }, { status: 404 });
  }

  return Response.json(item);
}

export async function PATCH(request, { params }) {
  try {
    const payload = await request.json();
    const validation = validateMediaPayload(payload);

    if (validation.error) {
      return Response.json({ error: validation.error }, { status: 400 });
    }

    const existingItem = await prisma.mediaAsset.findUnique({
      where: { id: params.id },
    });

    if (!existingItem) {
      return Response.json({ error: "Không tìm thấy media." }, { status: 404 });
    }

    const item = await prisma.mediaAsset.update({
      where: { id: params.id },
      data: validation.data,
    });

    if (existingItem.imageUrl !== item.imageUrl) {
      await deleteUploadIfUnused(existingItem.imageUrl);
    }

    return Response.json(item);
  } catch (error) {
    console.error("Failed to update media item", error);
    return Response.json(
      { error: "Không thể cập nhật media." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const existingItem = await prisma.mediaAsset.findUnique({
      where: { id: params.id },
    });

    if (!existingItem) {
      return Response.json({ error: "Không tìm thấy media." }, { status: 404 });
    }

    await prisma.mediaAsset.delete({
      where: { id: params.id },
    });
    await deleteUploadIfUnused(existingItem.imageUrl);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete media item", error);
    return Response.json(
      { error: "Không thể xóa media." },
      { status: 500 },
    );
  }
}
