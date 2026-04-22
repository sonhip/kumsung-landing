import { access, mkdir, rm } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "./prisma";

export const LOCAL_UPLOAD_PREFIX = "/uploads/";
const IMMUTABLE_UPLOAD_PREFIX = "/uploads/seed/";
const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const ALLOWED_UPLOAD_FOLDERS = new Set([
  "general",
  "media",
  "products",
  "editor",
  "seed",
]);

export const isLocalUploadUrl = (value) =>
  typeof value === "string" && value.startsWith(LOCAL_UPLOAD_PREFIX);

export const isImmutableUploadUrl = (value) =>
  typeof value === "string" && value.startsWith(IMMUTABLE_UPLOAD_PREFIX);

export const sanitizeUploadFolder = (value) =>
  ALLOWED_UPLOAD_FOLDERS.has(value) ? value : "general";

export const ensureUploadDir = async (folder) => {
  const safeFolder = sanitizeUploadFolder(folder);
  const targetDir = path.join(UPLOAD_ROOT, safeFolder);
  await mkdir(targetDir, { recursive: true });
  return targetDir;
};

export const createUploadUrl = (fileName, folder = "general") =>
  `/uploads/${sanitizeUploadFolder(folder)}/${fileName}`;

export const createUploadTarget = async (originalName, folder = "general") => {
  const targetDir = await ensureUploadDir(folder);
  const extension = path.extname(originalName) || ".png";
  const safeName = `${Date.now()}-${randomUUID()}${extension}`;

  return {
    safeName,
    targetPath: path.join(targetDir, safeName),
    url: createUploadUrl(safeName, folder),
  };
};

const resolveLocalUploadPath = (url) => {
  if (!isLocalUploadUrl(url)) {
    return null;
  }

  const relativePath = url.replace(LOCAL_UPLOAD_PREFIX, "");
  return path.join(UPLOAD_ROOT, relativePath);
};

const hasReferenceToUpload = async (url) => {
  const [
    mediaCount,
    productImageCount,
    productContentCount,
    teamMemberCount,
    newsCoverCount,
    newsContentCount,
  ] =
    await Promise.all([
    prisma.mediaAsset.count({
      where: {
        imageUrl: url,
      },
    }),
    prisma.productImage.count({
      where: {
        url,
      },
    }),
    prisma.product.count({
      where: {
        contentHtml: {
          contains: url,
        },
      },
    }),
    prisma.teamMember.count({
      where: {
        imageUrl: url,
      },
    }),
    prisma.newsPost.count({
      where: {
        coverImage: url,
      },
    }),
    prisma.newsPost.count({
      where: {
        contentHtml: {
          contains: url,
        },
      },
    }),
    ]);

  return (
    mediaCount > 0 ||
    productImageCount > 0 ||
    productContentCount > 0 ||
    teamMemberCount > 0 ||
    newsCoverCount > 0 ||
    newsContentCount > 0
  );
};

export const deleteUploadIfUnused = async (url) => {
  if (!isLocalUploadUrl(url) || isImmutableUploadUrl(url)) {
    return;
  }

  const stillReferenced = await hasReferenceToUpload(url);

  if (stillReferenced) {
    return;
  }

  const localPath = resolveLocalUploadPath(url);

  if (!localPath) {
    return;
  }

  try {
    await access(localPath);
    await rm(localPath, { force: true });
  } catch {
    // Ignore missing files to keep delete/update operations idempotent.
  }
};
