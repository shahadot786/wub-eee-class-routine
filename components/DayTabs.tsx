/**
 * DayTabs Component
 *
 * Horizontal scrollable day selector.
 * Only shows days that have classes for the current batch.
 * Order: MON → TUE → WED → THU → FRI → SUN
 */

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";

import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import type { DayCode } from '@/types';
import type { TranslationKey } from '@/i18n/bn';

interface DayTabsProps {
  availableDays: DayCode[];
  selectedDay: DayCode;
  onDaySelect: (day: DayCode) => void;
}

export default function DayTabs({ availableDays, selectedDay, onDaySelect }: DayTabsProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceAlt, borderBottomColor: colors.border }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {availableDays.map((day) => {
          const isActive = day === selectedDay;
          return (
            <TouchableOpacity
              key={day}
              onPress={() => {
                onDaySelect(day);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={[
                styles.tab,
                {
                  backgroundColor: isActive ? colors.primary : 'transparent',
                  borderColor: isActive ? colors.primary : colors.border,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isActive ? '#ffffff' : colors.textSecondary,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {t(`days.short.${day}` as TranslationKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 13,
    letterSpacing: 0.3,
  },
});
