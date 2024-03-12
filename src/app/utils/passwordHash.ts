import prisma from "@/app/db";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

// Function to hash a password
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

// Function to create a user with a hashed password
async function createUser(
  email: string,
  name: string,
  password: string,
  roles?: Role[],
): Promise<void> {
  const hashedPassword = await hashPassword(password);
  if (!roles) roles = [];

  const user = await prisma.users.create({
    data: {
      email,
      name,
      password: hashedPassword,
      roles: [...roles],
    },
  });
  console.log("User created:", user);
}
