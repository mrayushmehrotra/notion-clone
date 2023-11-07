import { Clerk } from "@clerk/backend";

export const clerk = new Clerk({
  apiKey: process.env.CLERK_SECRET_KEY,
});
