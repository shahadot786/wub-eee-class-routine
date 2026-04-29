/**
 * SemesterBanner Component
 *
 * Thin horizontal strip showing the current semester name and days remaining.
 * Example: "Summer 2026 · 47 দিন বাকি"
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface SemesterBannerProps {
  semesterName: string;
  daysRemaining: number;
}

export default function SemesterBanner({ semesterName, daysRemaining }: SemesterBannerProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={[styles.banner, { backgroundColor: colors.primary + "15" }]}>
      <Text style={[styles.text, { color: colors.primary }]}>
        {semesterName}
      </Text>
      <Text style={[styles.dot, { color: colors.primary }]}>·</Text>
      <Text style={[styles.text, { color: colors.primary }]}>
        {daysRemaining} {t("home.daysLeft")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 12,
    gap: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  dot: {
    fontSize: 12,
    fontWeight: "700",
  },
});
