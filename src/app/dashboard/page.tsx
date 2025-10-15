import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/server/db";
import ClientForm from "@/components/bookmark-form";

export default async function DashboardPage() {
	const session = await getServerSession(authOptions as any);
	if (!session) redirect("/sign-in");
	const user = await prisma.user.findUnique({ where: { email: session.user?.email ?? undefined } });
	const bookmarks = user
		? await prisma.bookmark.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } })
		: [];
	return (
		<div className="p-6 space-y-6">
			<h1 className="text-2xl font-semibold">Dashboard</h1>
			<ClientForm />
			<div>
				<h2 className="text-xl font-medium mb-2">Your bookmarks</h2>
				<ul className="space-y-2">
					{bookmarks.map((b) => (
						<li key={b.id} className="border p-3 rounded">
							<a href={b.url} className="font-medium" target="_blank" rel="noreferrer">
								{b.title || b.url}
							</a>
							{b.notes ? <p className="text-sm text-gray-600">{b.notes}</p> : null}
							<p className="text-xs text-gray-500">{new Date(b.createdAt).toLocaleString()}</p>
						</li>
					))}
					{bookmarks.length === 0 && <p className="text-sm text-gray-600">No bookmarks yet.</p>}
				</ul>
			</div>
		</div>
	);
}
