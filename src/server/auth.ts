import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/server/db";
import { compare } from "bcryptjs";
import { z } from "zod";
import { sendWelcomeEmail } from "@/server/email";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		Credentials({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const parsed = z
					.object({ email: z.string().email(), password: z.string().min(6) })
					.safeParse(credentials);
				if (!parsed.success) return null;
				const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
				if (!user || !user.passwordHash) return null;
				const valid = await compare(parsed.data.password, user.passwordHash);
				if (!valid) return null;
				return { id: user.id, email: user.email, name: user.name, image: user.image } as any;
			},
		}),
	],
	events: {
		async signIn(message: any) {
			try {
				if (message.user?.email && message.isNewUser) {
					await sendWelcomeEmail(message.user.email);
				}
			} catch {}
		},
	},
	callbacks: {
		async session({ session, user }) {
			if (session.user) {
				(session.user as any).id = user.id;
				(session.user as any).role = (user as any).role;
			}
			return session;
		},
	},
	pages: {
		signIn: "/sign-in",
	},
	secret: process.env.NEXTAUTH_SECRET,
};
