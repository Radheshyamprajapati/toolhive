import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  const owner = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true, name: true, location: true, avatar: true, createdAt: true,
    },
  });

  const tools = await prisma.tool.findMany({
    where: { ownerId: params.id },
    include: { owner: { select: { name: true } } },
  });

  return new Response(JSON.stringify({ owner, tools }), { status: 200 });
}
