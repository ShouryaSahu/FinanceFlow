import { account } from "./appwrite";
import { ID } from "appwrite";

// Register a new user
export const registerUser = async (name, email, password) => {
  return await account.create({
    userId: ID.unique(),
    email: email,
    password: password,
    name: name,
  });
};

// Login existing user
export const loginUser = async (email, password) => {
  return await account.createEmailPasswordSession({
    email: email,
    password: password,
  });
};

// Logout user
export const logoutUser = async () => {
  return await account.deleteSession({
    sessionId: "current",
  });
};

// Get current logged-in user
export const getCurrentUser = async () => {
  return await account.get();
};