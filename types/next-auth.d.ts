import { flashDataType } from "@/lib/utils";
import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      isVerified: boolean;
      isAdmin: boolean;
    };
    flashDatas?: flashDataType[]
  }
}

// declare module "next-auth/jwt" {
//   interface JWT extends DefaultJWT {
    
//   }
// }
