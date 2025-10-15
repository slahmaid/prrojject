import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function sendWelcomeEmail(to: string) {
	if (!process.env.RESEND_API_KEY) return;
	await resend.emails.send({
		from: "MVP App <noreply@example.com>",
		to,
		subject: "Welcome to MVP App",
		html: `<p>Thanks for signing up! You're ready to save bookmarks.</p>`
	});
}
