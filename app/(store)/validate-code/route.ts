import { backendClient } from "@/sanity/lib/backendClient";
import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

async function validateAccessCode(code: string) {
  const query = `*[_type == "accessCode" && code == $code && isUsed == false][0]`;
  return await backendClient.fetch(query, { code });
}

export async function POST(req: NextRequest) {
  try {
    const { code, userId } = await req.json();

    if (!code || !userId) {
      return NextResponse.json({ error: "Cod sau utilizator lipsă" }, { status: 400 });
    }

    const existingCode = await validateAccessCode(code);

    if (!existingCode) {
      return NextResponse.json({ error: "Cod invalid sau deja folosit" }, { status: 404 });
    }

    await backendClient.patch(existingCode._id).set({ isUsed: true, userId }).commit();
    const clerk =await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        hasCourseAccess: true,
      },
    });

    console.log(`Codul ${code} a fost folosit de utilizatorul ${userId}.`);
    return NextResponse.json({ success: true, message: "Cod valid. Acces permis!" }, { status: 200 });
  } catch (error) {
    console.error("Eroare validare cod:", error);
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}
