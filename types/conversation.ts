export type Conversation = {
	id: string;
	isGroup?: boolean;
	name?: string | null;
	memberIds: string[]; // user ids
	lastMessageAt?: string | null; // ISO timestamp
	createdAt: string; // ISO timestamp
};
