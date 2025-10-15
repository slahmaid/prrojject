import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/server/auth";

export default async function AdminPage() {
	const session = (await getServerSession(authOptions as any)) as any;
	const role = session?.user?.role;
	if (!session || role !== "ADMIN") redirect("/");
	return (
		<div className="p-6">
			<h1 className="text-2xl font-semibold">Admin</h1>
			<p className="text-sm text-gray-600">Manage users and content (coming soon).</p>
		</div>
	);
}
