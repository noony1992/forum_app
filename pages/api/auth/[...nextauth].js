import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from '@prisma/client'
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient()

export default NextAuth({
  providers: [
    CredentialsProvider({     
      async authorize(credentials) {        
        const { username, password } = credentials;
         
        const user = await prisma.user.findMany({
          where: {
            username: username,
            password: password,
          }
        })
        delete user[0].password;

        if (user) {
          // Return the user object if authentication is successful
          return user;
        } else {
          // Return null or false if authentication fails
          return null;
        }
        
      },
    }),
  ],
  pages: {
      signIn: "/login", //Need to define custom login page (if using)
  },
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
      jwt: async ({ token, user }) => {
        user && (token.user = user);
        return token;
      },
      session: async ({ session, token, user }) => {
        session.user = token.user;  // Setting token in session
        return session;
      },
    },
});

