"use client";
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TipTapMenuBar from "./TipTapMenuBar";
import { Button } from "./ui/button";
import { useDebounce } from "@/lib/useDebounce";
import { useMutation } from "@tanstack/react-query";
import Text from "@tiptap/extension-text";
import axios from "axios";
import { NoteType } from "@/lib/db/schema";
import { useCompletion } from "ai/react";
import toast from "react-hot-toast";

type Props = { note: NoteType };

const TipTapEditor = ({ note }: Props) => {
  const [editorState, setEditorState] = React.useState(
    note.editorState || `<h1>${note.name}</h1>`,
  );
  const { complete, completion } = useCompletion({
    api: "/api/completion",
  });

  const [loading, setLoading] = React.useState(false); // Loader state

  const saveNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/saveNote", {
        noteId: note.id,
        editorState,
      });
      return response.data;
    },
  });

  const handleShiftA = async () => {
    if (!editor) return;

    const prompt = editor.getText().split(" ").slice(-30).join(" ");

    setLoading(true); // Start loader
    toast.success("AI is thinking...", {
      icon: "🤔",
    });
    try {
      await complete(prompt);
      toast.success("AI Updated Text", {
        icon: "🤖",
      });
    } catch (err) {
      toast.error("something went wrong", {
        icon: "❌",
      });
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Shift-A": () => {
          handleShiftA(); // Reuse the same handler
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, customText],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });

  const lastCompletion = React.useRef("");

  React.useEffect(() => {
    if (!completion || !editor) return;
    const diff = completion.slice(lastCompletion.current.length);
    lastCompletion.current = completion;
    editor.commands.insertContent(diff);
  }, [completion, editor]);

  const debouncedEditorState = useDebounce(editorState, 500);
  React.useEffect(() => {
    if (debouncedEditorState === "") return;
    saveNote.mutate(undefined, {
      onSuccess: (data) => {
        ("");
      },
      onError: (err) => {
        console.error(err);
        toast.success("Something went wrong", {
          icon: "❌",
        });
      },
    });
  }, [debouncedEditorState]);

  return (
    <>
      <div className="flex">
        {editor && <TipTapMenuBar editor={editor} />}
        <Button disabled variant={"outline"}>
          {saveNote.isLoading ? "Saving..." : "Saved"}
        </Button>
      </div>

      <div className="prose prose-sm w-full mt-4">
        <EditorContent editor={editor} />
      </div>
      <div className="h-4"></div>
      <span className="text-sm">
        Tip: Press{" "}
        <button onClick={handleShiftA} disabled={loading}>
          <kbd
            className={`px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg ${
              loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
          >
            {loading ? "Loading..." : "Me"}
          </kbd>{" "}
        </button>
        for AI autocomplete
      </span>
    </>
  );
};

export default TipTapEditor;
