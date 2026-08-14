import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { rentalId } = await req.json();

  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
    include: { tool: { include: { owner: true } } },
  });

  if (!rental || rental.renterId !== session.user.id) {
    return new Response("Not Found", { status: 404 });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: rental.tool.name,
            description: `Rental from ${rental.startDate.toDateString()} to ${rental.endDate.toDateString()}`,
          },
          unit_amount: Math.round(rental.totalCost * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXTAUTH_URL}/rentals?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/rentals?canceled=true`,
    metadata: {
      rentalId,
    },
  });

  return new Response(JSON.stringify({ url: checkoutSession.url }), { status: 200 });
}
