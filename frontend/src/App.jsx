import React, { useEffect } from 'react'
import NavBar from './components/NavBar'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Catalog'
import Start from './pages/Start'
import User from './pages/User'
import BottomNav from './components/BottomNav'
import './App.css'

/**
 * STORAGE_MODE:
 *  - 'local'  -> использует window.localStorage
 *  - 'device' -> использует window.WebApp.DeviceStorage (если доступен), иначе fallback на localStorage
 */
const STORAGE_MODE = 'device' // поменяй на 'local', если хочешь чистый localStorage

export default function App() {
  useEffect(() => {
    let cancelled = false;

    // --- helper: ждем появления window.WebApp.initDataUnsafe.user (polling) ---
    async function waitForWebAppInitData(timeoutMs = 5000, intervalMs = 100) {
      const start = Date.now();
      function check() {
        try {
          const wa = window.WebApp;
          if (wa && wa.initDataUnsafe && wa.initDataUnsafe.user) {
            return wa.initDataUnsafe.user;
          }
        } catch (e) {
          // ignore
        }
        return null;
      }

      // первое мгновенное чек-попытка
      const immediate = check();
      if (immediate) return immediate;

      // polling
      return new Promise((resolve) => {
        const iv = setInterval(() => {
          if (cancelled) {
            clearInterval(iv);
            resolve(null);
            return;
          }
          const found = check();
          if (found) {
            clearInterval(iv);
            resolve(found);
            return;
          }
          if (Date.now() - start > timeoutMs) {
            clearInterval(iv);
            resolve(null);
          }
        }, intervalMs);
      });
    }

    // --- storage wrappers unify API (always Promise-based) ---
    function getStorageHandlers() {
      const wa = window.WebApp;
      if (STORAGE_MODE === 'device' && wa && wa.DeviceStorage) {
        const ds = wa.DeviceStorage;
        return {
          async getItem(key) {
            try {
              // DeviceStorage in many Telegram WebApp implementations is synchronous,
              // but we normalize to Promise.
              const val = ds.getItem(key);
              return typeof val === 'undefined' ? null : val;
            } catch (e) {
              console.warn('DeviceStorage.getItem failed', e);
              return null;
            }
          },
          async setItem(key, value) {
            try {
              ds.setItem(key, value);
            } catch (e) {
              console.warn('DeviceStorage.setItem failed', e);
            }
          },
          async removeItem(key) {
            try {
              ds.removeItem(key);
            } catch (e) {
              console.warn('DeviceStorage.removeItem failed', e);
            }
          },
          async clear() {
            try {
              ds.clear();
            } catch (e) {
              console.warn('DeviceStorage.clear failed', e);
            }
          }
        };
      }

      // fallback -> localStorage
      return {
        async getItem(key) {
          try {
            const v = window.localStorage.getItem(key);
            return v === null ? null : v;
          } catch (e) {
            console.warn('localStorage.getItem failed', e);
            return null;
          }
        },
        async setItem(key, value) {
          try {
            window.localStorage.setItem(key, value);
          } catch (e) {
            console.warn('localStorage.setItem failed', e);
          }
        },
        async removeItem(key) {
          try {
            window.localStorage.removeItem(key);
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

    // --- secure storage wrapper for token (SecureStorage or fallback localStorage) ---
    function getSecureStorageHandlers() {
      const wa = window.WebApp;
      if (wa && wa.SecureStorage) {
        const ss = wa.SecureStorage;
        return {
          async getItem(key) {
            try {
              const v = ss.getItem(key);
              return typeof v === 'undefined' ? null : v;
            } catch (e) {
              console.warn('SecureStorage.getItem failed', e);
              return null;
            }
          },
          async setItem(key, value) {
            try {
              ss.setItem(key, value);
            } catch (e) {
              console.warn('SecureStorage.setItem failed', e);
            }
          },
          async removeItem(key) {
            try {
              ss.removeItem(key);
            } catch (e) {
              console.warn('SecureStorage.removeItem failed', e);
            }
          }
        };
      }

      // fallback -> localStorage (only if SecureStorage is not available)
      return {
        async getItem(key) {
          try {
            return window.localStorage.getItem(key);
          } catch (e) {
            console.warn('localStorage.getItem failed (secure fallback)', e);
            return null;
          }
        },
        async setItem(key, value) {
          try {
            window.localStorage.setItem(key, value);
          } catch (e) {
            console.warn('localStorage.setItem failed (secure fallback)', e);
          }
        },
        async removeItem(key) {
          try {
            window.localStorage.removeItem(key);
          } catch (e) {
            console.warn('localStorage.removeItem failed (secure fallback)', e);
          }
        }
      };
    }

    // --- compare two simple profile objects (shallow) ---
    function profileEquals(a, b) {
      if (!a || !b) return false;
      return a.id === b.id &&
             a.username === b.username &&
             a.first_name === b.first_name &&
             a.last_name === b.last_name &&
             a.photo_url === b.photo_url;
    }

    // --- main init flow ---
    (async function init() {
      try {
        // 1) wait for WebApp user data (or null if not found in timeout)
        const webUser = await waitForWebAppInitData(5000, 100); // wait up to 5s
        if (cancelled) return;

        // 2) pick out needed fields (if available)
        // fallback to nulls if webUser not present
        const profileFromWeb = webUser ? {
          id: webUser.id ?? null,
          username: webUser.username ?? '',
          first_name: webUser.first_name ?? '',
          last_name: webUser.last_name ?? '',
          photo_url: webUser.photo_url ?? ''
        } : null;

        const storage = getStorageHandlers();

        // We'll store profile under key 'app.user.profile' as JSON string
        const PROFILE_KEY = 'app.user.profile';

        // read stored profile
        const storedRaw = await storage.getItem(PROFILE_KEY);
        const storedProfile = storedRaw ? (() => {
          try { return JSON.parse(storedRaw); } catch (e) { return null; }
        })() : null;

        // If stored empty and web provided -> write web data
        if (!storedProfile && profileFromWeb) {
          await storage.setItem(PROFILE_KEY, JSON.stringify(profileFromWeb));
          console.log('Profile initialized from WebApp -> storage', profileFromWeb);
        } else if (storedProfile && profileFromWeb && !profileEquals(storedProfile, profileFromWeb)) {
          // If profile exists but changed on web -> update storage
          await storage.setItem(PROFILE_KEY, JSON.stringify(profileFromWeb));
          console.log('Profile updated from WebApp -> storage', profileFromWeb);
        } else {
          // nothing to update, or no web data
          if (!profileFromWeb) {
            console.log('No WebApp user data available, leaving stored profile as-is');
          } else {
            console.log('Stored profile is up-to-date');
          }
        }

        // 3) handle token: check secure storage for 'accessToken'
        const secure = getSecureStorageHandlers();
        const TOKEN_KEY = 'accessToken';
        const existingToken = await secure.getItem(TOKEN_KEY);

        if (!existingToken) {
          console.log('No access token found in SecureStorage (or fallback). You probably want to fetch one now.');
          // ------------------------------------------------------------
          // Тут пример как можно вызывать fetch для получения токена.
          // Закомментирован — вставь реальный эндпоинт и тело запроса.
          // ------------------------------------------------------------
          /*
          try {
            const resp = await fetch('/api/auth/get-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ /* любые нужные данные */ /* })
            });
            if (resp.ok) {
              const json = await resp.json();
              const tokenFromServer = json?.token;
              if (tokenFromServer) {
                await secure.setItem(TOKEN_KEY, tokenFromServer);
                console.log('Access token saved to secure storage');
              }
            } else {
              console.warn('Token request failed', resp.status);
            }
          } catch (err) {
            console.error('Token fetch error', err);
          }
          */
          // ------------------------------------------------------------
        } else {
          console.log('Access token present in secure storage (or fallback).');
        }

      } catch (err) {
        console.error('init error in App storage sync effect', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []); // effect запускаем один раз при монтировании

  const location = useLocation()

  // Массив путей, где хотим показывать BottomNav
  const showBottomNavPaths = ['/', '/catalog', '/profile']

  const shouldShowBottomNav = showBottomNavPaths.includes(location.pathname)
  return (
    <div className='app-container'>
      <div className="header">
        <NavBar />
      </div>
      <main className='content-wrapper'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/WebAppData" element={<Start />} />
          <Route path="/start" element={<Start />} />
          <Route path="/user/:id" element={<User />} />
          <Route path="/profile" element={<User />} />
          <Route path="*" element={<Start />} />
        </Routes>
      </main>
      {shouldShowBottomNav && <BottomNav />}
    </div>
  )
}
