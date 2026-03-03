export type Message = {
	id: string;
	conversationId: string;
	senderId: string;
	content: string | null; // null if deleted
	createdAt: string; // ISO timestamp
	editedAt?: string | null;
	deleted?: boolean;
	replyToMessageId?: string | null;
};
