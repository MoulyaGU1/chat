export type User = {
	id: string; // Convex document id or UUID
	clerkId?: string; // Clerk user id
	name?: string | null;
	email?: string | null;
	imageUrl?: string | null;
	createdAt: string; // ISO timestamp
	lastActiveAt?: string | null; // ISO timestamp
};
