import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import constantVariable from "../constant";
import { PrismaClient } from '@prisma/client';

const { ACCESS_TOKEN_SECRET } = constantVariable;
const prisma = new PrismaClient();

interface MyJwtPayload extends JwtPayload {
    id: number; // Define the structure of your JWT payload
    // Add other properties as needed
}

const verifyJwt = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            return res.status(400).json({ status: false, code: 500, msg: "Please login first" });
        }

        const decodeToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
        const userDetails = decodeToken as MyJwtPayload;
        
        const user = await prisma.user.findFirst({
            where: {
                id: userDetails.id
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });

        if (!user) {
            return res.status(404).json({ status: false, code: 404, msg: "User not found" });
        }

       req.customData = user
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, code: 500, msg: "Server error" });
    }
});

export { verifyJwt };
