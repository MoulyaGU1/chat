import { auth } from "@clerk/nextjs/server";

export function requireUserId(): string {
	const { userId } = auth();
	if (!userId) throw new Error("Unauthorized: no user");
	return userId;
}

export function getOptionalUserId(): string | null {
	const { userId } = auth();
	return userId ?? null;
}
