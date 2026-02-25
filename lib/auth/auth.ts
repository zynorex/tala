import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const providers = [];

// Always include Credentials provider for wallet-based authentication
providers.push(
  Credentials({
    name: "Wallet",
    credentials: {
      address: { label: "Wallet Address", type: "text" },
      signature: { label: "Signature", type: "text" },
      message: { label: "Message", type: "text" },
    },
    async authorize(credentials) {
      try {
        if (!credentials?.address || !credentials?.signature || !credentials?.message) {
          return null;
        }

        const address = credentials.address as string;
        const signature = credentials.signature as string;
        const message = credentials.message as string;

        // Validate address format
        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
          return null;
        }

        // Verify the EIP-191 personal_sign signature using viem
        const { verifyMessage } = await import('viem');
        const isValid = await verifyMessage({
          address: address as `0x${string}`,
          message,
          signature: signature as `0x${string}`,
        });

        if (!isValid) {
          console.warn(`NextAuth wallet auth: signature mismatch for ${address}`);
          return null;
        }

        // Find or create the user in the database
        const { prisma } = await import('@/lib/prisma');

        let user = await prisma.user.findFirst({
          where: {
            accounts: {
              some: {
                providerAccountId: address.toLowerCase(),
                provider: 'wallet',
              },
            },
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              displayName: `Wallet ${address.slice(0, 6)}...${address.slice(-4)}`,
              accounts: {
                create: {
                  provider: 'wallet',
                  providerAccountId: address.toLowerCase(),
                  type: 'oauth',
                },
              },
            },
          });
        }

        return {
          id: user.id,
          name: user.displayName || user.name,
          email: user.email,
          image: user.image,
        };
      } catch (error) {
        console.error('NextAuth wallet authorize error:', error);
        return null;
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

export const auth = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers,
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.image = user.image;
      }
      if (account?.provider === "google") {
        token.provider = "google";
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
  },
});

export const { signIn, signOut } = auth;

