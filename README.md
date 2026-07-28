# ALive - React Native Mobile Application

ALive is a premium React Native mobile application built following Clean Architecture, a feature-based MVVM folder structure, Redux Toolkit, Firebase Authentication (Google Sign-In), and Axios for API networking.

---

## 📁 Project Structure

The project codebase is organized under `src/` following a clean, scalable folder structure:

```
src/
├── assets/                # App icons, splash/screen assets, and images
│   └── images/            # Brand logos (logo_1.png)
├── components/            # Global reusable UI components
│   ├── CountryTabs.tsx    # Country navigation selector with linear gradients
│   └── LiveCard.tsx       # Live streamer feed card with overlays & stats
├── core/                  # Core modules, configs, and global utilities
│   ├── network/           # API clients & network utilities
│   │   └── apiClient.ts   # Axios wrapper configured with interceptors for REST APIs
│   ├── store/             # Redux Store configuration (index.ts)
│   └── theme/             # Design Tokens & Stylesheets
│       ├── colors.ts      # Main palette (ALive Green, secondary gradients, badges)
│       └── strings.ts     # Localized UI string constants
├── features/              # Feature-based MVVM structure
│   ├── auth/              # Authentication Feature
│   │   ├── screens/       # LoginScreen.tsx (Google Auth only)
│   │   └── store/         # Auth slice & action creators (authSlice.ts)
│   ├── home/              # Live Stream Feed Feature
│   │   ├── data/          # Mock streamer feed datasets
│   │   └── screens/       # HomeScreen.tsx (Feed, Creator details modal, Search)
│   ├── profile/           # User Profile & Account Settings Feature
│   │   └── screens/       # ProfileScreen.tsx (Stats, Menu, Logout)
│   └── splash/            # Boot and Session initialization screen
│       └── screens/       # SplashScreen.tsx (Scale & opacity animation)
├── navigation/            # Navigation routing (AppNavigator, MainTabNavigator)
│   ├── AppNavigator.tsx   # Root stack navigator
│   └── MainTabNavigator.tsx # Custom Curved Notch Bottom Tab Bar configuration
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
   - `SplashScreen` uses Firebase `onAuthStateChanged` to check for active sessions and direct the user straight to the `Main` screen if logged in, bypassing `Login`.

2. **Firebase Google Sign-In**:
   - Integrated with standard Firebase Auth credentials using `getAuth` and `signInWithCredential`.
   - Solved the native React Native Firebase v25 Android empty `accessToken` bug by retrieving and passing the `accessToken` manually from `GoogleSignin.getTokens()`.

3. **Curved Notch Bottom Tab Bar**:
   - Svg-designed bottom tab bar using `react-native-svg` and `react-native-curved-bottom-bar`.
   - Snug notch fit for the floating white circle "Go Live" action button, and custom gradient theme coloring.

4. **Stream Grid & Country Filtering**:
   - Streamer profiles mapped dynamically under different countries.
   - Dynamic tab selector with light green gradient headers filtering feed content. "Global" tab resets filters to show all profiles.

5. **Theme Consistency & Code Quality**:
   - Fully eliminated inline hardcoded hex values in screens by centralizing them into [colors.ts](file:///Users/apple/workspace/alive_live/alive_live/src/core/theme/colors.ts).

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
