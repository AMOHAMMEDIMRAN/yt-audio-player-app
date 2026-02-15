import type { Request, Response } from "express";
import { prisma } from "../database/db";


export class AuthService{
    static async register(email: string) {
        const existingUser = await prisma.user.findUnique({where: {email}});
        if(existingUser){
            
        }
    }
}