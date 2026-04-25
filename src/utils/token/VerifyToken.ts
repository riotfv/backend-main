import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "default-secret";

export function verifyTokenAPI(token: string) {
  try {
    const decoded = jwt.verify(token, CLIENT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

export function bValidUsername(input: string): string[] {
  const regex = /[^a-zA-Z0-9\s]/g;
  const disallowedCharacters = input.match(regex);

  const filteredDisallowedCharacters = disallowedCharacters
    ? disallowedCharacters.filter((char) => char !== " ")
    : [];
  return filteredDisallowedCharacters;
}
