import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const signAccessToken = (payload) => {  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
};

export const signRefreshToken = (payload) => {  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};