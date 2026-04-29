/**
 * NotificationScreen — Notification Preferences
 *
 * Master toggle + three individual toggles for class reminders.
 * Includes a notification preview card.
 */

import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useSchedule } from "@/hooks/useSchedule";
import { useSettings } from "@/hooks/useSettings";
import {
  requestNotificationPermissions,
  scheduleNotificationsForToday,
} from "@/services/notifService";
import { getClassesForToday } from "@/services/scheduleService";
import type { NotificationPreferences } from "@/types";

export default function NotificationScreen() {
  const { colors } = useTheme();
  const { t, language } = useLanguage();
  const { notifPrefs, setNotifPrefs, userBatch } = useSettings();
  const { schedule, currentSemester } = useSchedule();
  const insets = useSafeAreaInsets();

  const [hasPermission, setHasPermission] = useState(true);

  // Check permission on mount
  useEffect(() => {
    requestNotificationPermissions().then(setHasPermission);
  }, []);

  // Reschedule when prefs change
  const updatePrefs = useCallback(
    async (newPrefs: NotificationPreferences) => {
      await setNotifPrefs(newPrefs);

      if (currentSemester && userBatch) {
        const todayClasses = getClassesForToday(
          schedule,
          currentSemester.Semester,
          userBatch,
        );
        await scheduleNotificationsForToday(todayClasses, newPrefs, language);
      }
    },
    [setNotifPrefs, currentSemester, userBatch, schedule, language],
  );

  const toggleMaster = () => {
    const newEnabled = !notifPrefs.enabled;
    updatePrefs({ ...notifPrefs, enabled: newEnabled });
  };

  const togglePref = (key: "before15" | "before5" | "atStart") => {
    updatePrefs({ ...notifPrefs, [key]: !notifPrefs[key] });
  };

  const handleGrantPermission = async () => {
    const granted = await requestNotificationPermissions();
    setHasPermission(granted);
  };

  return (
    <ScrollView
      style={[
        styles.screen,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <Text style={[styles.topBarTitle, { color: colors.textPrimary }]}>
          {t("notif.title")}
        </Text>
      </View>

      {/* Permission Warning */}
      {!hasPermission && (
        <View
          style={[
            styles.permissionBanner,
            { backgroundColor: colors.badgeLabBg + "22" },
          ]}
        >
          <Text style={[styles.permissionText, { color: colors.badgeLabText }]}>
            {t("notif.permissionRequired")}
          </Text>
          <TouchableOpacity
            style={[
              styles.permissionButton,
              { borderColor: colors.badgeLabText },
            ]}
            onPress={handleGrantPermission}
          >
            <Text
              style={[
                styles.permissionButtonText,
                { color: colors.badgeLabText },
              ]}
            >
              {t("notif.grantPermission")}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Master Toggle */}
      <View
        style={[
          styles.section,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>
              {notifPrefs.enabled ? t("notif.masterOn") : t("notif.masterOff")}
            </Text>
          </View>
          <Switch
            value={notifPrefs.enabled}
            onValueChange={toggleMaster}
            trackColor={{ false: colors.border, true: colors.primary + "66" }}
            thumbColor={
              notifPrefs.enabled ? colors.primary : colors.textSecondary
            }
          />
        </View>
      </View>

      {/* Individual Toggles */}
      <View
        style={[
          styles.section,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            opacity: notifPrefs.enabled ? 1 : 0.5,
          },
        ]}
      >
        {/* 15 min before */}
        <View
          style={[
            styles.toggleRow,
            { borderBottomColor: colors.border, borderBottomWidth: 1 },
          ]}
        >
          <View style={styles.toggleInfo}>
            <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>
              {t("notif.before15")}
            </Text>
            <Text style={[styles.toggleSub, { color: colors.textSecondary }]}>
              {t("notif.before15Sub")}
            </Text>
          </View>
          <Switch
            value={notifPrefs.before15}
            onValueChange={() => togglePref("before15")}
            disabled={!notifPrefs.enabled}
            trackColor={{ false: colors.border, true: colors.primary + "66" }}
            thumbColor={
              notifPrefs.before15 ? colors.primary : colors.textSecondary
            }
          />
        </View>

        {/* 5 min before */}
        <View
          style={[
            styles.toggleRow,
            { borderBottomColor: colors.border, borderBottomWidth: 1 },
          ]}
        >
          <View style={styles.toggleInfo}>
            <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>
              {t("notif.before5")}
            </Text>
            <Text style={[styles.toggleSub, { color: colors.textSecondary }]}>
              {t("notif.before5Sub")}
            </Text>
          </View>
          <Switch
            value={notifPrefs.before5}
            onValueChange={() => togglePref("before5")}
            disabled={!notifPrefs.enabled}
            trackColor={{ false: colors.border, true: colors.primary + "66" }}
            thumbColor={
              notifPrefs.before5 ? colors.primary : colors.textSecondary
            }
          />
        </View>

        {/* At start */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>
              {t("notif.atStart")}
            </Text>
            <Text style={[styles.toggleSub, { color: colors.textSecondary }]}>
              {t("notif.atStartSub")}
            </Text>
          </View>
          <Switch
            value={notifPrefs.atStart}
            onValueChange={() => togglePref("atStart")}
            disabled={!notifPrefs.enabled}
            trackColor={{ false: colors.border, true: colors.primary + "66" }}
            thumbColor={
              notifPrefs.atStart ? colors.primary : colors.textSecondary
            }
          />
        </View>
      </View>

      {/* Notification Preview */}
      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
        {t("notif.preview")}
      </Text>
      <View
        style={[
          styles.previewCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.previewTitle, { color: colors.textPrimary }]}>
          {t("notif.pushTitle")}
        </Text>
        <Text style={[styles.previewBody, { color: colors.textSecondary }]}>
          {t("notif.pushBody15", {
            title: "Digital Electronics",
            room: "Room 01",
            teacher: "Nayeem Hasan Mallick",
          })}
        </Text>
      </View>

      {/* Test Button
      <TouchableOpacity
        style={[
          styles.testButton,
          { backgroundColor: colors.surface, borderColor: colors.primary },
        ]}
        onPress={() => sendTestNotification(language)}
        activeOpacity={0.7}
      >
        <Text style={[styles.testButtonText, { color: colors.primary }]}>
          {t("notif.test")}
        </Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
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
  permissionBanner: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 10,
  },
  permissionText: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  permissionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  permissionButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  toggleInfo: {
    flex: 1,
    marginRight: 12,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  toggleSub: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  previewCard: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  previewBody: {
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 20,
  },
  testButton: {
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  testButtonText: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
