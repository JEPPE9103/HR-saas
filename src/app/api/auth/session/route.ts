import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  // Placeholder: later issue session cookie using Firebase Admin
  const ck = cookies().get("session")?.value ?? null;
  return NextResponse.json({ session: ck ? true : false });
}


