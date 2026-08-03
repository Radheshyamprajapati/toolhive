import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const tools = await prisma.tool.findMany({
    include: { owner: { select: { name: true, avatar: true } } },
    orderBy: { createdAt: "desc" },
  });
  return new Response(JSON.stringify(tools), { status: 200 });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const tool = await prisma.tool.create({
    data: {
      ...body,
      ownerId: session.user.id,
    },
    include: { owner: { select: { name: true, avatar: true } } },
  });
  return new Response(JSON.stringify(tool), { status: 201 });
}
