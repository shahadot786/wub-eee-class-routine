/**
 * SettingsScreen
 *
 * Theme selector, language selector, batch change, app version, and department info.
 */

import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useSchedule } from "@/hooks/useSchedule";
import { useSettings } from "@/hooks/useSettings";
import type { Language, ThemeMode } from "@/types";

export default function SettingsScreen() {
  const { colors, mode, setMode } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const { userBatch, setUserBatch } = useSettings();
  const { lastUpdated, refresh, isFromCache } = useSchedule();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isSyncing, setIsSyncing] = useState(false);

  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  const themeOptions: { label: string; value: ThemeMode }[] = [
    { label: t("settings.themeLight"), value: "light" },
    { label: t("settings.themeDark"), value: "dark" },
    { label: t("settings.themeAuto"), value: "auto" },
  ];

  const langOptions: { label: string; value: Language }[] = [
    { label: "বাংলা", value: "bn" },
    { label: "English", value: "en" },
  ];

  const handleSync = async () => {
    setIsSyncing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      await refresh(true); // force = true
      Alert.alert(t("settings.sync"), t("settings.syncDone"));
    } catch {
      Alert.alert(t("settings.sync"), t("common.error"));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleChangeBatch = async () => {
    await setUserBatch(null);
    router.replace("/batch-select");
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return t("settings.never");
    const d = new Date(iso);
    return d.toLocaleDateString(language === "bn" ? "bn-BD" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
          {t("settings.title")}
        </Text>
      </View>

      {/* ─── Theme ──────────────────────────────────────────────── */}
      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
        {t("settings.theme")}
      </Text>
      <View
        style={[
          styles.segmented,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        {themeOptions.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.segmentItem,
              {
                backgroundColor:
                  mode === opt.value ? colors.primary : "transparent",
                borderColor:
                  mode === opt.value ? colors.primary : "transparent",
              },
            ]}
            onPress={() => {
              setMode(opt.value);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentText,
                {
                  color: mode === opt.value ? "#ffffff" : colors.textSecondary,
                },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ─── Language ───────────────────────────────────────────── */}
      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
        {t("settings.language")}
      </Text>
      <View
        style={[
          styles.segmented,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        {langOptions.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.segmentItem,
              {
                backgroundColor:
                  language === opt.value ? colors.primary : "transparent",
                borderColor:
                  language === opt.value ? colors.primary : "transparent",
              },
            ]}
            onPress={() => {
              setLanguage(opt.value);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentText,
                {
                  color:
                    language === opt.value ? "#ffffff" : colors.textSecondary,
                },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ─── Batch ──────────────────────────────────────────────── */}
      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
        {t("settings.batch")}
      </Text>
      <TouchableOpacity
        style={[
          styles.row,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={handleChangeBatch}
        activeOpacity={0.7}
      >
        <View>
          <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
            {t("settings.batch")}
          </Text>
          <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
            {t("settings.batchCurrent", { batch: userBatch ?? "—" })}
          </Text>
        </View>
        <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
      </TouchableOpacity>

      {/* ─── Sync Data ────────────────────────────────────────── */}
      <TouchableOpacity
        style={[
          styles.syncButton,
          { backgroundColor: colors.primary, opacity: isSyncing ? 0.7 : 1 },
        ]}
        onPress={handleSync}
        disabled={isSyncing}
        activeOpacity={0.8}
      >
        {isSyncing ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <View style={styles.syncButtonContent}>
            <Ionicons
              name="refresh-circle-outline"
              size={22}
              color="#ffffff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.syncButtonText}>{t("settings.sync")}</Text>
          </View>
        )}
      </TouchableOpacity>
      {isFromCache && (
        <View
          style={[
            styles.offlineTag,
            { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
          ]}
        >
          <Ionicons
            name="cloud-offline-outline"
            size={14}
            color={colors.textSecondary}
          />
          <Text
            style={[styles.offlineTagText, { color: colors.textSecondary }]}
          >
            {t("common.offline")}
          </Text>
        </View>
      )}

      {/* ─── Info Rows ──────────────────────────────────────────── */}
      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
        Info
      </Text>
      <View
        style={[
          styles.infoSection,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        {/* Last Updated */}
        <View
          style={[
            styles.infoRow,
            { borderBottomColor: colors.border, borderBottomWidth: 1 },
          ]}
        >
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            {t("settings.lastUpdated")}
          </Text>
          <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
            {formatDate(lastUpdated)}
          </Text>
        </View>

        {/* App Version */}
        <View
          style={[
            styles.infoRow,
            { borderBottomColor: colors.border, borderBottomWidth: 1 },
          ]}
        >
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            {t("settings.version")}
          </Text>
          <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
            v{appVersion}
          </Text>
        </View>

        {/* Dept Info */}
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            {t("settings.deptInfo")}
          </Text>
        </View>
      </View>
      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
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
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  segmented: {
    flexDirection: "row",
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: "center",
  },
  segmentText: {
    fontSize: 14,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  rowSub: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    fontWeight: "300",
  },
  infoSection: {
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  infoRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  offlineTag: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: "center",
  },
  offlineTagText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  syncButton: {
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  syncButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  syncButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
