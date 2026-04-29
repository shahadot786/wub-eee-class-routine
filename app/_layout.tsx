import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  useFonts,
} from "@expo-google-fonts/outfit";
import debounce from "lodash.debounce";
import { NavigationDarkTheme, NavigationLightTheme } from "@/constants/theme";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { useSettings } from "@/hooks/useSettings";
import { useSchedule } from "@/hooks/useSchedule";
import {
  registerBackgroundTask,
  scheduleNotificationsForToday,
} from "@/services/notifService";
import { getClassesForToday } from "@/services/scheduleService";
import { ThemeProvider as NavThemeProvider } from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

// ─── Inner Layout (has access to contexts) ───────────────────────

function InnerLayout() {
  const { colors, resolvedMode, isReady: themeReady } = useTheme();
  const { userBatch, isReady: settingsReady, notifPrefs } = useSettings();
  const { schedule, currentSemester, isLoading } = useSchedule();
  const { language } = useLanguage();
  const segments = useSegments();
  const router = useRouter();

  // Load Custom Fonts
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  const isReady =
    themeReady && settingsReady && !isLoading && fontsLoaded;

  // Redirect to batch-select if no batch is saved
  useEffect(() => {
    if (!isReady) return;

    const inBatchSelect = segments[0] === "batch-select";

    if (!userBatch && !inBatchSelect) {
      router.replace("/batch-select");
    } else if (userBatch && inBatchSelect) {
      router.replace("/(tabs)");
    }
  }, [isReady, userBatch, segments, router]);

  // Env Safety Check
  useEffect(() => {
    if (
      !process.env.EXPO_PUBLIC_SHEET_ID ||
      !process.env.EXPO_PUBLIC_API_KEY
    ) {
      console.error("Missing Environment Variables!");
      Alert.alert(
        "Config Error",
        "Required environment variables (SHEET_ID/API_KEY) are missing. Check your .env file.",
      );
    }
  }, []);

  // Handle Notifications (Debounced)
  const debouncedSchedule = useMemo(
    () =>
      debounce((todayClasses, notifPrefs, language) => {
        scheduleNotificationsForToday(todayClasses, notifPrefs, language);
      }, 1000),
    [],
  );

  useEffect(() => {
    registerBackgroundTask();
  }, []);

  useEffect(() => {
    if (isReady && currentSemester && userBatch) {
      const todayClasses = getClassesForToday(
        schedule,
        currentSemester.Semester,
        userBatch,
      );
      debouncedSchedule(todayClasses, notifPrefs, language);
    }
  }, [
    isReady,
    schedule,
    currentSemester,
    userBatch,
    notifPrefs,
    language,
    debouncedSchedule,
  ]);

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const navTheme =
    resolvedMode === "dark" ? NavigationDarkTheme : NavigationLightTheme;

  return (
    <NavThemeProvider value={navTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="batch-select"
          options={{
            presentation: "fullScreenModal",
            animation: "fade",
          }}
        />
      </Stack>
      <StatusBar style={resolvedMode === "dark" ? "light" : "dark"} />
    </NavThemeProvider>
  );
}

// ─── Root Layout (provides contexts) ─────────────────────────────

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <ThemeProvider>
          <LanguageProvider>
            <InnerLayout />
          </LanguageProvider>
        </ThemeProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
