/**
 * Local Notification Service
 *
 * Schedules and manages local push notifications for class reminders.
 * All notifications are device-local — no server required.
 */

import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';

import type { ScheduleItem, NotificationPreferences, Language } from '@/types';
import { parseTimeToday } from '@/services/scheduleService';

// ─── Notification Handler Config ─────────────────────────────────

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ─── Background Task ─────────────────────────────────────────────

const BACKGROUND_TASK_NAME = 'MORNING_NOTIFICATION_RESCHEDULE';

// ─── Permissions ─────────────────────────────────────────────────

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('class-reminders', {
      name: 'Class Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// ─── Schedule Notifications ──────────────────────────────────────

export async function scheduleNotificationsForToday(
  classes: ScheduleItem[],
  preferences: NotificationPreferences,
  language: Language,
): Promise<void> {
  // Cancel all previously scheduled notifications first
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!preferences.enabled) return;

  const now = new Date();

  for (const cls of classes) {
    const classStart = parseTimeToday(cls.Start);

    if (classStart <= now) continue; // skip past classes

    const offsets: { ms: number; key: 'before15' | 'before5' | 'atStart' }[] = [];

    if (preferences.before15) offsets.push({ ms: 15 * 60 * 1000, key: 'before15' });
    if (preferences.before5) offsets.push({ ms: 5 * 60 * 1000, key: 'before5' });
    if (preferences.atStart) offsets.push({ ms: 0, key: 'atStart' });

    for (const offset of offsets) {
      const triggerTime = new Date(classStart.getTime() - offset.ms);
      if (triggerTime <= now) continue;

      let body: string;
      if (offset.key === 'atStart') {
        body =
          language === 'bn'
            ? `${cls.Title} এখনই শুরু হচ্ছে!\n📍 ${cls.Room} · ${cls.Teacher}`
            : `${cls.Title} is starting now!\n📍 ${cls.Room} · ${cls.Teacher}`;
      } else if (offset.key === 'before5') {
        body =
          language === 'bn'
            ? `${cls.Title} শুরু হবে ৫ মিনিটে!\n📍 ${cls.Room} · ${cls.Teacher}`
            : `${cls.Title} starts in 5 min!\n📍 ${cls.Room} · ${cls.Teacher}`;
      } else {
        body =
          language === 'bn'
            ? `${cls.Title} শুরু হবে ১৫ মিনিটে!\n📍 ${cls.Room} · ${cls.Teacher}`
            : `${cls.Title} starts in 15 min!\n📍 ${cls.Room} · ${cls.Teacher}`;
      }

      const title =
        language === 'bn'
          ? '🔔 WUB EEE — ক্লাস রিমাইন্ডার'
          : '🔔 WUB EEE — Class Reminder';

      const secondsFromNow = Math.floor((triggerTime.getTime() - now.getTime()) / 1000);
      if (secondsFromNow <= 0) continue;

      await Notifications.scheduleNotificationAsync({
        identifier: `${cls.Code}-${offset.key}-${classStart.getTime()}`,
        content: {
          title,
          body,
          sound: true,
          ...(Platform.OS === 'android' && { channelId: 'class-reminders' }),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: secondsFromNow,
        },
      });
    }
  }
}

// ─── Cancel All ──────────────────────────────────────────────────

export async function cancelAllScheduledNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// ─── Test Notification ───────────────────────────────────────────

export async function sendTestNotification(language: Language): Promise<void> {
  const title = language === 'bn' ? '🧪 টেস্ট রিমাইন্ডার' : '🧪 Test Reminder';
  const body =
    language === 'bn'
      ? 'এটি একটি টেস্ট নোটিফিকেশন। আপনার রিমাইন্ডার সঠিকভাবে কাজ করছে!'
      : 'This is a test notification. Your reminders are working correctly!';

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      ...(Platform.OS === 'android' && { channelId: 'class-reminders' }),
    },
    trigger: null, // send immediately
  });
}

// ─── Background Task Registration ────────────────────────────────

export function registerBackgroundTask(): void {
  try {
    if (!TaskManager.isTaskDefined(BACKGROUND_TASK_NAME)) {
      TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
        // Fallback task
        return undefined;
      });
    }
  } catch {
    console.log('Background task registration skipped');
  }
}
