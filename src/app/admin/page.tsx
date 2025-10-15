import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

export default async function AdminPage() {
	const session = await getServerSession(authOptions as any);
	const role = (session?.user as any)?.role;
	if (!session || role !== "ADMIN") redirect("/");
	return (
		<div className="p-6">
			<h1 className="text-2xl font-semibold">Admin</h1>
			<p className="text-sm text-gray-600">Manage users and content (coming soon).</p>
		</div>
	);
}
