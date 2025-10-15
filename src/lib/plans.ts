import { Plan } from "@prisma/client";
import prisma from "../server/db";
import { getCurrentMonthKey } from "./date";
import { DEFAULT_LIMITS } from "./plans-constants";

export async function ensureDefaultPlans(): Promise<Plan[]> {
	const existing = await prisma.plan.findMany();
	if (existing.length > 0) return existing;
	const created = await prisma.$transaction([
		prisma.plan.create({
			data: {
				name: "Free",
				slug: "free",
				priceCents: 0,
				monthlyBookmarkLimit: DEFAULT_LIMITS.FREE,
			},
		}),
		prisma.plan.create({
			data: {
				name: "Pro",
				slug: "pro",
				priceCents: 900,
				monthlyBookmarkLimit: DEFAULT_LIMITS.PRO,
			},
		}),
		prisma.plan.create({
			data: {
				name: "Business",
				slug: "business",
				priceCents: 4900,
				monthlyBookmarkLimit: DEFAULT_LIMITS.BUSINESS,
			},
		}),
	]);
	return created as unknown as Plan[];
}

export async function getUserMonthlyLimit(userId: string): Promise<number> {
	await ensureDefaultPlans();
	const sub = await prisma.subscription.findUnique({
		where: { userId },
		include: { plan: true },
	});
	if (sub?.plan?.monthlyBookmarkLimit != null) return sub.plan.monthlyBookmarkLimit;
	return DEFAULT_LIMITS.FREE;
}

export { getCurrentMonthKey };

