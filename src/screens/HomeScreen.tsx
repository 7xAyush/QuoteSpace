import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';
import {fetchQuote} from '../api/quotes';
import {getStoredDaily, setDaily} from '../storage/daily';
import {addFavorite, isFavorite as isFavoriteFn, removeFavorite} from '../storage/favorites';
import {Quote} from '../types/quote';
import QuoteCard from '../components/QuoteCard';
import {colors} from '../theme/colors';
import {getSelectedCategory, setSelectedCategory} from '../storage/prefs';
import {QUOTE_CATEGORY} from '../config';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const catAnim = useRef(new Animated.Value(1)).current;

  const categories = useMemo(
    () => [
      'inspirational',
      'success',
      'happiness',
      'life',
      'love',
      'courage',
      'change',
      'education',
    ],
    [],
  );

  const loadDaily = useCallback(async (cat?: string) => {
    setLoading(true);
    setError(null);
    try {
      const stored = await getStoredDaily(cat);
      if (stored) {
        setQuote(stored);
        setIsFavorite(await isFavoriteFn(stored.id));
      } else {
        const fresh = await fetchQuote(cat);
        setQuote(fresh);
        await setDaily(fresh, cat);
        setIsFavorite(await isFavoriteFn(fresh.id));
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load quote');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshQuote = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fresh = await fetchQuote(category);
      setQuote(fresh);
      await setDaily(fresh, category);
      setIsFavorite(await isFavoriteFn(fresh.id));
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    // initialize selected category from prefs or config
    (async () => {
      const saved = await getSelectedCategory();
      const initial = saved ?? QUOTE_CATEGORY ?? 'inspirational';
      setCategory(initial);
      await loadDaily(initial);
    })();
  }, [loadDaily]);

  const onFavorite = useCallback(async () => {
    if (!quote) return;
    if (await isFavoriteFn(quote.id)) {
      await removeFavorite(quote.id);
      setIsFavorite(false);
    } else {
      await addFavorite(quote);
      setIsFavorite(true);
    }
  }, [quote]);

  const onSelectCategory = useCallback(
    async (cat: string) => {
      // animate out, load, animate in
      await new Promise<void>(resolve => {
        Animated.timing(catAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }).start(() => resolve());
      });
      setCategory(cat);
      await setSelectedCategory(cat);
      await loadDaily(cat);
      Animated.timing(catAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    },
    [loadDaily, catAnim],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>QuoteSpace</Text>
        <View style={styles.chipsRow}>
          {categories.map(c => (
            <Pressable
              key={c}
              onPress={() => onSelectCategory(c)}
              style={[styles.chip, category === c && styles.chipActive]}>
              <Text style={[styles.chipText, category === c && styles.chipTextActive]}>
                {c}
              </Text>
            </Pressable>
          ))}
        </View>
        <Animated.View
          style={{
            opacity: catAnim,
            transform: [
              {
                translateY: catAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [12, 0],
                }),
              },
            ],
          }}>
          {loading && <ActivityIndicator size="large" color={colors.accent} />}
          {error && <Text style={styles.error}>{error}</Text>}
          {!loading && quote && (
            <QuoteCard
              quote={quote}
              isFavorite={isFavorite}
              onToggleFavorite={onFavorite}
              onRefresh={refreshQuote}
            />
          )}
        </Animated.View>
        {/* hint removed for production cleanliness */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#0b1720'},
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#12232e',
  },
  chipActive: {backgroundColor: colors.accent},
  chipText: {color: colors.textSecondary, fontSize: 12, fontWeight: '700'},
  chipTextActive: {color: '#001017'},
  error: {
    color: colors.danger,
  },
  hintWrap: {alignItems: 'center'},
  hint: {color: colors.textSecondary, fontSize: 12},
});
