// import GoogleProvider from "next-auth/providers/google";
import { type AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    // GoogleProvider({
    //   clientId: "process.env.GOOGLE_CLIENT_ID!",
    //   clientSecret: "process.env.GOOGLE_CLIENT_SECRET!",
    // }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: "hello123",
  },
  pages: {
    signIn: "/auth",
    signOut: "/signout",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.id = token.id;
      session.user.email = token.email;
      return session;
    },
  },
  secret: "hello123",
};
