import { writeFile } from "fs/promises";
import {
  createUploadTarget,
  sanitizeUploadFolder,
} from "../../../../src/lib/uploadStorage";

const ALLOWED_FILE_TYPES = {
  // Images
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
  // Documents
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
    ".pptx",
  ],
  "application/vnd.oasis.opendocument.text": [".odt"],
  "application/vnd.oasis.opendocument.spreadsheet": [".ods"],
  "text/plain": [".txt"],
  "application/zip": [".zip"],
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = sanitizeUploadFolder(formData.get("folder"));

    if (!(file instanceof File)) {
      return Response.json(
        { error: "Không tìm thấy file upload." },
        { status: 400 },
      );
    }

    const isAllowedType = ALLOWED_FILE_TYPES[file.type];

    if (!isAllowedType) {
      const supportedTypes = Object.keys(ALLOWED_FILE_TYPES).join(", ");
      return Response.json(
        {
          error: `Định dạng file không được hỗ trợ. Các định dạng được phép: ${supportedTypes}`,
        },
        { status: 400 },
      );
    }

    const { targetPath, url } = await createUploadTarget(file.name, folder);
    const bytes = await file.arrayBuffer();

    await writeFile(targetPath, Buffer.from(bytes));

    return Response.json({
      url,
      fileName: file.name,
      fileType: file.type,
    });
  } catch (error) {
    console.error("Failed to upload file", error);
    return Response.json({ error: "Không thể upload file." }, { status: 500 });
  }
}
