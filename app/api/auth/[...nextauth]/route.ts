import { handlers } from "@/lib/auth/auth";

export async function GET(req: any, ctx: any) {
  return handlers.GET(req, ctx);
}

export async function POST(req: any, ctx: any) {
  return handlers.POST(req, ctx);
}
