import bcrypt from "bcrypt";

export async function hashPassword(plainTextPassword: string) {
  // Notice the argument
  const saltRounds = 12;
  return await bcrypt.hash(plainTextPassword, saltRounds);
}
