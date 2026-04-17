import { prisma } from "../../../../src/lib/prisma";

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
      isActive:
        payload.isActive === undefined ? true : parseBoolean(payload.isActive),
    },
  };
};

export async function GET() {
  const items = await prisma.mediaAsset.findMany({
    orderBy: [{ section: "asc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return Response.json(items);
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const validation = validateMediaPayload(payload);

    if (validation.error) {
      return Response.json({ error: validation.error }, { status: 400 });
    }

    const item = await prisma.mediaAsset.create({
      data: validation.data,
    });

    return Response.json(item);
  } catch (error) {
    console.error("Failed to create media item", error);
    return Response.json(
      { error: "Không thể tạo media." },
      { status: 500 },
    );
  }
}
