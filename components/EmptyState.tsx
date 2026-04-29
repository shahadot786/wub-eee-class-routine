import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LottieView from "lottie-react-native";

import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

interface EmptyStateProps {
  type: "noClass" | "semesterBreak" | "error";
  onRetry?: () => void;
}

const ANIMATIONS = {
  noClass:
    "https://assets10.lottiefiles.com/packages/lf20_kd5497vg.json", // Party/Relax
  semesterBreak:
    "https://assets1.lottiefiles.com/packages/lf20_6wru9asf.json", // Coffee/Rest
  error: "https://assets9.lottiefiles.com/packages/lf20_jkzt067v.json", // Error/Disconnected
};

export default function EmptyState({ type, onRetry }: EmptyStateProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  let title = t("home.noClass");
  let subtitle: string | undefined = undefined;

  if (type === "semesterBreak") {
    title = t("home.semesterBreak");
    subtitle = t("home.semesterBreakSub");
  } else if (type === "error") {
    title = t("common.error");
    subtitle = t("common.offline");
  }

  return (
    <View style={styles.container}>
      <LottieView
        source={{ uri: ANIMATIONS[type] }}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      )}

      {type === "error" && onRetry && (
        <TouchableOpacity
          style={[styles.retryButton, { borderColor: colors.primary }]}
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <Text style={[styles.retryText, { color: colors.primary }]}>
            {t("common.retry")}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    marginTop: -20,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  retryText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
