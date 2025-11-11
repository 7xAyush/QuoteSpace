import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View, Pressable} from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

type Tab = 'Home' | 'Favorites';

export default function SimpleTabs() {
  const [tab, setTab] = useState<Tab>('Home');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        {tab === 'Home' ? <HomeScreen /> : <FavoritesScreen />}
      </View>
      <View style={styles.tabbar}>
        <TabButton label="Home" active={tab === 'Home'} onPress={() => setTab('Home')} />
        <TabButton
          label="Favorites"
          active={tab === 'Favorites'}
          onPress={() => setTab('Favorites')}
        />
      </View>
    </SafeAreaView>
  );
}

function TabButton({label, active, onPress}: {label: string; active?: boolean; onPress: () => void}) {
  return (
    <Pressable style={[styles.tabBtn, active && styles.tabBtnActive]} onPress={onPress}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#0b1720'},
  content: {flex: 1},
  tabbar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#203a43',
    backgroundColor: '#0f1d27',
  },
  tabBtn: {flex: 1, paddingVertical: 12, alignItems: 'center'},
  tabBtnActive: {backgroundColor: '#12232e'},
  tabText: {color: '#93a4b3', fontWeight: '600'},
  tabTextActive: {color: '#22d3ee'},
});

