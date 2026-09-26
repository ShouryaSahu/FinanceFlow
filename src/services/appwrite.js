import { Client, Account, Databases } from "appwrite";

// Creating appwrite client object
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// Create an account service using the initialized client
export const account = new Account(client);

// Create a databases service using the initialized client
export const databases = new Databases(client);

export default client;