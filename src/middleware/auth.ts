import { Request, Response, NextFunction } from "express";

const API_AUTH_TOKEN = process.env.API_AUTH_TOKEN;

export const authenticateRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log('Authenticating request...');
  console.log('Headers:', req.headers);
  
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('No auth header');
    return res.status(401).json({ error: "Authentication required" });
  }

  const token = authHeader.split(" ")[1];
  console.log('Token:', token);
  
  // Log all environment variables
  console.log('All environment variables:', process.env);
  
  const expectedToken = process.env.API_AUTH_TOKEN;
  console.log('Expected token:', expectedToken);
  
  if (!expectedToken) {
    console.log('Error: API_AUTH_TOKEN is not defined in environment variables');
    return res.status(500).json({ error: "Internal server error" });
  }
  
  if (token !== expectedToken) {
    console.log('Token mismatch');
    return res.status(401).json({ error: "Invalid authentication token" });
  }

  console.log('Authentication successful');
  next();
};