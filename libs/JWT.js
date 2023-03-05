import JWT from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../credentials.js";

export function getSessionTokenFromUserId(userId) {
  const token = JWT.sign({ userId: userId }, JWT_SECRET_KEY, { expiresIn: 24 * 60 * 60 });
  return token;
}

export function getDecryptedToken(token) {
  try {
    const userObject = JWT.verify(token, JWT_SECRET_KEY);
    return userObject;
  } catch (e) {
    return null;
  }
}
