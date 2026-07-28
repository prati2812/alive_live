import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../core/theme/colors';

interface Tab {
  id: string;
  label: string;
  flag?: string;
}

interface CountryTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const CountryTabs = ({ tabs, activeTab, onTabChange }: CountryTabsProps) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          const inner = (
            <>
              {tab.flag ? <Text style={styles.flagEmoji}>{tab.flag}</Text> : null}
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </>
          );

          if (isActive) {
            return (
              <TouchableOpacity key={tab.id} onPress={() => onTabChange(tab.id)} activeOpacity={0.85}>
                <LinearGradient
                  colors={[colors.tabGradientStart, colors.tabGradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.tabButton, styles.tabButtonActive]}
                >
                  {inner}
                </LinearGradient>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.75}
            >
              {inner}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 14,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
    backgroundColor: colors.grayBackground,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: colors.grayBorder,
  },
  tabButtonActive: {
    borderColor: colors.primary,
  },
  flagEmoji: {
    fontSize: 14,
    marginRight: 5,
  },
  tabText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
  tabTextActive: {
    color: colors.accentText,
    fontWeight: '700',
  },
});
