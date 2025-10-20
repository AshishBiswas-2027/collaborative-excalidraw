import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export function middleware(req: Request, res: Response, next: NextFunction) {
    
    const token = req.headers["authorization"] ?? "";

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        
        if (decoded) {
            req.userId = decoded.userId;
            next();
        }
    } catch (error) {
        res.status(403).json({
            message: "Unauthorized"
        });
    }
}