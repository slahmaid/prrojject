import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/server/db";
import { z } from "zod";
import { getCurrentMonthKey, getUserMonthlyLimit } from "@/lib/plans";

export async function GET() {
	const session = await getServerSession(authOptions as any);
	if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const user = await prisma.user.findUnique({ where: { email: session.user.email } });
	if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const bookmarks = await prisma.bookmark.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
	return NextResponse.json({ bookmarks });
}

const CreateSchema = z.object({ url: z.string().url(), title: z.string().optional(), notes: z.string().optional() });

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions as any);
	if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const user = await prisma.user.findUnique({ where: { email: session.user.email } });
	if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const json = await req.json();
	const parsed = CreateSchema.safeParse(json);
	if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

	const month = getCurrentMonthKey();
	const limit = await getUserMonthlyLimit(user.id);

	const usage = await prisma.usage.upsert({
		where: { userId_month: { userId: user.id, month } },
		create: { userId: user.id, month, bookmarksCreated: 0 },
		update: {},
	});
	if (usage.bookmarksCreated >= limit)
		return NextResponse.json({ error: "Monthly limit reached" }, { status: 402 });

	const created = await prisma.$transaction(async (tx) => {
		const b = await tx.bookmark.create({
			data: { userId: user.id, url: parsed.data.url, title: parsed.data.title, notes: parsed.data.notes },
		});
		await tx.usage.update({
			where: { userId_month: { userId: user.id, month } },
			data: { bookmarksCreated: { increment: 1 } },
		});
		return b;
	});

	return NextResponse.json({ bookmark: created });
}
