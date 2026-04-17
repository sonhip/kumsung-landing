import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json({ error: "Không tìm thấy file upload." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return Response.json({ error: "Chỉ hỗ trợ upload hình ảnh." }, { status: 400 });
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const extension = path.extname(file.name) || ".png";
    const safeName = `${Date.now()}-${randomUUID()}${extension}`;
    const targetPath = path.join(UPLOAD_DIR, safeName);
    const bytes = await file.arrayBuffer();

    await writeFile(targetPath, Buffer.from(bytes));

    return Response.json({
      url: `/uploads/${safeName}`,
    });
  } catch (error) {
    console.error("Failed to upload image", error);
    return Response.json(
      { error: "Không thể upload hình ảnh." },
      { status: 500 },
    );
  }
}
