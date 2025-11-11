export const STORAGE_KEYS = {
  // For per-category daily cache, we will derive: `${dailyPrefix}${category || 'any'}`
  dailyPrefix: '@quotespace/daily/',
  favorites: '@quotespace/favorites',
} as const;
