// App configuration. Do not commit secrets.
// Local secrets live in src/config.local.ts (gitignored).
import {API_NINJAS_KEY as LOCAL_API_KEY, QUOTE_CATEGORY_OVERRIDE} from './config.local';

// Fallbacks if local overrides are not set
export const API_NINJAS_KEY = LOCAL_API_KEY || '';
export const QUOTE_CATEGORY = QUOTE_CATEGORY_OVERRIDE ?? 'inspirational';
