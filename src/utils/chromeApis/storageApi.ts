/**
 * Chrome Storage API utilities for managing auth tokens
 */

export const storageApi = {
  /**
   * Save auth token to Chrome storage
   */
  saveToken: async (token: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ authToken: token }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  },

  /**
   * Get auth token from Chrome storage
   */
  getToken: async (): Promise<string | null> => {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['authToken'], (result) => {
        resolve(result.authToken || null as any);
      });
    });
  },

  /**
   * Remove auth token from Chrome storage
   */
  removeToken: async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.remove(['authToken'], () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  },
};
