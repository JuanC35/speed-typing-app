import { useEffect, useState } from "react";
import { Statistics } from "../../reducers/userReducer";

const dbName = 'myDB';
const collection = 'users';

let db: IDBDatabase | null = null;

function openDataBase(name: string, collection: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, 1);

    request.onupgradeneeded = (e: any) => {
      const dataBase: IDBDatabase = e.target.result;
      const store = dataBase.createObjectStore(collection, {
        keyPath: 'id', autoIncrement: true
      });
      store.createIndex(`name`, 'name', { unique: true });
    }

    request.onsuccess = (e: any) => {
      const dataBase: IDBDatabase = e.target.result;
      resolve(dataBase);
    }

    request.onerror = () => reject('Open database failed');
  });
}

async function saveData<T>(data: T) {
  const tx = await db!.transaction(collection, 'readwrite');
  const store = await tx.objectStore(collection);

  const newData = { text: data };
  await store.add(newData);

  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject('Error saving data');
  });
}

async function saveStatistics(name: string | null, statistics: Statistics) {
  return new Promise(async (resolve, reject) => {
    const tx = await db!.transaction(collection, 'readwrite');
    const store = await tx.objectStore(collection);
    const req = await store.openCursor();

    req.onsuccess = (e: any) => {     
      let cursor = e.target.result;

      if (cursor) {
        if (cursor.value.text.name === name) {
          const updatedUser = cursor.value.text;
          updatedUser.statistics = [...updatedUser.statistics, statistics];

          cursor.update({id: cursor.value.id, text: updatedUser});
          resolve('');
        }

        cursor.continue();
      }
    };
              
    req.onerror = () => {
      reject('Error updating user');
    }
  });
}

async function getUsers<T>(): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const tx = await db!.transaction(collection, 'readwrite');
    const store = await tx.objectStore(collection);
    const data = await store.getAll();
   
    data.onsuccess = (e: any) => {
      resolve(e.target.result);
    }

    data.onerror = () => {
      reject('Some error ocurrer were fetching the Data from IndexDB');
    }
  });
}

export function useIndexDB() {
  const [dbReady, setDbReady] = useState<boolean>(false);

  useEffect(() => {
    async function getDb() {
      db = await openDataBase(dbName, collection);
      setDbReady(true);
    }
    
    if (!db) {
      getDb();
    }
  }, []);

  return { dbReady, saveData, saveStatistics, getUsers };
}