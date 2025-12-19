import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const providers = [];

// Always include Credentials provider as fallback
providers.push(
  Credentials({
    name: "Wallet",
    credentials: {
      address: { label: "Wallet Address", type: "text" },
      signature: { label: "Signature", type: "text" },
      message: { label: "Message", type: "text" },
    },
    async authorize() {
      // This will be handled by the wallet endpoint
      return null;
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
