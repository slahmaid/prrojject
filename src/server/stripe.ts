import Stripe from "stripe";
import prisma from "@/src/server/db";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
	apiVersion: "2024-11-20.acacia",
});

export async function getOrCreateCustomer(userId: string, email: string) {
	const sub = await prisma.subscription.findUnique({ where: { userId } });
	if (sub?.stripeCustomerId) {
		return await stripe.customers.retrieve(sub.stripeCustomerId);
	}
	const customer = await stripe.customers.create({ email });
	await prisma.subscription.upsert({
		where: { userId },
		create: {
			userId,
			planId: (await ensureFreePlanId()),
			status: "ACTIVE",
			stripeCustomerId: customer.id,
		},
		update: { stripeCustomerId: customer.id },
	});
	return customer;
}

async function ensureFreePlanId(): Promise<string> {
	const p = await prisma.plan.findUnique({ where: { slug: "free" } });
	if (p) return p.id;
	const created = await prisma.plan.create({ data: { name: "Free", slug: "free", priceCents: 0, monthlyBookmarkLimit: 3 } });
	return created.id;
}
