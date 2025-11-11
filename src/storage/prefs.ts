import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@quotespace/selectedCategory';

export async function getSelectedCategory(): Promise<string | undefined> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return undefined;
    const v = JSON.parse(raw);
    return typeof v === 'string' ? v : undefined;
  } catch {
    return undefined;
  }
}

export async function setSelectedCategory(cat: string): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(cat));
}

