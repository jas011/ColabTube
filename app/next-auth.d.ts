import { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      onboarded: boolean;
    } & DefaultSession["user"];
  }

  interface JWT extends DefaultJWT {
    id: string;
    onboarded: boolean;
  }
}
