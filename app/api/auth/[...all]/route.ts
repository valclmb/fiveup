import { auth } from "@/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);
export const { POST, GET, PATCH, PUT, DELETE } = handler;