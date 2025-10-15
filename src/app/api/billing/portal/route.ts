import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { stripe } from "@/server/stripe";
import prisma from "@/server/db";

export async function POST() {
	const session = (await getServerSession(authOptions as any)) as any;
	if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const user = await prisma.user.findUnique({ where: { email: session.user.email } });
	if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const sub = await prisma.subscription.findUnique({ where: { userId: user.id } });
	if (!sub?.stripeCustomerId) return NextResponse.json({ error: "No customer" }, { status: 400 });
	const portal = await stripe.billingPortal.sessions.create({
		customer: sub.stripeCustomerId,
		return_url: `${process.env.APP_URL}/dashboard`,
	});
	return NextResponse.json({ url: portal.url });
}
