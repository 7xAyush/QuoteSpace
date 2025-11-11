import AsyncStorage from '@react-native-async-storage/async-storage';
import {Quote} from '../types/quote';
import {STORAGE_KEYS} from './keys';

type DailyRecord = {
  date: string; // YYYY-MM-DD
  category?: string;
  quote: Quote;
};

function todayStr() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

function keyForCategory(category?: string) {
  const cat = (category || 'any').toLowerCase();
  return `${STORAGE_KEYS.dailyPrefix}${cat}`;
}

export async function getStoredDaily(category?: string): Promise<Quote | null> {
  const raw = await AsyncStorage.getItem(keyForCategory(category));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as DailyRecord;
    if (parsed.date === todayStr()) {
      return parsed.quote;
    }
    return null;
  } catch {
    return null;
  }
}

export async function setDaily(quote: Quote, category?: string): Promise<void> {
  const record: DailyRecord = {date: todayStr(), quote, category};
  await AsyncStorage.setItem(keyForCategory(category), JSON.stringify(record));
}
