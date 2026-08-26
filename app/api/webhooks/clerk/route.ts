import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
    return new Response('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or Vercel', {
      status: 500,
    });
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    console.error("NEXT_PUBLIC_CONVEX_URL environment variable is missing on server");
    return new Response("Database URL not configured", { status: 500 });
  }

  const convex = new ConvexHttpClient(convexUrl);

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
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

  return new Response('', { status: 200 });
}
