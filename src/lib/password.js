import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const SALT_BYTES = 16;
const KEY_LENGTH = 64;

export const hashPassword = (password) => {
  const salt = randomBytes(SALT_BYTES).toString("hex");
  const derived = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${derived}`;
};

export const verifyPassword = (password, hash) => {
  if (!password || !hash || !hash.includes(":")) {
    return false;
  }

  const [salt, stored] = hash.split(":");

  if (!salt || !stored) {
    return false;
  }

  const derived = scryptSync(password, salt, KEY_LENGTH);
  const storedBuffer = Buffer.from(stored, "hex");

  if (derived.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(derived, storedBuffer);
};
