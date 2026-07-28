import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { logout } from '../../auth/store/authSlice';
import LinearGradient from 'react-native-linear-gradient';
import { LogOut, Settings, Shield, HelpCircle, ChevronRight, Award, Play } from 'lucide-react-native';
import { colors } from '../../../core/theme/colors';
import { strings } from '../../../core/theme/strings';

const { width } = Dimensions.get('window');
const GRID_ITEM_SIZE = (width - 48) / 3; // 3 items per row with padding

export const ProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);

  const handleLogout = async () => {
    Alert.alert(
      strings.profile.logoutTitle,
      strings.profile.logoutConfirm,
      [
        { text: strings.profile.cancel, style: 'cancel' },
        {
          text: strings.profile.logout,
          style: 'destructive',
          onPress: async () => {
            try {
              const auth = getAuth();
              await auth.signOut();
              await GoogleSignin.signOut().catch(() => { });
              dispatch(logout());
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };



  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{strings.profile.title}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Info Card */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={[colors.tabGradientStart, colors.white]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.cardGradient}
          >
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80' }}
                style={styles.avatar}
              />
              <View style={styles.badgeContainer}>
                <Award size={14} color={colors.white} />
              </View>
            </View>
            <Text style={styles.userName}>{user?.name || 'ALive User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>

            {/* User Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statCount}>120</Text>
                <Text style={styles.statLabel}>{strings.profile.followers}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statBox}>
                <Text style={styles.statCount}>45</Text>
                <Text style={styles.statLabel}>{strings.profile.following}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statBox}>
                <Text style={styles.statCount}>{strings.profile.level}</Text>
                <Text style={styles.statLabel}>{strings.profile.status}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>



        {/* Options Menu */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconWrapper}><Settings size={20} color={colors.iconGray} /></View>
              <Text style={styles.menuItemLabel}>{strings.profile.accountSettings}</Text>
            </View>
            <ChevronRight size={18} color={colors.iconLightGray} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconWrapper}><Shield size={20} color={colors.iconGray} /></View>
              <Text style={styles.menuItemLabel}>{strings.profile.privacySecurity}</Text>
            </View>
            <ChevronRight size={18} color={colors.iconLightGray} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconWrapper}><HelpCircle size={20} color={colors.iconGray} /></View>
              <Text style={styles.menuItemLabel}>{strings.profile.helpSupport}</Text>
            </View>
            <ChevronRight size={18} color={colors.iconLightGray} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
          <LinearGradient
            colors={[colors.logoutGradientStart, colors.logoutGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoutGradient}
          >
            <LogOut size={20} color={colors.white} style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>{strings.profile.logout}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBackground,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  scrollContent: {
    paddingBottom: 110, // Avoid bottom tab bar overlap
  },
  profileCard: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.white,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  cardGradient: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  highlightsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE * 1.3,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.grayBorder,
  },
  gridGif: {
    width: '100%',
    height: '100%',
  },
  gridOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    justifyContent: 'flex-end',
    padding: 6,
  },
  gridViewsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridViewsText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBorder,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.grayBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  logoutButton: {
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
  },
  logoutGradient: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
