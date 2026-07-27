import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { Home, Sparkles, User } from 'lucide-react-native';
import { HomeScreen } from '../features/home/screens/HomeScreen';

const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
    <Text style={{ fontSize: 18, color: '#555' }}>{name} Screen</Text>
  </View>
);

// ── Paper-plane icon for Chats ──
const ChatIcon = ({ focused }: { focused: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 2L11 13"
      stroke="#fff"
      strokeWidth={focused ? 2.5 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M22 2L15 22L11 13L2 9L22 2Z"
      stroke="#fff"
      strokeWidth={focused ? 2.5 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ── Radio-wave icon for Go Live circle ──
const RadioIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" fill="#444" />
    <Path d="M8.5 8.5a4.9 4.9 0 0 0 0 7" stroke="#444" strokeWidth={1.8} strokeLinecap="round" />
    <Path d="M15.5 8.5a4.9 4.9 0 0 1 0 7" stroke="#444" strokeWidth={1.8} strokeLinecap="round" />
    <Path d="M5.5 5.5a9.5 9.5 0 0 0 0 13" stroke="#444" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M18.5 5.5a9.5 9.5 0 0 1 0 13" stroke="#444" strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

// ── Tab icon resolver ──
const getTabIcon = (routeName: string, focused: boolean) => {
  switch (routeName) {
    case 'Home':
      return <Home size={22} color="#fff" fill={focused ? '#fff' : 'transparent'} />;
    case 'Party':
      return <Sparkles size={22} color="#fff" fill={focused ? '#fff' : 'transparent'} />;
    case 'Chats':
      return <ChatIcon focused={focused} />;
    case 'Profile':
      return <User size={22} color="#fff" fill={focused ? '#fff' : 'transparent'} />;
    default:
      return null;
  }
};

export const MainTabNavigator = () => {
  return (
    <CurvedBottomBar.Navigator
      type="DOWN"
      height={60}
      circleWidth={50}
      bgColor="#2db832"
      borderTopLeftRight={true}
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
      shadowStyle={styles.shadow}
      style={styles.barContainer}
      renderCircle={({ navigate }) => (
        <TouchableOpacity
          style={styles.goLiveCircle}
          onPress={() => navigate('GoLive')}
          activeOpacity={0.85}
        >
          <RadioIcon />
        </TouchableOpacity>
      )}
      tabBar={({ routeName, selectedTab, navigate }) => (
        <TouchableOpacity
          onPress={() => navigate(routeName)}
          style={styles.tabItem}
          activeOpacity={0.75}
        >
          {getTabIcon(routeName, selectedTab === routeName)}
          <Text
            style={[
              styles.tabLabel,
              selectedTab === routeName && styles.tabLabelActive,
            ]}
          >
            {routeName === 'GoLive' ? 'Go Live' : routeName}
          </Text>
        </TouchableOpacity>
      )}
    >
      <CurvedBottomBar.Screen name="Home" position="LEFT" component={HomeScreen} />
      <CurvedBottomBar.Screen name="Party" position="LEFT" component={() => <PlaceholderScreen name="Party" />} />
      <CurvedBottomBar.Screen name="Chats" position="RIGHT" component={() => <PlaceholderScreen name="Chats" />} />
      <CurvedBottomBar.Screen name="Profile" position="RIGHT" component={() => <PlaceholderScreen name="Profile" />} />
    </CurvedBottomBar.Navigator>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    borderTopWidth: 0,
    backgroundColor: 'transparent',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
    marginTop: 3,
  },
  tabLabelActive: {
    fontWeight: '800',
    color: '#fff',
  },
  goLiveCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 10,
    bottom: 28,
  },
});
