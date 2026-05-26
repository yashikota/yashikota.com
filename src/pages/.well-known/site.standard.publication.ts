import { createPublicationWellKnownResponse } from "@/lib/standard-site";

export const prerender = true;

export function GET(): Response {
  return createPublicationWellKnownResponse();
}
