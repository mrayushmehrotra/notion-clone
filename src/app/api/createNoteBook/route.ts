//  /api/createNoteBook

import { db } from "@/lib/db";
import { generateImage, generateImagePrompt } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { $notes } from "@/lib/db/schema";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 401 });
  }
  const body = await req.json();
  const { name } = body;
  const image_description = await generateImagePrompt(name);
  if (!image_description) {
    return new NextResponse("failed To generate Image description", {
      status: 500,
    });
  }
  const image_url = await generateImage(image_description);
  if (!image_url) {
    return new NextResponse("Failed to generate image, API ERROR!", {
      status: 500,
    });
  }
  try {
    const note_ids = await db
      .insert($notes)
      .values({
        name,
        userId,
        imageUrl: image_url,
      })
      .returning({
        insertedId: $notes.id,
      });
    return NextResponse.json({
      note_id: note_ids[0].insertedId,
    });
  } catch (error: any) {
    console.log(error.message);
    return new NextResponse("Failed TO Generate New Image", error);
  }
}
