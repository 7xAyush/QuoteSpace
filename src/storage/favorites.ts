import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from './keys';
import {Quote} from '../types/quote';

export async function getFavorites(): Promise<Quote[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.favorites);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw) as Quote[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export async function addFavorite(quote: Quote): Promise<void> {
  const list = await getFavorites();
  const exists = list.find(q => q.id === quote.id);
  if (exists) return;
  list.unshift(quote);
  await AsyncStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(list));
}

export async function removeFavorite(id: string): Promise<void> {
  const list = await getFavorites();
  const filtered = list.filter(q => q.id !== id);
  await AsyncStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(filtered));
}

export async function isFavorite(id: string): Promise<boolean> {
  const list = await getFavorites();
  return list.some(q => q.id === id);
}

export async function clearFavorites(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([]));
}
