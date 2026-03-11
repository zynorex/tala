import NextAuth, { type NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/prisma";
import { verifySignatureWithValidation } from "@/lib/auth/signature-verify";
import { getLogger } from "@/lib/utils/logger";

const logger = getLogger('NextAuth');

const providers: any[] = [];

// Credentials provider for Web3 wallet authentication
providers.push(
  Credentials({
    name: "Web3",
    credentials: {
      address: { label: "Wallet Address", type: "text" },
      signature: { label: "Signature", type: "text" },
      message: { label: "Message", type: "text" },
    },
    async authorize(credentials) {
      if (!credentials?.address || !credentials?.signature || !credentials?.message) {
        logger.warn('Missing authentication credentials');
        throw new Error("Missing credentials");
      }

      try {
        // Verify signature with validation
        const verification = await verifySignatureWithValidation(
          credentials.message,
          credentials.signature,
          credentials.address,
          300 // 5 minute expiration
        );

        if (!verification.valid) {
          logger.warn('Invalid signature', { address: credentials.address, error: verification.error });
          throw new Error(verification.error || "Invalid signature");
        }

        // Get or create user
        let user = await db.user.findUnique({
          where: { walletAddress: credentials.address.toLowerCase() },
        });

        if (!user) {
          logger.info('Creating new user', { address: credentials.address });
          user = await db.user.create({
            data: {
              walletAddress: credentials.address.toLowerCase(),
              plan: "FREE",
              role: "user",
            },
          });
        }

        // Check if user is blocked
        if (user.isBlocked) {
          logger.warn('Blocked user attempted login', { userId: user.id });
          throw new Error("Your account has been suspended");
        }

        logger.info('User authenticated', { userId: user.id, address: credentials.address });

        return {
          id: user.id,
          name: user.walletAddress,
          email: user.email,
          image: null,
        };
      } catch (error) {
        logger.error('Authentication failed', error instanceof Error ? error : undefined);
        throw error;
      }
    },
  })
);

// Add Google if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Refresh every 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers,
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // ── Invite-only gate ────────────────────────────────────────────────
      // Login is restricted to emails explicitly added to the AllowedEmail
      // table by an admin.  Wallet-based (Web3) logins are also blocked
      // unless the wallet owner has an allowlisted email on file.
      const userEmail = user.email?.toLowerCase();

      if (account?.provider === "google") {
        if (!userEmail) {
          logger.warn('Google sign-in blocked: no email on Google account');
          throw new Error("NoEmail");
        }

        const allowed = await db.allowedEmail.findUnique({
          where: { email: userEmail },
        });
        if (!allowed) {
          logger.warn('Google sign-in blocked: email not on allowlist', { email: userEmail });
          throw new Error("NotAllowed");
        }
      }

      // For Web3 logins, allow only if the wallet already has a user with
      // an allowlisted email, or if the platform is open (no allowlist rows
      // exist at all — this keeps wallet auth working in dev).
      if (account?.provider === "credentials") {
        const allowlistCount = await db.allowedEmail.count();
        if (allowlistCount > 0) {
          // Allowlist is active — wallet user must have an allowlisted email.
          const existingUser = await db.user.findUnique({
            where: { walletAddress: (user.name ?? '').toLowerCase() },
            select: { email: true },
          });
          if (!existingUser?.email) {
            logger.warn('Web3 sign-in blocked: wallet has no email linked', { wallet: user.name });
            throw new Error("NotAllowed");
          }
          const allowed = await db.allowedEmail.findUnique({
            where: { email: existingUser.email.toLowerCase() },
          });
          if (!allowed) {
            logger.warn('Web3 sign-in blocked: linked email not on allowlist', { email: existingUser.email });
            throw new Error("NotAllowed");
          }
        }
      }

      // ── Google user upsert (existing logic) ─────────────────────────────
      // For OAuth providers (Google), ensure a User row exists in the database
      if (account?.provider === "google" && user.email) {
        try {
          const existing = await db.user.findUnique({
            where: { email: user.email },
          });
          if (!existing) {
            const created = await db.user.create({
              data: {
                email: user.email,
                name: user.name ?? undefined,
                image: user.image ?? undefined,
                emailVerified: new Date(),
                plan: "FREE",
                role: "user",
                authMethods: ["google"],
              },
            });
            // Store the database ID so the JWT callback can use it
            user.id = created.id;
          } else {
            user.id = existing.id;
          }
        } catch (err) {
          logger.error('Failed to upsert Google user', err instanceof Error ? err : undefined);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      if (account?.provider === "google") {
        token.provider = "google";
      } else if (account?.provider === "credentials") {
        token.provider = "web3";
      }

      // Ensure token.id is always a real database CUID.
      // Stale JWTs (issued before the signIn-callback fix) may still
      // carry the Google profile sub ID instead of the DB user ID.
      if (
        token.provider === "google" &&
        token.email &&
        !token.dbIdResolved
      ) {
        try {
          const dbUser = await db.user.findUnique({
            where: { email: token.email as string },
            select: { id: true },
          });
          if (dbUser) {
            token.id = dbUser.id;
          }
        } catch (e) {
          logger.error('JWT: failed to resolve DB user id', e instanceof Error ? e : undefined);
        }
        token.dbIdResolved = true;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).provider = token.provider;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Only allow redirects to the same origin
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  events: {
    async signIn({ user, account }) {
      logger.info('User signed in', { userId: user.id, provider: account?.provider });
    },
    async signOut() {
      logger.info('User signed out');
    },
    async error({ error }) {
      logger.error('Auth error', new Error(error));
    },
  },
};

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
