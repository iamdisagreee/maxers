// src/utils/storage.js
import { DEFAULT_API_URL } from '../env';

const STORAGE_KEY_PROFILE = 'app.user.profile';
const STORAGE_KEY_TOKEN = 'accessToken';
const STORAGE_KEY_ROLE = 'app.user.role';
const STORAGE_KEY_API = 'app.api.url';

const STORAGE_MODE = 'local'; // 'local' или 'device'

let storageHandler = null;
let secureHandler = null;

/** --- helpers --- **/

function localStorageHandler() {
  return {
    async getItem(k) {
      try {
        const v = window.localStorage.getItem(k);
        return v === null ? null : v;
      } catch (e) {
        console.warn('localStorage.getItem failed', e);
        return null;
      }
    },
    async setItem(k, v) {
      try {
        window.localStorage.setItem(k, v);
      } catch (e) {
        console.warn('localStorage.setItem failed', e);
      }
    },
    async removeItem(k) {
      try {
        window.localStorage.removeItem(k);
      } catch (e) {
        console.warn('localStorage.removeItem failed', e);
      }
    },
    async clear() {
      try {
        window.localStorage.clear();
      } catch (e) {
        console.warn('localStorage.clear failed', e);
      }
    }
  };
}

/**
 * Проверка поддержки DeviceStorage
 */
function isDeviceStorageSupported() {
  try {
    const wa = window.WebApp;
    // Проверяем версию API и наличие DeviceStorage
    if (!wa || !wa.version) return false;
    
    const version = parseFloat(wa.version);
    if (version < 6.9) {
      console.log(`DeviceStorage requires WebApp API 6.9+, current: ${version}`);
      return false;
    }
    
    if (!wa.DeviceStorage || typeof wa.DeviceStorage.getItem !== 'function') {
      console.log('DeviceStorage API not available');
      return false;
    }
    
    return true;
  } catch (e) {
    console.warn('DeviceStorage check failed:', e);
    return false;
  }
}

/**
 * Асинхронная обёртка для DeviceStorage с промисами
 */
function deviceStorageHandlerAsync() {
  try {
    const wa = window.WebApp;
    if (STORAGE_MODE === 'local') {
      console.log('deviceStorageHandlerAsync: STORAGE_MODE=local -> using localStorage');
      return localStorageHandler();
    }
    // Проверяем поддержку перед использованием
    if (STORAGE_MODE === 'device' && isDeviceStorageSupported()) {
      const ds = wa.DeviceStorage;
      console.log('Using DeviceStorage (supported)');
      
      return {
        async getItem(k) {
          return new Promise((resolve) => {
            try {
              ds.getItem(k, (error, value) => {
                if (error) {
                  console.warn('DeviceStorage.getItem error:', error);
                  // Fallback на localStorage
                  localStorageHandler().getItem(k).then(resolve);
                } else {
                  resolve(value === undefined || value === null ? null : value);
                }
              });
            } catch (e) {
              console.warn('DeviceStorage.getItem failed - fallback to localStorage', e);
              localStorageHandler().getItem(k).then(resolve);
            }
          });
        },
        
        async setItem(k, v) {
          return new Promise((resolve) => {
            try {
              ds.setItem(k, v, (error, success) => {
                if (error) {
                  console.warn('DeviceStorage.setItem error:', error);
                  // Fallback на localStorage
                  localStorageHandler().setItem(k, v).then(resolve);
                } else {
                  resolve(success);
                }
              });
            } catch (e) {
              console.warn('DeviceStorage.setItem failed - fallback to localStorage', e);
              localStorageHandler().setItem(k, v).then(resolve);
            }
          });
        },
        
        async removeItem(k) {
          return new Promise((resolve) => {
            try {
              ds.removeItem(k, (error, success) => {
                if (error) {
                  console.warn('DeviceStorage.removeItem error:', error);
                  localStorageHandler().removeItem(k).then(resolve);
                } else {
                  resolve(success);
                }
              });
            } catch (e) {
              console.warn('DeviceStorage.removeItem failed - fallback to localStorage', e);
              localStorageHandler().removeItem(k).then(resolve);
            }
          });
        },
        
        async clear() {
          return new Promise((resolve) => {
            try {
              if (typeof ds.clear === 'function') {
                ds.clear((error, success) => {
                  if (error) {
                    console.warn('DeviceStorage.clear error:', error);
                    localStorageHandler().clear().then(resolve);
                  } else {
                    resolve(success);
                  }
                });
              } else {
                throw new Error('DeviceStorage.clear not supported');
              }
            } catch (e) {
              console.warn('DeviceStorage.clear failed - fallback to localStorage', e);
              localStorageHandler().clear().then(resolve);
            }
          });
        }
      };
    }
  } catch (err) {
    console.warn('Unable to initialize DeviceStorage handler:', err);
  }
  
  console.log('Using localStorage (DeviceStorage not supported)');
  return localStorageHandler();
}

/**
 * Проверка поддержки SecureStorage
 */
function isSecureStorageSupported() {
  try {
    const wa = window.WebApp;
    if (!wa || !wa.version) return false;
    
    const version = parseFloat(wa.version);
    if (version < 6.9) {
      console.log(`SecureStorage requires WebApp API 6.9+, current: ${version}`);
      return false;
    }
    
    if (!wa.SecureStorage || typeof wa.SecureStorage.getItem !== 'function') {
      console.log('SecureStorage API not available');
      return false;
    }
    
    return true;
  } catch (e) {
    console.warn('SecureStorage check failed:', e);
    return false;
  }
}

/**
 * Асинхронная обёртка для SecureStorage с промисами
 */
function secureStorageHandlerAsync() {
  try {
    const wa = window.WebApp;
    
    if (STORAGE_MODE === 'local') {
      console.log('secureStorageHandlerAsync: STORAGE_MODE=local -> using localStorage');
      return localStorageHandler();
    }

    if (isSecureStorageSupported()) {
      const ss = wa.SecureStorage;
      console.log('Using SecureStorage (supported)');
      
      return {
        async getItem(k) {
          return new Promise((resolve) => {
            try {
              ss.getItem(k, (error, value) => {
                if (error) {
                  console.warn('SecureStorage.getItem error:', error);
                  localStorageHandler().getItem(k).then(resolve);
                } else {
                  resolve(value === undefined || value === null ? null : value);
                }
              });
            } catch (e) {
              console.warn('SecureStorage.getItem failed - fallback to localStorage', e);
              localStorageHandler().getItem(k).then(resolve);
            }
          });
        },
        
        async setItem(k, v) {
          return new Promise((resolve) => {
            try {
              ss.setItem(k, v, (error, success) => {
                if (error) {
                  console.warn('SecureStorage.setItem error:', error);
                  localStorageHandler().setItem(k, v).then(resolve);
                } else {
                  resolve(success);
                }
              });
            } catch (e) {
              console.warn('SecureStorage.setItem failed - fallback to localStorage', e);
              localStorageHandler().setItem(k, v).then(resolve);
            }
          });
        },
        
        async removeItem(k) {
          return new Promise((resolve) => {
            try {
              ss.removeItem(k, (error, success) => {
                if (error) {
                  console.warn('SecureStorage.removeItem error:', error);
                  localStorageHandler().removeItem(k).then(resolve);
                } else {
                  resolve(success);
                }
              });
            } catch (e) {
              console.warn('SecureStorage.removeItem failed - fallback to localStorage', e);
              localStorageHandler().removeItem(k).then(resolve);
            }
          });
        }
      };
    }
  } catch (err) {
    console.warn('Unable to initialize SecureStorage handler:', err);
  }
  
  console.log('Using localStorage for tokens (SecureStorage not supported)');
  return localStorageHandler();
}

/** Ожидание инициализации WebApp */
async function waitWebAppReady(timeoutMs = 3000) {
  const start = Date.now();
  
  return new Promise((resolve) => {
    const check = () => {
      try {
        const wa = window.WebApp;
        if (wa && wa.initDataUnsafe) {
          return wa;
        }
      } catch {}
      return null;
    };

    const immediate = check();
    if (immediate) {
      resolve(immediate);
      return;
    }

    const interval = setInterval(() => {
      const wa = check();
      if (wa || Date.now() - start > timeoutMs) {
        clearInterval(interval);
        resolve(wa);
      }
    }, 100);
  });
}

function profileEquals(a, b) {
  if (!a || !b) return false;
  return a.id === b.id &&
         a.username === b.username &&
         a.first_name === b.first_name &&
         a.last_name === b.last_name &&
         a.photo_url === b.photo_url;
}

/** --- public API --- */
export const Storage = {
  init: async () => {
    console.log('Storage.init: starting...');
    
    // Проверяем WebApp API
    const wa = window.WebApp;
    if (wa) {
      console.log(`WebApp API version: ${wa.version || 'unknown'}`);
      console.log(`DeviceStorage supported: ${isDeviceStorageSupported()}`);
      console.log(`SecureStorage supported: ${isSecureStorageSupported()}`);
    } else {
      console.log('WebApp not available - using localStorage only');
    }
    
    // Инициализация handlers
    storageHandler = deviceStorageHandlerAsync();
    secureHandler = secureStorageHandlerAsync();
    
    console.log('Storage.init: handlers created');

    try {
      // Ждём WebApp
      const wa = await waitWebAppReady(3000);
      
      if (!wa) {
        console.warn('WebApp not available, using localStorage only');
        return;
      }

      console.log('Storage.init: WebApp ready');

      const webUser = wa.initDataUnsafe?.user;
      const profileFromWeb = webUser ? {
        id: webUser.id ?? null,
        username: webUser.username ?? '',
        first_name: webUser.first_name ?? '',
        last_name: webUser.last_name ?? '',
        photo_url: webUser.photo_url ?? ''
      } : null;

      console.log('Storage.init: profileFromWeb =', profileFromWeb);

      // Читаем сохранённый профиль
      let storedRaw = null;
      try {
        storedRaw = await storageHandler.getItem(STORAGE_KEY_PROFILE);
        console.log('Storage.init: storedRaw =', storedRaw);
      } catch (e) {
        console.warn('Error reading stored profile', e);
      }

      let storedProfile = null;
      if (storedRaw) {
        try { 
          storedProfile = JSON.parse(storedRaw); 
        } catch (e) { 
          console.warn('Failed to parse stored profile', e);
        }
      }

      // Если нет сохранённого профиля, но WebApp дал — сохраняем
      if (!storedProfile && profileFromWeb) {
        try {
          await storageHandler.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profileFromWeb));
          console.log('Profile initialized from WebApp -> storage', profileFromWeb);
        } catch (e) {
          console.warn('Failed to write profile to storage', e);
        }
      } else if (storedProfile && profileFromWeb && !profileEquals(storedProfile, profileFromWeb)) {
        try {
          await storageHandler.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profileFromWeb));
          console.log('Profile updated from WebApp -> storage', profileFromWeb);
        } catch (e) {
          console.warn('Failed to update profile in storage', e);
        }
      } else {
        console.log('Stored profile is up-to-date or WebApp profile not available');
      }
    } catch (err) {
      console.error('Storage.init error', err);
    }
    
    console.log('Storage.init: completed');
  },

  // profile
  getProfile: async () => {
    try {
      if (!storageHandler) storageHandler = deviceStorageHandlerAsync();
      const raw = await storageHandler.getItem(STORAGE_KEY_PROFILE);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('getProfile error', e);
      return null;
    }
  },
  
  setProfile: async (profile) => {
    try {
      if (!storageHandler) storageHandler = deviceStorageHandlerAsync();
      await storageHandler.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('setProfile error', e);
    }
  },

  // role
  getRole: async () => {
    try {
      if (!storageHandler) storageHandler = deviceStorageHandlerAsync();
      const role = await storageHandler.getItem(STORAGE_KEY_ROLE);
      return role ?? null;
    } catch (e) {
      console.warn('getRole error', e);
      return null;
    }
  },
  
  setRole: async (role) => {
    try {
      if (!storageHandler) storageHandler = deviceStorageHandlerAsync();
      await storageHandler.setItem(STORAGE_KEY_ROLE, role);
    } catch (e) {
      console.warn('setRole error', e);
    }
  },
  
  removeRole: async () => {
    try {
      if (!storageHandler) storageHandler = deviceStorageHandlerAsync();
      await storageHandler.removeItem(STORAGE_KEY_ROLE);
    } catch (e) {
      console.warn('removeRole error', e);
    }
  },

  // api url
  getApiUrl: async () => {
    try {
      if (!storageHandler) storageHandler = deviceStorageHandlerAsync();
      const url = await storageHandler.getItem(STORAGE_KEY_API);
      return url || DEFAULT_API_URL;
    } catch (e) {
      console.warn('getApiUrl error', e);
      return DEFAULT_API_URL;
    }
  },
  
  setApiUrl: async (url) => {
    try {
      if (!storageHandler) storageHandler = deviceStorageHandlerAsync();
      await storageHandler.setItem(STORAGE_KEY_API, url);
    } catch (e) {
      console.warn('setApiUrl error', e);
    }
  },
  
  removeApiUrl: async () => {
    try {
      if (!storageHandler) storageHandler = deviceStorageHandlerAsync();
      await storageHandler.removeItem(STORAGE_KEY_API);
    } catch (e) {
      console.warn('removeApiUrl error', e);
    }
  },

  // token (secure storage)
  getToken: async () => {
    try {
      if (!secureHandler) secureHandler = secureStorageHandlerAsync();
      const tok = await secureHandler.getItem(STORAGE_KEY_TOKEN);
      return tok ?? null;
    } catch (e) {
      console.warn('getToken error', e);
      return null;
    }
  },
  
  setToken: async (token) => {
    try {
      if (!secureHandler) secureHandler = secureStorageHandlerAsync();
      await secureHandler.setItem(STORAGE_KEY_TOKEN, token);
    } catch (e) {
      console.warn('setToken error', e);
    }
  },
  
  removeToken: async () => {
    try {
      if (!secureHandler) secureHandler = secureStorageHandlerAsync();
      await secureHandler.removeItem(STORAGE_KEY_TOKEN);
    } catch (e) {
      console.warn('removeToken error', e);
    }
  },

  _handlers: () => ({ storageHandler, secureHandler })
};