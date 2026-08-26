import { createClerkClient } from '@clerk/clerk-sdk-node';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function run() {
  try {
    const user = await clerkClient.users.createUser({
      emailAddress: [`test${Date.now()}@example.com`],
      password: "StrongPassword123!@#",
      firstName: "Test",
      lastName: "User",
    });
    console.log("Created user:", user.id);
  } catch (err) {
    console.error(err);
  }
}
run();
