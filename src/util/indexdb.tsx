import { Statistics } from "../reducers/userReducer";

export function openDataBase(name: string, collection: string): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
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
      res(dataBase);
    }

    request.onerror = () => rej('Open database failed');
  });
}

export async function saveData<T>(db: IDBDatabase, collection: string, data: T) {
  const tx = await db.transaction(collection, 'readwrite');
  const store = await tx.objectStore(collection);

  const newData = { text: data };
  await store.add(newData);

  await new Promise<void>((res, rej) => {
    tx.oncomplete = () => res();
    tx.onerror = () => rej('Error saving data');
  });
}

export async function saveStatistics(db: IDBDatabase, collection: string, name: string | null, statistics: Statistics) {
  return new Promise(async (res, rej) => {
    const tx = await db.transaction(collection, 'readwrite');
    const store = await tx.objectStore(collection);
    const req = await store.openCursor();

    req.onsuccess = (e: any) => {     
      let cursor = e.target.result;

      if (cursor) {
        if (cursor.value.text.name === name) {
          const updatedUser = cursor.value.text;
          updatedUser.statistics = [...updatedUser.statistics, statistics];

          cursor.update({id: cursor.value.id, text: updatedUser});
          res('');
        }

        cursor.continue();
      }
    };
              
    req.onerror = () => {
      rej('Error updating user');
    }
  });
}

export async function getUsers<T>(db: IDBDatabase, collection: string): Promise<T> {
  return new Promise(async (res, rej) => {
    const tx = await db.transaction(collection, 'readwrite');
    const store = await tx.objectStore(collection);
    const data = await store.getAll();
   
    data.onsuccess = (e: any) => {
      res(e.target.result);
    }

    data.onerror = () => {
      rej('Some error ocurrer were fetching the Data from IndexDB');
    }
  });
}