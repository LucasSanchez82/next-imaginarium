import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { sessionSchema } from "./schemas/authSchemas";
import { sessionType } from "./types/authTypes";



export const authOptions: NextAuthOptions = {
  // This is a temporary fix for prisma client.
  // @see https://github.com/prisma/prisma/issues/16117
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        const isPasswordOk = await compare(
          credentials.password,
          user?.password!
        );
        if (!user || !isPasswordOk) {
          return null;
        }
        
        const newSession = {
          id: user.id!, //obliger de mettre id
          email: user.email!,
          name: user.name!,
          isAdmin: Boolean(user.isAdmin),
          isVerified: Boolean(user.isVerified),
        }
        const safeNewSession = sessionSchema.safeParse(newSession);

        if(safeNewSession.success){
          return safeNewSession.data; //j'envoi les donnees qui sont safes et donc suite dans jwt..

        }else {
          console.error('error auth options, credential provider safeparse session : ', safeNewSession.error)
          return null;
        }

      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user, profile, isNewUser }) => {    //token recupere ce qui a ete retourne par le provider   
      // je destructure sinon les variables sont undefined
      // je luis dis tkt t es un sessionType (j'ai menti en vrai on sait pas) du coup je verifie quand meme apres
      // avec safeParse
      const customToken = { ...token, ...user } as sessionType;
      const newSession = {
        email: customToken.email,
        name: customToken.name,
        isAdmin: customToken.isAdmin,
        isVerified: customToken.isVerified,
        id: customToken.id,
      }

      const safeNewSession = sessionSchema.safeParse(newSession);
      if (safeNewSession.success) {
        return safeNewSession.data
      }else {
        throw Error('autOPtions jwt type Error : \nZodError : ' + safeNewSession.error.message)
      }
    },
    session: ({ session, user, token }) => { //token recuperer ce qu a retourner jwt
      // console.log(token);
      console.log(session);
      const safeToken = sessionSchema.safeParse(token)
      if(safeToken.success){
        return {
          ...session,
          user: {
            ...session.user,
            ...safeToken.data,
          },
        };
      }else {
        throw Error('aut Options session():\nErreur de types:\nZodError: ' + safeToken.error.message);
      }

    },
  },
};
