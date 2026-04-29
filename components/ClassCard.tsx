/**
 * ClassCard Component
 *
 * Displays a single class entry with visual state indicators:
 * - Live: cyan/teal border + LIVE badge
 * - Upcoming imminent (≤60 min): blue border + "In X min" badge
 * - Upcoming (>60 min): default border, no badge
 * - Past: faded opacity
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import type { ScheduleItem, ClassState } from '@/types';
import { getMinutesUntilStart, formatTime12h } from '@/services/scheduleService';

interface ClassCardProps {
  classItem: ScheduleItem;
  state?: ClassState;
  now?: Date;
  /** If true, don't show live/past state (for WeekScreen) */
  staticDisplay?: boolean;
}

export default function ClassCard({ classItem, state = 'upcoming', now = new Date(), staticDisplay = false }: ClassCardProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const displayState = staticDisplay ? 'upcoming' : state;
  const isPast = displayState === 'past';
  const isLive = displayState === 'live';
  const isImminent = displayState === 'upcoming-imminent';

  // Border color based on state
  const borderColor = isLive
    ? colors.live
    : isImminent
      ? colors.primary
      : colors.border;

  const borderWidth = isLive || isImminent ? 1.5 : 1;

  // Type badge colors
  const isLab = classItem.Type === 'Lab';
  const badgeBg = isLab ? colors.badgeLabBg : colors.badgeClassBg;
  const badgeText = isLab ? colors.badgeLabText : colors.badgeClassText;
  const badgeLabel = isLab ? t('badge.lab') : t('badge.class');

  // Minutes badge for imminent classes
  const minutesUntil = isImminent ? getMinutesUntilStart(classItem, now) : 0;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor,
          borderWidth,
          opacity: isPast ? 0.45 : 1,
        },
      ]}
    >
      {/* Header Row: Time + Badges */}
      <View style={styles.header}>
        <Text style={[styles.time, { color: colors.textPrimary }]}>
          {formatTime12h(classItem.Start)} — {formatTime12h(classItem.End)}
        </Text>

        <View style={styles.badges}>
          {/* Live Badge */}
          {isLive && (
            <View style={[styles.badge, { backgroundColor: colors.live + '22', borderColor: colors.live, borderWidth: 1 }]}>
              <View style={[styles.liveDot, { backgroundColor: colors.live }]} />
              <Text style={[styles.badgeText, { color: colors.live }]}>{t('badge.live')}</Text>
            </View>
          )}

          {/* Imminent Badge */}
          {isImminent && (
            <View style={[styles.badge, { backgroundColor: colors.primary + '22', borderColor: colors.primary, borderWidth: 1 }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>
                {t('badge.inMinutes', { n: minutesUntil })}
              </Text>
            </View>
          )}

          {/* Type Badge (Class / Lab) */}
          <View style={[styles.badge, { backgroundColor: badgeBg + '22', borderColor: badgeBg, borderWidth: 1 }]}>
            <Text style={[styles.badgeText, { color: badgeText }]}>{badgeLabel}</Text>
          </View>
        </View>
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
        {classItem.Title}
      </Text>

      {/* Course Code */}
      <Text style={[styles.code, { color: colors.textSecondary }]}>
        {classItem.Code}
      </Text>

      {/* Footer: Teacher + Room */}
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Text style={[styles.footerIcon, { color: colors.textSecondary }]}>👤</Text>
          <Text style={[styles.footerText, { color: colors.textSecondary }]} numberOfLines={1}>
            {classItem.Teacher}
          </Text>
        </View>
        <View style={styles.footerItem}>
          <Text style={[styles.footerIcon, { color: colors.textSecondary }]}>📍</Text>
          <Text style={[styles.footerText, { color: colors.textSecondary }]} numberOfLines={1}>
            {classItem.Room}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  time: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  code: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  footerIcon: {
    fontSize: 13,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '400',
    flex: 1,
  },
});
