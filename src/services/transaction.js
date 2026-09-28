import { ID, Query, Permission, Role } from "appwrite";
import { tablesDB } from "./appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

const TABLE_ID = import.meta.env.VITE_APPWRITE_TRANSACTIONS_COLLECTION_ID;

// CREATE
export const addTransaction = async (transaction, userId) => {
  return await tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    rowId: ID.unique(),

    data: {
      ...transaction,
      userId,
    },

    permissions: [
      Permission.read(Role.user(userId)),
      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId)),
    ],
  });
};

// READ
export const getTransactions = async (userId) => {
  return await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,

    queries: [
      Query.equal("userId", userId),
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ],
  });
};

// UPDATE
export const updateTransaction = async (
  transactionId,
  transaction
) => {
  return await tablesDB.updateRow({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    rowId: transactionId,
    data: transaction,
  });
};

// DELETE
export const deleteTransaction = async (transactionId) => {
  return await tablesDB.deleteRow({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    rowId: transactionId,
  });
};