import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, ShoppingBag, Search, X, Heart, Eye, Flame, Play } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LiveCard } from '../components/LiveCard';
import { CountryTabs } from '../components/CountryTabs';
import { colors } from '../../../core/theme/colors';
import { strings } from '../../../core/theme/strings';

// ── 20 unique streamers with avatar URLs ───────────────────────
const MOCK_DATA = [
  { id: '1',  name: 'Sofia Chen',    viewers: '8.2K', flag: '🇵🇭', country: 'philippines', imageUri: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80', avatarUri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80' },
  { id: '2',  name: 'Mia Nakamura', viewers: '5.1K', flag: '🇯🇵', country: 'japan',        imageUri: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&q=80', avatarUri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&q=80' },
  { id: '3',  name: 'Priya Sharma', viewers: '12K',  flag: '🇮🇳', country: 'india',        imageUri: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80', avatarUri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80' },
  { id: '4',  name: 'Emily Rose',   viewers: '3.4K', flag: '🇺🇸', country: 'usa',          imageUri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80', avatarUri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80' },
  { id: '5',  name: 'Aisha Diallo', viewers: '7.8K', flag: '🇧🇷', country: 'brazil',       imageUri: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80', avatarUri: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&q=80' },
  { id: '6',  name: 'Luna Park',    viewers: '9.0K', flag: '🇰🇷', country: 'korea',        imageUri: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&q=80', avatarUri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80' },
  { id: '7',  name: 'Camila Reyes', viewers: '4.5K', flag: '🇲🇽', country: 'mexico',       imageUri: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=400&q=80', avatarUri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80' },
  { id: '8',  name: 'Anna Müller',  viewers: '6.3K', flag: '🇩🇪', country: 'germany',      imageUri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', avatarUri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&q=80' },
  { id: '9',  name: 'Yuna Kim',     viewers: '11K',  flag: '🇰🇷', country: 'korea',        imageUri: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80', avatarUri: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop&q=80' },
  { id: '10', name: 'Sara Ali',     viewers: '2.9K', flag: '🇵🇰', country: 'india',        imageUri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', avatarUri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80' },
  { id: '11', name: 'Mei Lin',      viewers: '15K',  flag: '🇨🇳', country: 'china',        imageUri: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80', avatarUri: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=100&h=100&fit=crop&q=80' },
  { id: '12', name: 'Fatima Noor',  viewers: '3.1K', flag: '🇸🇦', country: 'global',       imageUri: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&q=80', avatarUri: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=100&h=100&fit=crop&q=80' },
  { id: '13', name: 'Lena Popov',   viewers: '8.7K', flag: '🇷🇺', country: 'russia',       imageUri: 'https://images.unsplash.com/photo-1517365830460-955ce3be0547?w=400&q=80', avatarUri: 'https://images.unsplash.com/photo-1517365830460-955ce3be0547?w=100&h=100&fit=crop&q=80' },
  { id: '14', name: 'Bea Santos',   viewers: '6.6K', flag: '🇵🇭', country: 'philippines',  imageUri: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80', avatarUri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80' },
  { id: '15', name: 'Nina Torres',  viewers: '4.2K', flag: '🇨🇴', country: 'colombia',     imageUri: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=400&q=80', avatarUri: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=100&h=100&fit=crop&q=80' },
  { id: '16', name: 'Grace Osei',   viewers: '5.5K', flag: '🇬🇭', country: 'global',       imageUri: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80', avatarUri: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&q=80' },
  { id: '17', name: 'Hana Suzuki',  viewers: '7.2K', flag: '🇯🇵', country: 'japan',        imageUri: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&q=80', avatarUri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&q=80' },
  { id: '18', name: 'Rina Patel',   viewers: '9.8K', flag: '🇮🇳', country: 'india',        imageUri: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80', avatarUri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80' },
  { id: '19', name: 'Dani Brooks',  viewers: '1.9K', flag: '🇬🇧', country: 'global',       imageUri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80', avatarUri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80' },
  { id: '20', name: 'Yara Silva',   viewers: '13K',  flag: '🇧🇷', country: 'brazil',       imageUri: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80', avatarUri: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&q=80' },
];

const COUNTRY_TABS = [
  { id: 'global',      label: 'Global',       flag: '🌐' },
  { id: 'india',       label: 'India',        flag: '🇮🇳' },
  { id: 'philippines', label: 'Philippines',  flag: '🇵🇭' },
  { id: 'brazil',      label: 'Brazil',       flag: '🇧🇷' },
  { id: 'usa',         label: 'USA',          flag: '🇺🇸' },
  { id: 'korea',       label: 'Korea',        flag: '🇰🇷' },
  { id: 'japan',       label: 'Japan',        flag: '🇯🇵' },
  { id: 'mexico',      label: 'Mexico',       flag: '🇲🇽' },
  { id: 'germany',     label: 'Germany',      flag: '🇩🇪' },
  { id: 'china',       label: 'China',        flag: '🇨🇳' },
  { id: 'russia',      label: 'Russia',       flag: '🇷🇺' },
  { id: 'colombia',    label: 'Colombia',     flag: '🇨🇴' },
];

// Helper to parse views format "12K", "8.2K", "950" to float representation
const parseViewersVal = (vStr: string): number => {
  const clean = vStr.toUpperCase().replace('K', '');
  const num = parseFloat(clean);
  return vStr.toUpperCase().includes('K') ? num * 1000 : num;
};

export const HomeScreen = () => {
  const [activeCountry, setActiveCountry] = useState('global');
  const [activeTab, setActiveTab] = useState('Stream');
  const [followedIds, setFollowedIds] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCreator, setSelectedCreator] = useState<any>(null);

  // Toggle follow status
  const handleFollowToggle = (id: string) => {
    setFollowedIds((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]
    );
  };

  // Filter and sort mock data dynamically
  const filteredData = useMemo(() => {
    let data = [...MOCK_DATA];

    // Filter by Top Navigation tabs: "Follow" only displays followed creators
    if (activeTab === 'Follow') {
      data = data.filter((s) => followedIds.includes(s.id));
    }

    // Sort by viewer count if "Hot" tab is active (highest first)
    if (activeTab === 'Hot') {
      data.sort((a, b) => parseViewersVal(b.viewers) - parseViewersVal(a.viewers));
    }

    // Filter by active country tabs
    if (activeCountry !== 'global') {
      data = data.filter((s) => s.country === activeCountry);
    }

    // Filter by active search query
    if (searchQuery.trim().length > 0) {
      data = data.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return data;
  }, [activeTab, activeCountry, searchQuery, followedIds]);

  // Extract Top 3 Trending/Hot Streamers for the Hero Carousel (used in Hot section)
  const topTrending = useMemo(() => {
    return [...MOCK_DATA]
      .sort((a, b) => parseViewersVal(b.viewers) - parseViewersVal(a.viewers))
      .slice(0, 3);
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      {isSearching ? (
        <View style={styles.searchBarContainer}>
          <TextInput
            placeholder={strings.home.searchPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            style={styles.searchInput}
          />
          <TouchableOpacity onPress={() => { setIsSearching(false); setSearchQuery(''); }}>
            <X size={20} color="#555" />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* App logo */}
          <Image
            source={require('../../../assets/images/logo_1.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />

          {/* Right side icons */}
          <View style={styles.headerRight}>
            {/* Search icon */}
            <TouchableOpacity style={styles.iconCircle} onPress={() => setIsSearching(true)}>
              <Search size={20} color="#555" />
            </TouchableOpacity>

            {/* Bell + badge */}
            <TouchableOpacity style={styles.iconCircle}>
              <Bell size={20} color="#555" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>

            {/* Bag icon in green gradient circle */}
            <TouchableOpacity>
              <LinearGradient
                colors={['#c6f000', '#2db832']}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.greenCircle}
              >
                <ShoppingBag size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      {[strings.home.tabs.stream, strings.home.tabs.hot, strings.home.tabs.follow].map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => setActiveTab(tab === strings.home.tabs.stream ? 'Stream' : tab === strings.home.tabs.hot ? 'Hot' : 'Follow')}
          style={styles.tabItem}
        >
          <Text style={[styles.mainTabText, (activeTab === 'Stream' && tab === strings.home.tabs.stream) || (activeTab === 'Hot' && tab === strings.home.tabs.hot) || (activeTab === 'Follow' && tab === strings.home.tabs.follow) ? styles.mainTabTextActive : null]}>
            {tab}
          </Text>
          {((activeTab === 'Stream' && tab === strings.home.tabs.stream) || (activeTab === 'Hot' && tab === strings.home.tabs.hot) || (activeTab === 'Follow' && tab === strings.home.tabs.follow)) && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      ))}
    </View>
  );

  // Impressive Horizontal Swipe Carousel rendered at the top of Hot Tab
  const renderTrendingCarousel = () => {
    if (activeTab !== 'Hot') return null;

    return (
      <View style={styles.carouselContainer}>
        <View style={styles.carouselHeader}>
          <Flame size={18} color="#FF5722" fill="#FF5722" style={{ marginRight: 6 }} />
          <Text style={styles.carouselTitle}>{strings.home.carouselTitle}</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselScroll}
        >
          {topTrending.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={styles.carouselCard}
              onPress={() => setSelectedCreator(item)}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={{ uri: item.imageUri }}
                style={styles.carouselCardBg}
                imageStyle={{ borderRadius: 16 }}
              >
                <LinearGradient
                  colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.85)']}
                  style={styles.carouselOverlay}
                >
                  <View style={styles.carouselCardTop}>
                    <View style={styles.rankBadge}>
                      <Text style={styles.rankText}>#{index + 1}</Text>
                    </View>
                    <View style={styles.carouselLiveBadge}>
                      <Eye size={12} color={colors.white} style={{ marginRight: 4 }} />
                      <Text style={styles.carouselLiveText}>{item.viewers}</Text>
                    </View>
                  </View>

                  <View style={styles.carouselCardBottom}>
                    <Image source={{ uri: item.avatarUri }} style={styles.carouselAvatar} />
                    <View>
                      <Text style={styles.carouselName} numberOfLines={1}>{item.name} {item.flag}</Text>
                      <Text style={styles.carouselStatus}>{strings.home.trendingStatus}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}
      {renderTabs()}
      
      {/* Scrollable list containing both the carousel and the grid */}
      <FlatList
        ListHeaderComponent={
          <>
            {renderTrendingCarousel()}
            <CountryTabs
              tabs={COUNTRY_TABS}
              activeTab={activeCountry}
              onTabChange={setActiveCountry}
            />
          </>
        }
        data={filteredData}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LiveCard
            id={item.id}
            name={item.name}
            viewers={item.viewers}
            imageUri={item.imageUri}
            avatarUri={item.avatarUri}
            flag={item.flag}
            isFollowing={followedIds.includes(item.id)}
            onFollowToggle={() => handleFollowToggle(item.id)}
            onPress={() => setSelectedCreator(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
      />

      {/* Creator Detail Modal */}
      {selectedCreator && (
        <Modal
          visible={true}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setSelectedCreator(null)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <ImageBackground
              source={{ uri: selectedCreator.imageUri }}
              style={styles.modalBgImage}
            >
              {/* Top Bar inside modal */}
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setSelectedCreator(null)}
                >
                  <X size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.modalLiveBadge}>
                  <View style={styles.modalLiveDot} />
                  <Text style={styles.modalLiveText}>{strings.modal.live}</Text>
                </View>
              </View>

              {/* Bottom details with gradient overlay */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.85)']}
                style={styles.modalOverlay}
              >
                <View style={styles.modalContent}>
                  {/* Creator Info */}
                  <View style={styles.modalCreatorRow}>
                    <Image source={{ uri: selectedCreator.avatarUri }} style={styles.modalAvatar} />
                    <View style={styles.modalCreatorInfo}>
                      <Text style={styles.modalCreatorName}>
                        {selectedCreator.name} {selectedCreator.flag}
                      </Text>
                      <View style={styles.modalViewersRow}>
                        <Eye size={14} color="#aaa" style={{ marginRight: 4 }} />
                        <Text style={styles.modalViewersText}>
                          {selectedCreator.viewers} {strings.modal.watching}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Hotness Meter shown on Detail Modals to show extra premium styling */}
                  <View style={styles.hotMeterContainer}>
                    <View style={styles.hotMeterRow}>
                      <Flame size={16} color="#FF9800" fill="#FF9800" style={{ marginRight: 4 }} />
                      <Text style={styles.hotMeterTitle}>{strings.modal.trendingMeter}</Text>
                    </View>
                    <View style={styles.hotProgressBg}>
                      <LinearGradient
                        colors={['#FF9800', '#F44336']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.hotProgressFill, { width: `${Math.min(100, Math.floor(parseViewersVal(selectedCreator.viewers) / 120))}%` }]}
                      />
                    </View>
                  </View>

                  <Text style={styles.modalBio}>
                    {strings.modal.bio}
                  </Text>

                  {/* Follow button inside modal */}
                  <TouchableOpacity
                    style={[
                      styles.modalFollowButton,
                      followedIds.includes(selectedCreator.id) && styles.modalFollowingButton,
                    ]}
                    onPress={() => handleFollowToggle(selectedCreator.id)}
                  >
                    <Heart
                      size={20}
                      color={followedIds.includes(selectedCreator.id) ? '#fff' : '#000'}
                      fill={followedIds.includes(selectedCreator.id) ? '#fff' : 'none'}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={[
                        styles.modalFollowButtonText,
                        followedIds.includes(selectedCreator.id) && styles.modalFollowingButtonText,
                      ]}
                    >
                      {followedIds.includes(selectedCreator.id) ? strings.modal.following : strings.modal.followCreator}
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </ImageBackground>
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  /* ── Header ── */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 8,
    height: 52,
  },
  headerLogo: {
    width: 72,
    height: 40,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.grayBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error,
    borderRadius: 7,
    minWidth: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  greenCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /* ── Search Bar ── */
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayBackground,
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 0,
  },
  /* ── Stream / Hot / Follow tabs ── */
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingBottom: 2,
  },
  tabItem: {
    marginRight: 22,
    alignItems: 'center',
  },
  mainTabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#aaa',
  },
  mainTabTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  tabUnderline: {
    marginTop: 3,
    height: 2.5,
    width: '80%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  /* ── Hot Section Carousel ── */
  carouselContainer: {
    paddingVertical: 10,
    backgroundColor: colors.background,
  },
  carouselHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  carouselTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  carouselScroll: {
    paddingHorizontal: 14,
    gap: 12,
  },
  carouselCard: {
    width: 160,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#333',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  carouselCardBg: {
    flex: 1,
  },
  carouselOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  carouselCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankBadge: {
    backgroundColor: '#FF5722',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  rankText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  carouselLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  carouselLiveText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  carouselCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carouselAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#FF5722',
  },
  carouselName: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  carouselStatus: {
    color: '#FFcc80',
    fontSize: 9,
    fontWeight: '600',
  },
  /* ── Grid ── */
  listContent: {
    paddingHorizontal: 6,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  /* ── Modal Layout ── */
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalBgImage: {
    flex: 1,
    justifyContent: 'space-between',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff3b30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modalLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 6,
  },
  modalLiveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  modalContent: {
    gap: 14,
  },
  modalCreatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFE600',
    marginRight: 12,
  },
  modalCreatorInfo: {
    flex: 1,
  },
  modalCreatorName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalViewersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  modalViewersText: {
    color: '#ccc',
    fontSize: 12,
  },
  hotMeterContainer: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 10,
    marginTop: 4,
  },
  hotMeterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  hotMeterTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  hotProgressBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  hotProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  modalBio: {
    color: '#eee',
    fontSize: 14,
    lineHeight: 20,
  },
  modalFollowButton: {
    flexDirection: 'row',
    backgroundColor: '#FFE600',
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  modalFollowingButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  modalFollowButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalFollowingButtonText: {
    color: '#fff',
  },
});
