import { uploadFileToFirebase } from "@/lib/FIreabase";
import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { noteId } = await req.json();
    //extract daale image
    const notes = await db
      .select()
      .from($notes)
      .where(eq($notes.id, parseInt(noteId)));
    if (!notes[0].imageUrl) {
      return new NextResponse("no image url", { status: 500 });
    }
    //upload to firebase
    const firebase_url = await uploadFileToFirebase(
      notes[0].imageUrl,
      notes[0].name
    );
    await db
      .update($notes)
      .set({
        imageUrl: firebase_url,
      })
      .where(eq($notes.id, parseInt(noteId)));
    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
