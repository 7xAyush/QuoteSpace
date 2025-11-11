import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, Share, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../theme/colors';
import {Quote} from '../types/quote';

type Props = {
  quote: Quote;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  onRefresh?: () => void;
  showActions?: boolean;
  typewriter?: boolean;
  typingSpeedMs?: number;
};

export function QuoteCard({
  quote,
  onToggleFavorite,
  isFavorite,
  onRefresh,
  showActions = true,
  typewriter = true,
  typingSpeedMs = 18,
}: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [quote.id, fade]);

  useEffect(() => {
    if (!typewriter) {
      setDisplayed(quote.text);
      setTyping(false);
      return;
    }

    let idx = 0;
    let cancelled = false;
    setDisplayed('');
    setTyping(true);

    const text = quote.text || '';
    const timer = setInterval(() => {
      if (cancelled) return;
      idx++;
      setDisplayed(text.slice(0, idx));
      if (idx >= text.length) {
        clearInterval(timer);
        setTyping(false);
      }
    }, Math.max(5, typingSpeedMs));

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [quote.id, quote.text, typewriter, typingSpeedMs]);

  const onShare = async () => {
    try {
      await Share.share({
        message: `"${quote.text}" — ${quote.author}`,
      });
    } catch {}
  };

  return (
    <LinearGradient
      colors={[colors.bgTop, colors.bgMid, colors.bgBottom]}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <Animated.View style={{opacity: fade}}>
        <Pressable onPress={() => { setDisplayed(quote.text); setTyping(false); }}>
          <Text style={styles.text}>“{displayed}”{typing ? '▍' : ''}</Text>
        </Pressable>
        {!typing && <Text style={styles.author}>— {quote.author}</Text>}
      </Animated.View>

      {showActions && (
        <View style={styles.actions}>
          {onRefresh && (
            <Pressable style={styles.button} onPress={onRefresh}>
              <Text style={styles.buttonText}>New</Text>
            </Pressable>
          )}
          <Pressable style={styles.button} onPress={onShare}>
            <Text style={styles.buttonText}>Share</Text>
          </Pressable>
          {onToggleFavorite && (
            <Pressable
              style={[styles.button, isFavorite && styles.favorite]}
              onPress={onToggleFavorite}>
              <Text style={styles.buttonText}>
                {isFavorite ? 'Unfavorite' : 'Favorite'}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    gap: 16,
    elevation: 3,
  },
  text: {
    color: colors.textPrimary,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  author: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    backgroundColor: colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  favorite: {
    backgroundColor: colors.favorite,
  },
  buttonText: {
    color: '#001017',
    fontWeight: '700',
  },
});

export default QuoteCard;
