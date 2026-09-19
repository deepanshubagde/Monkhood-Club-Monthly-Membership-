// Utility to reliably store and sync screenshots using IndexedDB and /api/save-screenshot

const DB_NAME = 'monkhood_app_screenshots';
const DB_VERSION = 1;
const STORE_NAME = 'screenshots';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveScreenshotToDB(index: number, dataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(dataUrl, index);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to save to IndexedDB:', err);
  }
}

export async function loadAllScreenshotsFromDB(): Promise<Record<number, string>> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const results: Record<number, string> = {};

      for (let i = 0; i < 5; i++) {
        const req = store.get(i);
        req.onsuccess = () => {
          if (req.result) {
            results[i] = req.result;
          }
        };
      }

      tx.oncomplete = () => resolve(results);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to load from IndexedDB:', err);
    return {};
  }
}

export async function deleteScreenshotFromDB(index: number): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(index);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to delete from IndexedDB:', err);
  }
}

// Convert File to base64 DataURL (with optional downscale if gigantic)
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        reject(new Error('Empty file'));
        return;
      }

      // Check image dimensions
      const img = new Image();
      img.onload = () => {
        const maxDim = 1400;
        if (img.width <= maxDim && img.height <= maxDim) {
          resolve(result);
          return;
        }

        let { width, height } = img;
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        } else {
          resolve(result);
        }
      };
      img.onerror = () => resolve(result);
      img.src = result;
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Sync to server backend
export async function syncScreenshotToServer(index: number, base64: string): Promise<boolean> {
  try {
    const res = await fetch('/api/save-screenshot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index: index + 1, base64 }),
    });
    return res.ok;
  } catch (e) {
    console.warn('Server sync not available or failed:', e);
    return false;
  }
}
