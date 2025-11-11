import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  Share,
  TextInput,
} from 'react-native';
import {colors} from '../theme/colors';
import {Quote} from '../types/quote';
import {clearFavorites, getFavorites, removeFavorite} from '../storage/favorites';

export default function FavoritesScreen() {
  const [items, setItems] = useState<Quote[]>([]);
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    const list = await getFavorites();
    setItems(list);
  }, []);

  useEffect(() => {
    const unsub = setInterval(load, 800); // lightweight refresh while focusing
    load();
    return () => clearInterval(unsub);
  }, [load]);

  const onRemove = async (id: string) => {
    await removeFavorite(id);
    await load();
  };

  const onShare = async (q: Quote) => {
    try {
      await Share.share({message: `"${q.text}" — ${q.author}`});
    } catch {}
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      i => i.text.toLowerCase().includes(q) || i.author.toLowerCase().includes(q),
    );
  }, [items, query]);

  const onClearAll = async () => {
    await clearFavorites();
    await load();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Favorites</Text>
        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search favorites..."
            placeholderTextColor="#7891a4"
            style={styles.search}
            value={query}
            onChangeText={setQuery}
          />
          <Pressable style={[styles.btn, styles.clear]} onPress={onClearAll}>
            <Text style={styles.btnText}>Clear</Text>
          </Pressable>
        </View>
        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          ListEmptyComponent={
            <Text style={styles.empty}>No favorites yet. Add some!</Text>
          }
          renderItem={({item}) => (
            <View style={styles.card}>
              <Text style={styles.text}>“{item.text}”</Text>
              <Text style={styles.author}>— {item.author}</Text>
              <View style={styles.actions}>
                <Pressable style={styles.btn} onPress={() => onShare(item)}>
                  <Text style={styles.btnText}>Share</Text>
                </Pressable>
                <Pressable
                  style={[styles.btn, styles.remove]}
                  onPress={() => onRemove(item.id)}>
                  <Text style={styles.btnText}>Remove</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#0b1720'},
  container: {flex: 1, padding: 16, gap: 12},
  title: {color: colors.textPrimary, fontSize: 24, fontWeight: '800'},
  searchRow: {flexDirection: 'row', gap: 8, alignItems: 'center'},
  search: {
    flex: 1,
    backgroundColor: '#10212b',
    color: colors.textPrimary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  empty: {color: colors.textSecondary, marginTop: 12},
  card: {
    backgroundColor: '#10212b',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
  },
  text: {color: colors.textPrimary, fontSize: 16, lineHeight: 22},
  author: {color: colors.textSecondary, fontSize: 12},
  actions: {flexDirection: 'row', gap: 8, marginTop: 6},
  btn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clear: {backgroundColor: '#334451'},
  remove: {backgroundColor: colors.danger},
  btnText: {color: '#001017', fontWeight: '700'},
});
