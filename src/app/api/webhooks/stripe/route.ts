import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/src/server/db";

export async function POST(req: Request) {
	const body = await req.text();
	const sig = (await headers()).get("stripe-signature");
	if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-11-20.acacia" });
	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
	} catch (err: any) {
		return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
	}

	try {
		switch (event.type) {
			case "customer.subscription.created":
			case "customer.subscription.updated": {
				const subscription = event.data.object as Stripe.Subscription;
				const customerId = subscription.customer as string;
				const stripeSubscriptionId = subscription.id;
				const status = subscription.status.toUpperCase();
				const price = subscription.items.data[0]?.price?.id;
				const plan = price
					? await prisma.plan.findFirst({ where: { stripePriceId: price } })
					: await prisma.plan.findFirst({ where: { slug: "pro" } });
				await prisma.subscription.updateMany({
					where: { stripeCustomerId: customerId },
					data: {
						stripeSubscriptionId,
						status: status as any,
						planId: plan?.id ?? (await ensureProPlanId()),
						currentPeriodEnd: subscription.current_period_end
							? new Date(subscription.current_period_end * 1000)
							: null,
					},
				});
				break;
			}
			case "customer.subscription.deleted": {
				const subscription = event.data.object as Stripe.Subscription;
				const customerId = subscription.customer as string;
				await prisma.subscription.updateMany({
					where: { stripeCustomerId: customerId },
					data: { status: "CANCELED" as any },
				});
				break;
			}
			default:
				break;
		}
		return NextResponse.json({ received: true });
	} catch (err: any) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}

async function ensureProPlanId(): Promise<string> {
	const p = await prisma.plan.findUnique({ where: { slug: "pro" } });
	if (p) return p.id;
	const created = await prisma.plan.create({ data: { name: "Pro", slug: "pro", priceCents: 900, monthlyBookmarkLimit: 1000 } });
	return created.id;
}
