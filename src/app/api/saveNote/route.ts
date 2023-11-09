import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = req.json();
    const { noteId, editorState } = body;
    if (!editorState || !noteId) {
      return new NextResponse("Missing editor State or id");
    }
    noteId = parseInt(noteId);
    const notes = await db.select().from($notes).where(eq($notes.id, noteId));

    if (notes.length != 1) {
      return new NextResponse("Falied to Update", { status: 500 });
    }

    const note = notes[0];
    if (note.editorState !== editorState) {
      await db
        .update($notes)
        .set({
          editorState,
        })
        .where(eq($notes.id, noteId));
    }
    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Internal Sever Error",
    });
  }
}
