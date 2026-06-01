// LocalStorage utility functions

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('Storage save error:', e);
    return false;
  }
};

export const getFromStorage = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error('Storage get error:', e);
    return fallback;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
};

// Storage keys
export const KEYS = {
  ADMIN_AUTH: 'adminAuth',
  TIMETABLES: 'timetables',
  NOTIFICATIONS: 'notifications',
};

// Default admin credentials
export const DEFAULT_ADMIN = { username: 'admin', password: 'uokara2024' };
