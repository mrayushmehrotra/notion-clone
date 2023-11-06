import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import { $notes } from "@/lib/db/schema";
import Link from "next/link";

type Props = {
  params: {
    noteId: string;
  };
};

const NotebookPage = async ({ params: { noteId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/dashboard");
  }

  const notes = await db
    .select()
    .from($notes)
    .where(and(eq($notes.id, parseInt(noteId)), eq($notes.userId, userId)));

  if (notes.length != 1) {
    return redirect("/dashboard");
  }
  const note = notes[0];
  return (
    <>
      <div className="min-h-screen grainy p-8">
        <div className="max-w-4xl mx-auto">
          <div className="border shadow-xl border-stone-200 rounded-lg p-4 flex items-center">
            <Link href="/dashboard"></Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotebookPage;
