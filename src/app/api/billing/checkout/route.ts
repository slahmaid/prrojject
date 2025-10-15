import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { stripe, getOrCreateCustomer } from "@/server/stripe";
import prisma from "@/server/db";

export async function POST() {
	const session = await getServerSession(authOptions as any);
	if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const user = await prisma.user.findUnique({ where: { email: session.user.email } });
	if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	await getOrCreateCustomer(user.id, user.email);
	const priceId = process.env.STRIPE_PRICE_PRO; // default to Pro; could accept tier param
	if (!priceId) return NextResponse.json({ error: "Missing price" }, { status: 500 });
	const checkout = await stripe.checkout.sessions.create({
		mode: "subscription",
		customer: (await prisma.subscription.findUnique({ where: { userId: user.id } }))?.stripeCustomerId,
		line_items: [{ price: priceId, quantity: 1 }],
		success_url: `${process.env.APP_URL}/dashboard?upgraded=1`,
		cancel_url: `${process.env.APP_URL}/pricing`,
		allow_promotion_codes: true,
	});
	return NextResponse.json({ url: checkout.url });
}
