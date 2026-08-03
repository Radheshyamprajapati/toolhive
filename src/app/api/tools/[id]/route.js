import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
  const tool = await prisma.tool.findUnique({
    where: { id: params.id },
    include: { owner: { select: { name: true, avatar: true } } },
  });
  if (!tool) return new Response("Not Found", { status: 404 });
  return new Response(JSON.stringify(tool), { status: 200 });
}

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const existing = await prisma.tool.findUnique({ where: { id: params.id } });

  if (!existing) return new Response("Not Found", { status: 404 });
  if (existing.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }

  const updated = await prisma.tool.update({
    where: { id: params.id },
    data: body,
    include: { owner: { select: { name: true, avatar: true } } },
  });
  return new Response(JSON.stringify(updated), { status: 200 });
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const existing = await prisma.tool.findUnique({ where: { id: params.id } });
  if (!existing) return new Response("Not Found", { status: 404 });
  if (existing.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }

  await prisma.tool.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}
