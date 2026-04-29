import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

export default function TabLayout() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const tabIcon = (name: IoniconsName, focused: boolean) => (
    <Ionicons
      name={name}
      size={22}
      color={focused ? colors.primary : colors.textSecondary}
    />
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surfaceAlt,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          height: 60 + (insets.bottom > 0 ? insets.bottom + 10 : 0),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("nav.home"),
          tabBarIcon: ({ focused }) =>
            tabIcon(focused ? "home" : "home-outline", focused),
        }}
      />
      <Tabs.Screen
        name="week"
        options={{
          title: t("nav.week"),
          tabBarIcon: ({ focused }) =>
            tabIcon(focused ? "calendar" : "calendar-outline", focused),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: t("nav.notifications"),
          tabBarIcon: ({ focused }) =>
            tabIcon(
              focused ? "notifications" : "notifications-outline",
              focused,
            ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("nav.settings"),
          tabBarIcon: ({ focused }) =>
            tabIcon(focused ? "settings" : "settings-outline", focused),
        }}
      />
    </Tabs>
  );
}
