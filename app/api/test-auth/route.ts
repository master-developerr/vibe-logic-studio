import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export async function GET(req: NextRequest) {
  try {
    const { userId, getToken } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const token = await getToken({ template: "convex" });
    if (!token) {
      return NextResponse.json({ error: "No convex token" }, { status: 400 });
    }

    try {
      const res = await fetchMutation(api.users.ensureMyUser, {}, { token });
      return NextResponse.json({ success: true, userId: res, token });
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message, token });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
