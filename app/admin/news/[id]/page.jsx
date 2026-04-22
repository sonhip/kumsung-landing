import { notFound } from "next/navigation";
import NewsEditor from "../../../../src/components/admin/NewsEditor";
import { getAdminMediaAssets } from "../../../../src/lib/cms";
import { prisma } from "../../../../src/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminNewsEditPage({ params }) {
  const [item, mediaLibrary] = await Promise.all([
    prisma.newsPost.findUnique({
      where: { id: params.id },
    }),
    getAdminMediaAssets(),
  ]);

  if (!item) {
    notFound();
  }

  return <NewsEditor mode="edit" initialItem={item} mediaLibrary={mediaLibrary} />;
}
