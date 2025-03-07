
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
// console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
// console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                email:{label: "Email", type: "email"},
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials){
                if (!credentials?.email || !credentials.password) return null;

                const user = await prisma.user.findUnique({
                    where:{
                        email: credentials.email
                    }
                });

                if (!user || !user.password) {
                    throw new Error("User not found or invalid credentials");
                }

                const isvalidPassword =await bcrypt.compare(credentials.password, user.password);

                if (!isvalidPassword) {
                    throw new Error("Invalid password")
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            }
        })
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === "google" && profile?.email) {

                let user = await prisma.user.findUnique({
                    where: { email: profile.email }
                });

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            email: profile.email,
                            name: profile.name,
                            role: Role.STUDENT,
                            accounts: {
                                create: {
                                    providerType: account.type,
                                    providerId: account.provider,
                                    providerAccountId: account.providerAccountId,
                                }
                            }
                        }
                    });
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (token) {
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({ user, token }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        }
    },
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);