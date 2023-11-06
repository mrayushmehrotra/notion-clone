"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Separator } from "@radix-ui/react-separator";
import CreateNotesDialog from "@/components/CreateNotesDialog";
type Props = {};

const page = (props: Props) => {
  return (
    <>
      <div className="grainy min-h-screen">
        <div className="max-w-7xl mx-auto p-10">
          <div className="flex justify-between items-center md:flex-row flex-col">
            <div className="flex items-center">
              <Link href="/">
                <Button className="bg-green-600" size="sm">
                  <ArrowLeft className="mr-1 w-4 h-5" />
                  Back
                </Button>
              </Link>
              <div className="w-4"></div>
              <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
              <div className="w-4"></div>
              <UserButton />
            </div>
          </div>
          <div className="h-8"></div>
          <Separator />
          <div className="h-8"></div>
          <div className="text-center">
            <h2 className="text-xl text-gray-800"> You have no notes yet</h2>
          </div>
          {/* display all the notes */}
          <div className="grid sm:grid-cols-3 md:grid-col-5 grid-cols-1 gap-3">
            <CreateNotesDialog />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
