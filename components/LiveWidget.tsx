import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import {
  formatTime12h,
  getClassState,
  getMinutesUntilStart,
} from "@/services/scheduleService";
import type { ScheduleItem } from "@/types";

interface LiveWidgetProps {
  todayClasses: ScheduleItem[];
  now: Date;
}

export default function LiveWidget({ todayClasses, now }: LiveWidgetProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const [nextClass, setNextClass] = useState<ScheduleItem | null>(null);
  const [currentClass, setCurrentClass] = useState<ScheduleItem | null>(null);

  useEffect(() => {
    let current: ScheduleItem | null = null;
    let next: ScheduleItem | null = null;

    for (const cls of todayClasses) {
      const state = getClassState(cls, now);
      if (state === "live") {
        current = cls;
      } else if (state === "upcoming" || state === "upcoming-imminent") {
        if (!next) next = cls;
      }
    }

    setCurrentClass(current);
    setNextClass(next);
  }, [todayClasses, now]);

  if (todayClasses.length === 0) return null;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.primary, shadowColor: colors.primary },
      ]}
    >
      <View style={styles.content}>
        {currentClass ? (
          <View style={styles.row}>
            <View style={styles.mainInfo}>
              <Text style={styles.label}>{t("badge.live").toUpperCase()}</Text>
              <Text style={styles.title} numberOfLines={1}>
                {currentClass.Title}
              </Text>
              <Text style={styles.subText}>
                {t("home.until")} {formatTime12h(currentClass.End)} •{" "}
                {currentClass.Room}
              </Text>
            </View>
            <Ionicons name="radio-outline" size={32} color="#ffffff" />
          </View>
        ) : nextClass ? (
          <View style={styles.row}>
            <View style={styles.mainInfo}>
              <Text style={styles.label}>
                {t("home.nextClass").toUpperCase()}
              </Text>
              <Text style={styles.title} numberOfLines={1}>
                {nextClass.Title}
              </Text>
              <Text style={styles.subText}>
                {formatTime12h(nextClass.Start)} — {nextClass.Room}
              </Text>
            </View>
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownVal}>
                {getMinutesUntilStart(nextClass, now)}
              </Text>
              <Text style={styles.countdownLabel}>MIN</Text>
            </View>
          </View>
        ) : (
          <View style={styles.freeRow}>
            <Ionicons name="cafe-outline" size={24} color="#ffffff" />
            <Text style={styles.freeText}>{t("home.noMoreClasses")}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  content: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainInfo: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  subText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 13,
    fontWeight: "500",
  },
  countdownContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    minWidth: 60,
  },
  countdownVal: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
  },
  countdownLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 9,
    fontWeight: "700",
  },
  freeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  freeText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
