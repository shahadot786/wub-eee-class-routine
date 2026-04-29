/**
 * Batch Select Screen
 *
 * First-launch screen where students enter their batch code (e.g. "94B").
 * Validates against current semester schedule data, then saves and navigates to tabs.
 */

import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useSchedule } from "@/hooks/useSchedule";
import { useSettings } from "@/hooks/useSettings";
import EmptyState from "@/components/EmptyState";
import { batchExistsInSchedule } from "@/services/scheduleService";

export default function BatchSelectScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const {
    schedule,
    currentSemester,
    isLoading,
    error: hookError,
    refresh,
  } = useSchedule();
  const { setUserBatch } = useSettings();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [batchInput, setBatchInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    const trimmed = batchInput.trim().toUpperCase();

    if (!trimmed) return;

    setError(null);
    setIsSubmitting(true);

    try {
      // If we have schedule data and a current semester, validate
      if (currentSemester && schedule.length > 0) {
        const exists = batchExistsInSchedule(schedule, trimmed);
        if (!exists) {
          setError(t("batch.error"));
          setIsSubmitting(false);
          return;
        }
      }

      // Save batch and navigate
      await setUserBatch(trimmed);
      router.replace("/(tabs)");
    } catch {
      setError(t("common.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerBlock}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logoImage}
          />
          <Text style={[styles.appName, { color: colors.textPrimary }]}>
            {t("appName")}
          </Text>
          <Text style={[styles.deptName, { color: colors.textSecondary }]}>
            {t("deptName")}
          </Text>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
            {t("batch.title")}
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.textPrimary,
                borderColor: error ? "#ef4444" : colors.border,
              },
            ]}
            placeholder={t("batch.placeholder")}
            placeholderTextColor={colors.textSecondary}
            value={batchInput}
            onChangeText={(text) => {
              setBatchInput(text);
              if (error) setError(null);
            }}
            autoCapitalize="characters"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleConfirm}
            maxLength={10}
          />

          {/* Error */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Initial Data Load Error */}
          {hookError && !currentSemester && !isLoading && (
            <EmptyState type="error" onRetry={() => refresh(true)} />
          )}

          {/* Hint & Loading */}
          {!hookError && (
            <>
              <Text style={[styles.hint, { color: colors.textSecondary }]}>
                {t("batch.hint")}
              </Text>

              {isLoading && (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text
                    style={[
                      styles.loadingText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {t("batch.loading")}
                  </Text>
                </View>
              )}
            </>
          )}

          {/* Confirm Button */}
          {!hookError && (
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: colors.primary,
                  opacity:
                    !batchInput.trim() || isSubmitting || isLoading ? 0.5 : 1,
                },
              ]}
              onPress={handleConfirm}
              disabled={!batchInput.trim() || isSubmitting || isLoading}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>{t("batch.confirm")}</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  headerBlock: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 22,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  deptName: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  inputSection: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  input: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1.5,
    letterSpacing: 1,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  hint: {
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
  },
  loadingRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: "400",
  },
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
