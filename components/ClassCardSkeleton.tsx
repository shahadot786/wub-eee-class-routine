import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

export default function ClassCardSkeleton() {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity,
        },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[styles.timeBar, { backgroundColor: colors.textSecondary + "22" }]}
        />
        <View style={styles.badges}>
          <View
            style={[
              styles.badgeStub,
              { backgroundColor: colors.textSecondary + "22" },
            ]}
          />
        </View>
      </View>

      <View
        style={[styles.titleBar, { backgroundColor: colors.textPrimary + "22" }]}
      />
      <View
        style={[styles.codeBar, { backgroundColor: colors.textSecondary + "22" }]}
      />

      <View style={styles.footer}>
        <View
          style={[
            styles.footerItem,
            { backgroundColor: colors.textSecondary + "11" },
          ]}
        />
        <View
          style={[
            styles.footerItem,
            { backgroundColor: colors.textSecondary + "11" },
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  timeBar: {
    width: 100,
    height: 14,
    borderRadius: 4,
  },
  badges: {
    flexDirection: "row",
    gap: 6,
  },
  badgeStub: {
    width: 60,
    height: 20,
    borderRadius: 10,
  },
  titleBar: {
    width: "70%",
    height: 18,
    borderRadius: 4,
    marginBottom: 8,
  },
  codeBar: {
    width: "30%",
    height: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  footerItem: {
    height: 14,
    borderRadius: 4,
    flex: 1,
  },
});
