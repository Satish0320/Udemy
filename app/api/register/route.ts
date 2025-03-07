import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"
import bcrypt from "bcrypt" 
import { Role } from "@prisma/client";

const signupSchema = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string(),
    role: z.string()
});

export async function POST(req: NextRequest){
    try {
        const body = await req.json();
        const result = signupSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({
                error: "Invalid Inputs",
                Details: result.error.format()
            },{status: 400})
        }

        const {email, name, password, role} = result.data;

        const existingUser = await prisma.user.findUnique({
            where: {email}
        })

        if (existingUser) {
            return NextResponse.json({
                message: "Email already exist"
            })
        }

        const hashpassword = await bcrypt.hash(password, 10);
        const validateRole : Role[] = ["STUDENT", "INSTRUCTOR", "ADMIN"]
        const userRole: Role = validateRole.includes(role as Role) ? (role as Role) : "STUDENT"    // complete this 
        
        
        const newUser = await prisma.user.create({
            data:{
                email,
                name,
                password: hashpassword,
                role: userRole
            }
        });

        return NextResponse.json({
            message: "User Created",
            User: newUser
        },{status: 200})
    } catch (e) {
        return NextResponse.json({
            error: "User Creation Failed",
            details: e
        },{status: 500})
    }
}   