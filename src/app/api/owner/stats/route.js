import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TRADESMAN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const startOfDay = new Date(); startOfDay.setHours(0,0,0,0);
  const startOfWeek = new Date(startOfDay); startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
  const startOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), 1);

  async function earningsSince(date) {
    const result = await prisma.rental.aggregate({
      where: {
        status: "COMPLETED",
        tool: { ownerId: session.user.id },
        endDate: { gte: date }
      },
      _sum: { totalCost: true }
    });
    return result._sum.totalCost || 0;
  }

  const [daily, weekly, monthly, total] = await Promise.all([
    earningsSince(startOfDay),
    earningsSince(startOfWeek),
    earningsSince(startOfMonth),
    prisma.rental.aggregate({
      where: { status: "COMPLETED", tool: { ownerId: session.user.id } },
      _sum: { totalCost: true }
    }).then(r => r._sum.totalCost || 0)
  ]);

  return new Response(JSON.stringify({ daily, weekly, monthly, total }), { status: 200 });
}
