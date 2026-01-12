// utils/password.js
import argon2 from "argon2";

export async function hashPassword(plainPassword) {
  return await argon2.hash(plainPassword);
}

export async function verifyPassword(hash, plainPassword) {
  return await argon2.verify(hash, plainPassword);
}
