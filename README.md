# ALive - React Native Mobile Application

ALive is a React Native mobile application designed with a Clean Architecture, following feature-based MVVM structure, integrated with Firebase Authentication, Redux Toolkit, and standard environment variables.

---

## 📁 Project Structure

The project code is organized under `src/` following a clean, scalable folder structure:

```
src/
├── assets/                # App icons, splash/screen assets, and images
│   └── images/            # Brand logos (logo_1.png)
├── components/            # Global reusable components
├── core/                  # Core modules, configs, and global utilities
│   ├── store/             # Redux Store configuration (store.ts, rootReducer.ts)
│   └── theme/             # Design Tokens (colors.ts, typography.ts)
├── features/              # Feature-based MVVM structure
│   ├── auth/              # Authentication Feature
│   │   ├── screens/       # LoginScreen.tsx
│   │   └── store/         # Auth slice, state management (authSlice.ts)
│   ├── home/              # Feed and Tab Screen Feature
│   │   ├── components/    # CountryTabs.tsx, LiveCard.tsx
│   │   └── screens/       # HomeScreen.tsx
│   └── splash/            # Boot and Session initialization screen
│       └── screens/       # SplashScreen.tsx
├── navigation/            # Navigation routing (AppNavigator, MainTabNavigator)
└── types/                 # Global TypeScript definitions (env.d.ts)
```

---

## ⚙️ Environment Variables

We use `react-native-dotenv` to manage credentials securely across platforms.

1. Create a `.env` file in the root directory:
   ```env
   GOOGLE_WEB_CLIENT_ID=web_client_id
   ```
2. See `.env.example` for format references.
3. Access variables in-code safely via TypeScript imports:
   ```typescript
   import { GOOGLE_WEB_CLIENT_ID } from '@env';
   ```

---

## 🚀 Key Features Implemented

1. **Persistent Session Handling**:
   - `SplashScreen` uses Firebase `onAuthStateChanged` to check for active sessions and direct the user straight to `Main` if logged in, bypassing `Login`.

2. **Firebase Google Sign-In**:
   - Integrated with standard Firebase Auth credentials using `getAuth` and `signInWithCredential` (Modular API).
   - Solved the native React Native Firebase v25 Android empty `accessToken` bug by retrieving and passing the accessToken manually.

3. **Curved Notch Bottom Tab Bar**:
   - Svg-designed bottom tab bar using `react-native-svg`.
   - Shallower curve, snug notch fit for the floating white circle "Go Live" action button, and custom linear gradient theme color.

4. **Stream Grid & Country Filtering**:
   - 20 unique streamer profiles mapped dynamically under 12 different countries.
   - Dynamic tab selector with light green gradient headers filtering feed content. "Global" tab resets filters to show all profiles.

---

## 🛠️ How to run locally

### Step 1: Install Dependencies
```bash
yarn install
```

### Step 2: Clear cache & start Metro
When changing `.env` variables or Babel plugins:
```bash
watchman watch-del-all && rm -rf $TMPDIR/metro-* && yarn start --reset-cache
```

### Step 3: Run Android
```bash
yarn android
```
