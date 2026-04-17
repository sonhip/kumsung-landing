import { writeFile } from "fs/promises";
import { createUploadTarget, sanitizeUploadFolder } from "../../../../src/lib/uploadStorage";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = sanitizeUploadFolder(formData.get("folder"));

    if (!(file instanceof File)) {
      return Response.json({ error: "Không tìm thấy file upload." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return Response.json({ error: "Chỉ hỗ trợ upload hình ảnh." }, { status: 400 });
    }

    const { targetPath, url } = await createUploadTarget(file.name, folder);
    const bytes = await file.arrayBuffer();

    await writeFile(targetPath, Buffer.from(bytes));

    return Response.json({
      url,
    });
  } catch (error) {
    console.error("Failed to upload image", error);
    return Response.json(
      { error: "Không thể upload hình ảnh." },
      { status: 500 },
    );
  }
}
