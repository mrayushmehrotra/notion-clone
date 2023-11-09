"use client";
import React from "react";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  noteId: number;
};

const DeleteButton = ({ noteId }: Props) => {
  const router = useRouter();
  const deleteNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/deleteNote", { noteId });
      return response.data;
    },
  });
  return (
    <Button
      size="sm"
      variant={"destructive"}
      disabled={deleteNote.isPending}
      onClick={() => {
        const confirm = window.confirm("Are you sure to delete this notebook");
        if (!confirm) {
          return;
        }
        deleteNote.mutate(undefined, {
          onSuccess: () => {
            router.push("/dashboard");
          },
          onError: (error) => {
            console.log(error);
            window.alert("Something Went Wrong");
          },
        });
      }}
    >
      <Trash />
    </Button>
  );
};

export default DeleteButton;
