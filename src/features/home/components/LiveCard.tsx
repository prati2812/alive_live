import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { Eye } from 'lucide-react-native';

interface LiveCardProps {
  id: string;
  name: string;
  viewers: string;
  imageUri: string;
  avatarUri: string;
  flag?: string;
  isFollowing: boolean;
  onFollowToggle: () => void;
  onPress: () => void;
}

export const LiveCard = ({
  name,
  viewers,
  imageUri,
  avatarUri,
  flag = '🇵🇭',
  isFollowing,
  onFollowToggle,
  onPress,
}: LiveCardProps) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.95}>
      <ImageBackground
        source={{ uri: imageUri }}
        style={styles.imageBackground}
        imageStyle={styles.image}
      >
        {/* Top: viewer count badge */}
        <View style={styles.topSection}>
          <View style={styles.viewerBadge}>
            <Eye size={11} color="#fff" style={styles.eyeIcon} />
            <Text style={styles.viewerText}>{viewers}</Text>
          </View>
        </View>

        {/* Bottom: avatar + name + flag + follow button */}
        <View style={styles.bottomSection}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarCircle} />
          )}
          <View style={styles.nameContainer}>
            <Text style={styles.nameText} numberOfLines={1}>{name}</Text>
            <Text style={styles.flagText}>{flag}</Text>
          </View>
          <TouchableOpacity
            style={[styles.followButton, isFollowing && styles.followingButton]}
            onPress={(e) => {
              e.stopPropagation(); // prevent modal opening when clicking follow button
              onFollowToggle();
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
              {isFollowing ? 'Following' : '+ Follow'}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    height: 230,
    margin: 6,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  image: {
    borderRadius: 16,
  },
  topSection: {
    alignItems: 'flex-start',
  },
  viewerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  eyeIcon: {
    marginRight: 3,
  },
  viewerText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginRight: 6,
    flexShrink: 0,
  },
  avatarImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.8)',
    marginRight: 6,
    flexShrink: 0,
  },
  nameContainer: {
    flex: 1,
    marginRight: 4,
  },
  nameText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  flagText: {
    fontSize: 11,
    marginTop: 1,
  },
  followButton: {
    backgroundColor: '#FFE600',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    flexShrink: 0,
    minWidth: 62,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  followButtonText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  followingButtonText: {
    color: '#fff',
  },
});
