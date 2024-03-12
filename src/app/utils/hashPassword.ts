import bcrypt from "bcryptjs";

export async function hashPassword(plainTextPassword: string) {
  const saltRounds = 12;
  return await bcrypt.hash(plainTextPassword, saltRounds);
}
