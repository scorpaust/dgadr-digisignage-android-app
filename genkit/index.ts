import "dotenv/config";

import * as fs from "fs";
import * as path from "path";

// Simular database local
const DB_FILE = path.join(__dirname, "../data/knowledge_base.json");

export const db = {
  collection: (name: string) => ({
    doc: (id: string) => {
      const docRef = {
        _collection: name,
        _id: id,
        set: async (data: any) => {
          const dbData = loadDB();
          if (!dbData[name]) dbData[name] = {};
          dbData[name][id] = data;
          saveDB(dbData);
        },
        get: async () => {
          const dbData = loadDB();
          return {
            exists: !!dbData[name]?.[id],
            data: () => dbData[name]?.[id],
            id,
            ref: docRef,
          };
        },
        update: async (data: any) => {
          const dbData = loadDB();
          if (!dbData[name]) dbData[name] = {};
          if (!dbData[name][id]) dbData[name][id] = {};
          dbData[name][id] = { ...dbData[name][id], ...data };
          saveDB(dbData);
        },
        delete: async () => {
          const dbData = loadDB();
          if (dbData[name]?.[id]) {
            delete dbData[name][id];
            saveDB(dbData);
          }
        },
      };
      return docRef;
    },
    get: async () => {
      const dbData = loadDB();
      const docs = Object.entries(dbData[name] || {}).map(([id, data]) => ({
        id,
        data: () => data,
        exists: true,
        ref: db.collection(name).doc(id),
      }));
      return { docs, size: docs.length };
    },
    where: (field: string, op: string, value: any) => {
      // Mock where clause - returns a query object with get method
      const queryObj: any = {
        where: (nextField: string, nextOp: string, nextValue: any) => {
          // Allow chaining (not fully implemented - just returns same query)
          return queryObj;
        },
        get: async () => {
          const dbData = loadDB();
          const allDocs = Object.entries(dbData[name] || {}).map(([id, data]) => ({
            id,
            data: () => data,
            exists: true,
            ref: db.collection(name).doc(id),
          }));

          // Simple filter implementation
          const filtered = allDocs.filter((doc) => {
            const data = doc.data();
            const fieldParts = field.split('.');
            let fieldValue: any = data;

            for (const part of fieldParts) {
              if (fieldValue && typeof fieldValue === 'object') {
                fieldValue = fieldValue[part];
              } else {
                return false;
              }
            }

            if (op === '==') return fieldValue === value;
            if (op === '!=') return fieldValue !== value;
            if (op === '>') return (fieldValue as any) > value;
            if (op === '<') return (fieldValue as any) < value;
            if (op === '>=') return (fieldValue as any) >= value;
            if (op === '<=') return (fieldValue as any) <= value;
            return false;
          });

          return { docs: filtered, size: filtered.length };
        },
      };
      return queryObj;
    },
  }),
  batch: () => {
    const operations: any[] = [];
    return {
      set: (ref: any, data: any) => operations.push({ type: "set", ref, data }),
      delete: (ref: any) => operations.push({ type: "delete", ref }),
      update: (ref: any, data: any) => operations.push({ type: "update", ref, data }),
      commit: async () => {
        const dbData = loadDB();
        operations.forEach((op) => {
          const [collection, id] = [op.ref._collection, op.ref._id];
          if (op.type === "set") {
            if (!dbData[collection]) dbData[collection] = {};
            dbData[collection][id] = op.data;
          } else if (op.type === "delete") {
            if (dbData[collection]?.[id]) {
              delete dbData[collection][id];
            }
          } else if (op.type === "update") {
            if (!dbData[collection]) dbData[collection] = {};
            if (!dbData[collection][id]) dbData[collection][id] = {};
            dbData[collection][id] = { ...dbData[collection][id], ...op.data };
          }
        });
        saveDB(dbData);
      },
    };
  },
};

function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function saveDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

console.log("✅ Using local JSON database");
console.log(`📂 Database file: ${DB_FILE}`);
