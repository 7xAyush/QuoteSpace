# QuoteSpace – Daily Quote App

A clean, simple React Native app that shows a daily motivational quote, lets you favorite quotes locally, and share them. Built with React Native CLI, React Navigation, and AsyncStorage.

## Features
- Daily quote with local caching (persists for the current day)
- Favorite/unfavorite quotes (stored in AsyncStorage)
- Favorites list with remove and share
- Share quotes via native share sheet
- Gradient background + subtle fade-in animation
- Category chips (e.g., inspirational, success, life, love)
- Per-category daily cache and category preference persists
- Favorites search and Clear All

## Tech Stack
- React Native CLI (0.72)
- TypeScript
- React Navigation (Bottom Tabs)
- AsyncStorage
- react-native-linear-gradient

## Setup
1. Prereqs
   - Node.js 16+
   - Android Studio (or Xcode for iOS)
   - Java 17 (for Android builds on RN 0.72)

2. Install
```
cd QuoteSpace
npm install
```

3. API Key (optional but recommended)
- By default the app uses ZenQuotes “today” endpoint.
- To use API Ninjas (more robust), get a free API key at https://api-ninjas.com/api/quotes
- Set it in `src/config.ts`:
```
export const API_NINJAS_KEY = 'YOUR_KEY_HERE';
```
(Optional) change the default `QUOTE_CATEGORY` if you like. You can also switch categories in-app via chips on the Home screen.

4. Run (Android)
```
npx react-native run-android
```
Ensure an Android emulator is running or a device is connected.

5. Run (iOS)
```
cd ios && pod install && cd ..
npx react-native run-ios
```

## Project Structure
```
QuoteSpace/
  src/
    api/quotes.ts         # Quote fetcher (API Ninjas or ZenQuotes)
    components/QuoteCard  # Reusable gradient card + actions
    navigation/           # Bottom tab navigator
    screens/
      HomeScreen.tsx      # Daily quote + favorite/share/new
      FavoritesScreen.tsx # List + share/remove
    storage/              # AsyncStorage keys and helpers
    theme/colors.ts       # App colors
    config.ts             # API key + category
  App.tsx                 # Entry -> RootNavigator
```

## Notes
- Quotes are cached per day to avoid repeated fetches.
- Favorites update instantly and persist across app restarts.
- No Redux needed here; AsyncStorage + local state keeps it simple.

## License
MIT
# QuoteSpace – Daily Quote App

A clean React Native app that shows daily motivational quotes with favorites, sharing, category filters, and a smooth, minimal UI.

## Features
- Daily quote with local caching (per-category, persists for the day)
- Category chips (inspirational, success, life, love, etc.)
  - Chips are shown when an API Ninjas key is set; otherwise the app uses a general daily quote fallback.
- Favorite/unfavorite quotes (AsyncStorage)
- Favorites list with search, share, and clear-all
- Gradient background, fade transitions, and typewriter quote animation

## Tech Stack
- React Native CLI (0.72) + TypeScript
- AsyncStorage for persistence
- Custom in-app tabs (no external navigation dependency)
- react-native-linear-gradient

## Setup
1. Prereqs
   - Node.js 16+
   - Android Studio (or Xcode for iOS)
   - Java 17 (for Android builds on RN 0.72)

2. Install
```
cd QuoteSpace
npm install
```

3. API Key (optional)
- Default fallback uses ZenQuotes “today” endpoint.
- To use API Ninjas, get a key at https://api-ninjas.com/api/quotes
- Put it in `src/config.local.ts`:
```
export const API_NINJAS_KEY = 'YOUR_KEY_HERE';
```
Optionally set a default `QUOTE_CATEGORY`. You can also switch categories in-app via chips on the Home screen.

4. Run (Android)
```
npx react-native run-android
```
Ensure an Android emulator is running or a device is connected.

5. Run (iOS)
```
cd ios && pod install && cd ..
npx react-native run-ios
```

## Project Structure
```
QuoteSpace/
  src/
    api/quotes.ts            # Quote fetcher (API Ninjas / ZenQuotes) with fallbacks
    components/QuoteCard     # Gradient card + typewriter + actions
    navigation/simple-tabs.tsx  # Minimal tabs (Home/Favorites)
    screens/
      HomeScreen.tsx         # Daily quote, category chips, favorite/share/new
      FavoritesScreen.tsx    # List + search/share/remove/clear
    storage/                 # AsyncStorage keys and helpers
    theme/colors.ts          # App colors
    config.ts                # Reads local override
    config.local.ts          # Local secrets (gitignored)
  App.tsx                    # Entry -> SimpleTabs
```

## Notes
- Per-category daily caching and category preference persistence
- Favorites stored locally; search and clear available

## License
MIT
