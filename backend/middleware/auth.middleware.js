import { verifyToken } from "@clerk/backend";
import dotenv from "dotenv";

dotenv.config({
  path: './.env'
});

export const verifyClerkToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    req.auth = { userId: payload.sub };

    next();
    
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
