// db.js or db.ts
import Dexie from "dexie";

export const db = new Dexie("FileStoreDB");
db.version(1).stores({
  files: "&fileId", // primary key
});

export const Files = db.table("files");
