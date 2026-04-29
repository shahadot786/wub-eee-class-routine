/**
 * WeekScreen — Weekly Schedule
 *
 * Shows the full week's schedule for the student's batch.
 * Day tabs only show days that have classes. Default tab is today (if classes exist).
 */

import React, { useEffect, useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ClassCard from "@/components/ClassCard";
import ClassCardSkeleton from "@/components/ClassCardSkeleton";
import DayTabs from "@/components/DayTabs";
import EmptyState from "@/components/EmptyState";
import SemesterBanner from "@/components/SemesterBanner";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useSchedule } from "@/hooks/useSchedule";
import { useSettings } from "@/hooks/useSettings";
import {
  getDaysWithClasses,
  getScheduleForBatch,
  getTodayCode,
} from "@/services/scheduleService";
import type { DayCode } from "@/types";

export default function WeekScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { schedule, currentSemester, daysRemaining, isLoading } = useSchedule();
  const { userBatch } = useSettings();
  const insets = useSafeAreaInsets();

  // Available days for this batch
  const availableDays = useMemo(() => {
    if (!currentSemester || !userBatch) return [];
    return getDaysWithClasses(schedule, currentSemester.Semester, userBatch);
  }, [schedule, currentSemester, userBatch]);

  // Default selected day: today if it has classes, otherwise first available
  const [selectedDay, setSelectedDay] = useState<DayCode>("MON");

  useEffect(() => {
    if (availableDays.length === 0) return;

    const today = getTodayCode();
    if (today && availableDays.includes(today)) {
      setSelectedDay(today);
    } else {
      setSelectedDay(availableDays[0]);
    }
  }, [availableDays]);

  // Classes for the selected day
  const dayClasses = useMemo(() => {
    if (!currentSemester || !userBatch) return [];
    return getScheduleForBatch(
      schedule,
      currentSemester.Semester,
      userBatch,
      selectedDay,
    );
  }, [schedule, currentSemester, userBatch, selectedDay]);

  // Loading
  if (isLoading) {
    return (
      <View
        style={[
          styles.screen,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
          <Text style={[styles.topBarTitle, { color: colors.textPrimary }]}>
            {t("week.title")}
          </Text>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: 12 }}
        >
          <ClassCardSkeleton />
          <ClassCardSkeleton />
          <ClassCardSkeleton />
        </ScrollView>
      </View>
    );
  }

  // Semester break
  if (!currentSemester) {
    return (
      <View
        style={[
          styles.screen,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
          <Text style={[styles.topBarTitle, { color: colors.textPrimary }]}>
            {t("week.title")}
          </Text>
        </View>
        <EmptyState type="semesterBreak" />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      {/* Top Bar */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <Text style={[styles.topBarTitle, { color: colors.textPrimary }]}>
          {t("week.title")}
        </Text>
      </View>

      {/* Semester Banner */}
      <SemesterBanner
        semesterName={currentSemester.Semester}
        daysRemaining={daysRemaining}
      />

      {/* Day Tabs */}
      {availableDays.length > 0 && (
        <DayTabs
          availableDays={availableDays}
          selectedDay={selectedDay}
          onDaySelect={setSelectedDay}
        />
      )}

      {/* Classes for Selected Day */}
      {dayClasses.length === 0 ? (
        <EmptyState type="noClass" />
      ) : (
        <FlatList
          data={dayClasses}
          keyExtractor={(item, index) => `${item.Code}-${item.Start}-${index}`}
          renderItem={({ item }) => (
            <ClassCard classItem={item} staticDisplay />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 120 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 20,
  },
});
