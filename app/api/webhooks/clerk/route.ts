import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  let evt;
  try {
    evt = await verifyWebhook(req); // Automatically uses CLERK_WEBHOOK_SIGNING_SECRET
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Verification failed', { status: 400 });
  }

  const { id } = evt.data;

  if (evt.type === 'user.created' || evt.type === 'user.updated') {
    const { email_addresses, first_name, last_name, image_url } = evt.data;
    const email = email_addresses?.[0]?.email_address;
    const name = `${first_name ?? ''} ${last_name ?? ''}`.trim() || "User";
    
    try {
      await convex.mutation(api.users.syncUser, {
        clerkId: id as string,
        email: email as string,
        name,
        avatarUrl: image_url as string,
      });
    } catch (error) {
      console.error("Failed to sync user to Convex:", error);
      return new Response('Failed to sync to database', { status: 500 });
    }
  }

  if (evt.type === 'user.deleted') {
    try {
      await convex.mutation(api.users.deleteUser, { clerkId: id as string });
    } catch (error) {
      console.error("Failed to delete user in Convex:", error);
      return new Response('Failed to delete in database', { status: 500 });
    }
  }

  return new Response('OK', { status: 200 });
}
