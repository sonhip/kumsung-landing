import { access, readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

const MIME_BY_EXT = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".avif": "image/avif",
};

const getMimeType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_BY_EXT[ext] || "application/octet-stream";
};

const resolveUploadPath = (segments = []) => {
  const safeSegments = segments.filter(Boolean);
  const absolutePath = path.resolve(UPLOAD_ROOT, ...safeSegments);

  if (!absolutePath.startsWith(UPLOAD_ROOT + path.sep)) {
    return null;
  }

  return absolutePath;
};

export async function GET(_request, { params }) {
  try {
    const absolutePath = resolveUploadPath(params.path || []);

    if (!absolutePath) {
      return new Response("Invalid path", { status: 400 });
    }

    await access(absolutePath);
    const file = await readFile(absolutePath);

    return new Response(file, {
      status: 200,
      headers: {
        "Content-Type": getMimeType(absolutePath),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
