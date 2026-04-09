/**
 * Admin Authentication Check Endpoint
 * Verifies if user has admin role
 */

import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";
import { db } from "@/lib/prisma";
import { getLogger } from "@/lib/utils/logger";

const logger = getLogger('AdminAuthCheck');

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      logger.warn('Admin check: No session');
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        role: true,
        walletAddress: true,
      },
    });

    if (!user) {
      logger.warn('Admin check: User not found', { userId: session.user.id });
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const isAdmin = user.role === "admin";

    logger.debug('Admin check', { userId: user.id, isAdmin });

    return Response.json({
      isAdmin,
      userId: user.id,
      role: user.role,
    });
  } catch (error) {
    logger.error('Admin check failed', error instanceof Error ? error : undefined);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
