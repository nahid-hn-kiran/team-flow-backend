import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { ILoginPayload, IRegisterPayload } from "./auth.interface";

const registerUser = async (payload: IRegisterPayload) => {
  const { name, email, password } = payload;

  const isUserExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExists) {
    throw new Error("User already exists");
  }

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  if (!data) {
    throw new Error("Failed to register user.");
  }

  return data;
};

const loginUser = async (payload: ILoginPayload) => {
  const { email, password } = payload;

  const isUserExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!isUserExists) {
    throw new Error("No user exists with the email.");
  }

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (!data) {
    throw new Error("Failed to register user.");
  }

  return data;
};

export const authService = {
  registerUser,
  loginUser,
};
