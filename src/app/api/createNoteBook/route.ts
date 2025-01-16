import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { createClient } from "pexels";
import toast from "react-hot-toast";

const PEXELS_API_KEY = process.env.PEXEL_API_KEY;

// Type definition for the expected response structure
interface PexelsImage {
  original: string;
}

// Function to get image URL from Pexels API based on search term
async function getImageFromPexels(query: string): Promise<string | null> {
  try {
    // Initialize Pexels client with the API key
    const client = createClient(PEXELS_API_KEY!);

    // Fetch images from Pexels based on the query
    //
    const imageSearch: any = await client.photos.search({
      query,
      per_page: 1, // Limit to 1 result
    });

    // Check if photos are available in the response
    if (imageSearch.photos.length > 0) {
      // Return the original image URL
      const result: PexelsImage = imageSearch.photos[0].src;

      return result.original; // This is the original image URL
    } else {
      console.log("No image found for the query:", query);

      return null;
    }
  } catch (error) {
    // If an error occurs, log it and return null
    console.error("Error fetching image from Pexels:", error);
    return null;
  }
}

export { getImageFromPexels };

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { name } = body;

  // Fetch the image URL from Pexels based on the notebook name
  const imageUrl = await getImageFromPexels(name);

  if (!imageUrl) {
    return new NextResponse("Failed to generate image", { status: 500 });
  }

  // Insert the notebook data into the database
  const noteIds = await db
    .insert($notes)
    .values({
      name,
      userId,
      imageUrl,
    })
    .returning({
      insertedId: $notes.id,
    });

  return NextResponse.json({
    note_id: noteIds[0].insertedId,
  });
}
