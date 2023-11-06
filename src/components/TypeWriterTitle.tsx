"use client";
import React from "react";
import TypeWriter from "typewriter-effect";
type Props = {};

const typeWriterTitle = (props: Props) => {
  return (
    <TypeWriter
      options={{
        loop: true,
      }}
      onInit={(typewriter) => {
        typewriter
          .typeString("🚀 Supercharged Productivity.")
          .start()
          .pauseFor(1000)
          .deleteAll()
          .typeString("🤖 AI-Powered Insights");
      }}
    />
  );
};

export default typeWriterTitle;
