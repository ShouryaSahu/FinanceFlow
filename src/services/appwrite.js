import { Client, Account, TablesDB } from "appwrite";

// Creating appwrite client object
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// Create an account service using the initialized client
export const account = new Account(client);

// Create a tables service using the initialized client
export const tablesDB = new TablesDB(client);

export default client;