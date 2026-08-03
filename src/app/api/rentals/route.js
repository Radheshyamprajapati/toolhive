import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const rentals = await prisma.rental.findMany({
    where: {
      OR: [{ renterId: session.user.id }, { tool: { ownerId: session.user.id } }],
    },
    include: {
      tool: { include: { owner: { select: { name: true } } } },
      renter: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return new Response(JSON.stringify(rentals), { status: 200 });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { toolId, startDate, endDate } = body;

  const tool = await prisma.tool.findUnique({ where: { id: toolId } });
  if (!tool) return new Response("Tool not found", { status: 404 });

  const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const totalCost = days * tool.pricePerDay;

  const rental = await prisma.rental.create({
    data: {
      toolId,
      renterId: session.user.id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalCost,
    },
  });
  return new Response(JSON.stringify(rental), { status: 201 });
}
