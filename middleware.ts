// middleware.ts — cleaned version
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This middleware now does nothing special; it just lets all requests pass.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}


