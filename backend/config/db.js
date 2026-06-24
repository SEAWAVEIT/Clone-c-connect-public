import { connectMySQL } from "./sqlconfig.js";

let db;

export const getDB = async () => {
  if (!db) {
    db = await connectMySQL();
  }
  return db;
};