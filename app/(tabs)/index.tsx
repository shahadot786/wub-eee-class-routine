import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ClassCard from "@/components/ClassCard";
import ClassCardSkeleton from "@/components/ClassCardSkeleton";
import EmptyState from "@/components/EmptyState";
import LiveWidget from "@/components/LiveWidget";
import SemesterBanner from "@/components/SemesterBanner";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useSchedule } from "@/hooks/useSchedule";
import { useSettings } from "@/hooks/useSettings";
import type { TranslationKey } from "@/i18n/bn";
import {
  getClassesForToday,
  getClassState,
  getScheduleForBatch,
  getTodayCode,
} from "@/services/scheduleService";
import type { ClassState as ClassStateType, ScheduleItem } from "@/types";

export default function HomeScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const {
    schedule,
    currentSemester,
    daysRemaining,
    isLoading,
    refresh,
    error,
  } = useSchedule();
  const { userBatch } = useSettings();
  const insets = useSafeAreaInsets();

  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Auto-refresh class states every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  // Get today's day name
  const todayCode = getTodayCode();
  const todayName = todayCode ? t(`days.${todayCode}` as TranslationKey) : "";

  // Get today's classes
  const todayClasses: ScheduleItem[] = useMemo(() => {
    return currentSemester && userBatch
      ? getClassesForToday(schedule, currentSemester.Semester, userBatch)
      : [];
  }, [schedule, currentSemester, userBatch]);

  // Get all unique subjects for this semester and batch
  const uniqueSubjects = useMemo(() => {
    if (!currentSemester || !userBatch) return [];
    const allBatchClasses = getScheduleForBatch(
      schedule,
      currentSemester.Semester,
      userBatch,
    );
    const seen = new Set();
    return allBatchClasses.filter((item) => {
      if (seen.has(item.Code)) return false;
      seen.add(item.Code);
      return true;
    });
  }, [schedule, currentSemester, userBatch]);

  // Loading state
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
            {t("deptName")}
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

  // Semester break or Error state
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
            {t("deptName")}
          </Text>
        </View>

        {error ? (
          <EmptyState type="error" onRetry={() => refresh(true)} />
        ) : (
          <EmptyState type="semesterBreak" />
        )}
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
          {t("deptName")}
        </Text>
        <Text style={[styles.topBarDay, { color: colors.primary }]}>
          {todayName}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Semester Banner */}
        <SemesterBanner
          semesterName={currentSemester.Semester}
          daysRemaining={daysRemaining}
        />

        {/* Live Widget */}
        <LiveWidget todayClasses={todayClasses} now={currentTime} />

        {/* Section: Today's Classes */}
        <View style={styles.sectionHeader}>
          <Ionicons name="calendar-outline" size={18} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t("home.title")}
          </Text>
        </View>

        {todayClasses.length === 0 ? (
          <View style={styles.emptyToday}>
            <EmptyState type="noClass" />
          </View>
        ) : (
          todayClasses.map((item, index) => {
            const state: ClassStateType = getClassState(item, currentTime);
            return (
              <ClassCard
                key={`${item.Code}-${item.Start}-${index}`}
                classItem={item}
                state={state}
                now={currentTime}
              />
            );
          })
        )}

        {/* Section: Semester Subjects */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Ionicons name="book-outline" size={18} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t("home.courseTitle")}
          </Text>
        </View>

        <View style={styles.subjectsContainer}>
          {uniqueSubjects.map((subject, index) => (
            <View
              key={`${subject.Code}-${index}`}
              style={[
                styles.subjectCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <View style={styles.subjectHeader}>
                <Text
                  style={[styles.subjectTitle, { color: colors.textPrimary }]}
                >
                  {subject.Title}
                </Text>
                {subject.Credit ? (
                  <View
                    style={[
                      styles.creditBadge,
                      { backgroundColor: colors.primary + "15" },
                    ]}
                  >
                    <Text
                      style={[styles.creditText, { color: colors.primary }]}
                    >
                      {subject.Credit} Credit
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.subjectInfo}>
                <View style={styles.infoItem}>
                  <Text
                    style={[styles.infoLabel, { color: colors.textSecondary }]}
                  >
                    {t("home.courseCode")}
                  </Text>
                  <Text
                    style={[styles.infoValue, { color: colors.textPrimary }]}
                  >
                    {subject.Code}
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <Text
                    style={[styles.infoLabel, { color: colors.textSecondary }]}
                  >
                    {t("home.courseTeacher")}
                  </Text>
                  <Text
                    style={[styles.infoValue, { color: colors.textPrimary }]}
                  >
                    {subject.Teacher}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  topBarDay: {
    fontSize: 14,
    fontWeight: "600",
  },
  offlineBanner: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  offlineText: {
    fontSize: 12,
    fontWeight: "500",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  emptyToday: {
    marginTop: -20,
  },
  subjectsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  subjectCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  subjectTitle: {
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  creditBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  creditText: {
    fontSize: 11,
    fontWeight: "700",
  },
  subjectInfo: {
    flexDirection: "row",
    gap: 20,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
  },
});
