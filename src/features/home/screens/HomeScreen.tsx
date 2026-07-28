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
import { LiveCard } from '../../../components/LiveCard';
import { CountryTabs } from '../../../components/CountryTabs';
import { colors } from '../../../core/theme/colors';
import { strings } from '../../../core/theme/strings';
import { MOCK_DATA, COUNTRY_TABS } from '../data/mockData';

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
            <X size={20} color={colors.iconGray} />
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
              <Search size={20} color={colors.iconGray} />
            </TouchableOpacity>

            {/* Bell + badge */}
            <TouchableOpacity style={styles.iconCircle}>
              <Bell size={20} color={colors.iconGray} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>

            {/* Bag icon in green gradient circle */}
            <TouchableOpacity>
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.greenCircle}
              >
                <ShoppingBag size={20} color={colors.white} />
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
          <Flame size={18} color={colors.orangeAccent} fill={colors.orangeAccent} style={{ marginRight: 6 }} />
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
      
      <CountryTabs
        tabs={COUNTRY_TABS}
        activeTab={activeCountry}
        onTabChange={setActiveCountry}
      />
      
      {/* Scrollable list containing both the carousel and the grid */}
      <FlatList
        ListHeaderComponent={renderTrendingCarousel()}
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
                  <X size={24} color={colors.white} />
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
                        <Eye size={14} color={colors.grayMedium} style={{ marginRight: 4 }} />
                        <Text style={styles.modalViewersText}>
                          {selectedCreator.viewers} {strings.modal.watching}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Hotness Meter shown on Detail Modals to show extra premium styling */}
                  <View style={styles.hotMeterContainer}>
                    <View style={styles.hotMeterRow}>
                      <Flame size={16} color={colors.hotGradientStart} fill={colors.hotGradientStart} style={{ marginRight: 4 }} />
                      <Text style={styles.hotMeterTitle}>{strings.modal.trendingMeter}</Text>
                    </View>
                    <View style={styles.hotProgressBg}>
                      <LinearGradient
                        colors={[colors.hotGradientStart, colors.hotGradientEnd]}
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
                      color={followedIds.includes(selectedCreator.id) ? colors.white : colors.black}
                      fill={followedIds.includes(selectedCreator.id) ? colors.white : 'none'}
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
    shadowColor: colors.primary,
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
    color: colors.white,
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
    color: colors.grayDark,
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
    color: colors.grayMedium,
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
    color: colors.grayDark,
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
    backgroundColor: colors.grayDark,
    elevation: 4,
    shadowColor: colors.black,
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
    backgroundColor: colors.orangeAccent,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  rankText: {
    color: colors.white,
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
    color: colors.white,
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
    borderColor: colors.orangeAccent,
  },
  carouselName: {
    color: colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  carouselStatus: {
    color: colors.orangeLight,
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
    backgroundColor: colors.black,
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
    backgroundColor: colors.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modalLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
    marginRight: 6,
  },
  modalLiveText: {
    color: colors.white,
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
    borderColor: colors.accent,
    marginRight: 12,
  },
  modalCreatorInfo: {
    flex: 1,
  },
  modalCreatorName: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalViewersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  modalViewersText: {
    color: colors.grayLight,
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
    color: colors.white,
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
    color: colors.grayLighter,
    fontSize: 14,
    lineHeight: 20,
  },
  modalFollowButton: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
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
    color: colors.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalFollowingButtonText: {
    color: colors.white,
  },
});
