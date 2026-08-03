import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const rental = await prisma.rental.findUnique({
    where: { id: params.id },
    include: { tool: true },
  });

  if (!rental) return new Response("Not Found", { status: 404 });

  const isOwner = rental.tool.ownerId === session.user.id;
  const isRenter = rental.renterId === session.user.id;
  if (!isOwner && !isRenter && session.user.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }

  // Only allow status changes by non-renter
  if (body.status && isRenter) {
    return new Response("You cannot change rental status", { status: 403 });
  }

  const updated = await prisma.rental.update({
    where: { id: params.id },
    data: body,
  });
  return new Response(JSON.stringify(updated), { status: 200 });
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const rental = await prisma.rental.findUnique({
    where: { id: params.id },
    include: { tool: true },
  });

  if (!rental) return new Response("Not Found", { status: 404 });

  const isOwner = rental.tool.ownerId === session.user.id;
  const isRenter = rental.renterId === session.user.id;
  if (!isOwner && !isRenter && session.user.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }

  await prisma.rental.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}
