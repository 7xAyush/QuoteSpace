import {API_NINJAS_KEY, QUOTE_CATEGORY} from '../config';
import {Quote} from '../types/quote';

const ZENQUOTES_TODAY_URL = 'https://zenquotes.io/api/today';

function ninjasUrl(category?: string) {
  const base = 'https://api.api-ninjas.com/v1/quotes';
  const cat = (category || '').trim();
  if (cat.length > 0) {
    return `${base}?category=${encodeURIComponent(cat)}`;
  }
  return base; // random quote across categories
}

function normalizeFromNinjas(item: any): Quote {
  return {
    id: `${item.author}-${item.quote}`,
    text: item.quote,
    author: item.author || 'Unknown',
    category: item.category,
  };
}

function normalizeFromZen(item: any): Quote {
  return {
    id: `${item.a}-${item.q}`,
    text: item.q,
    author: item.a || 'Unknown',
  };
}

export async function fetchQuote(categoryOverride?: string): Promise<Quote> {
  // Prefer API Ninjas if key is provided; else fallback to ZenQuotes
  if (API_NINJAS_KEY) {
    const categoriesToTry: (string | undefined)[] = [
      categoryOverride ?? QUOTE_CATEGORY,
      'inspirational',
      undefined, // any category
    ];
    for (const cat of categoriesToTry) {
      try {
        const res = await fetch(ninjasUrl(cat), {
          headers: { 'X-Api-Key': API_NINJAS_KEY, accept: 'application/json' },
        });
        if (!res.ok) {
          // 400 often means invalid category; try the next option
          if (res.status === 400) continue;
          // 401/403 etc -> fall back to ZenQuotes below
          break;
        }
        const data = await res.json();
        const first = Array.isArray(data) ? data[0] : data;
        if (first) return normalizeFromNinjas(first);
      } catch {
        // try next option or fallback
      }
    }
    // If API Ninjas fails entirely, fall back to ZenQuotes
  }

  const res = await fetch(ZENQUOTES_TODAY_URL);
  if (!res.ok) {
    throw new Error(`ZenQuotes error: ${res.status}`);
  }
  const data = await res.json();
  const first = Array.isArray(data) ? data[0] : data;
  return normalizeFromZen(first);
}
