"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

export const sendChatNotificationEmail = action({
  args: {
    userEmail: v.string(),
    senderName: v.string(),
    messageContent: v.string(),
  },
  handler: async (ctx, args) => {
    // ✅ Move the constructor INSIDE the handler
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set in the Convex Dashboard");
      return;
    }

    const resend = new Resend(apiKey);

    try {
      await resend.emails.send({
        from: "ChatApp <onboarding@resend.dev>",
        to: [args.userEmail],
        subject: `New message from ${args.senderName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>New Message from ${args.senderName}</h2>
            <p>${args.messageContent}</p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  },
});