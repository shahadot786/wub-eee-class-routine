/**
 * English translation strings
 */
import type { TranslationKey } from "./bn";

const en: Record<TranslationKey, string> = {
  // App
  appName: "WUB EEE Class Routine",
  deptName: "Dept. of EEE · WUB",

  // Navigation
  "nav.home": "Home",
  "nav.week": "Week",
  "nav.notifications": "Notification",
  "nav.settings": "Settings",

  // Home Screen
  "home.title": "Today's Classes",
  "home.noClass": "No class today 🎉",
  "home.semesterBreak": "Semester Break",
  "home.semesterBreakSub": "No active semester right now",
  "home.daysLeft": "days left",
  "home.until": "Until",
  "home.nextClass": "Next Class",
  "home.noMoreClasses": "No more classes today. Relax! ☕",
  "home.courseTitle": "Semester Subjects",
  "home.courseCode": "Code",
  "home.courseCredit": "Credit",
  "home.courseTeacher": "Teacher",

  // Badges
  "badge.live": "LIVE",
  "badge.inMinutes": "In {{n}} min",
  "badge.class": "Class",
  "badge.lab": "Lab",

  // Week Screen
  "week.title": "Weekly Schedule",

  // Day Names
  "days.MON": "Monday",
  "days.TUE": "Tuesday",
  "days.WED": "Wednesday",
  "days.THU": "Thursday",
  "days.FRI": "Friday",
  "days.SUN": "Sunday",

  // Day Short Names
  "days.short.MON": "Mon",
  "days.short.TUE": "Tue",
  "days.short.WED": "Wed",
  "days.short.THU": "Thu",
  "days.short.FRI": "Fri",
  "days.short.SUN": "Sun",

  // Notification Screen
  "notif.title": "Notification Settings",
  "notif.masterOn": "All notifications on",
  "notif.masterOff": "All notifications off",
  "notif.before15": "15 minutes before",
  "notif.before15Sub": "Time to get ready",
  "notif.before5": "5 minutes before",
  "notif.before5Sub": "Last-minute reminder",
  "notif.atStart": "At start time",
  "notif.atStartSub": "Exactly when class begins",
  "notif.preview": "Notification Preview",
  "notif.permissionRequired": "Permission required to send notifications",
  "notif.grantPermission": "Grant Permission",

  // Notification Push Content
  "notif.pushTitle": "🔔 WUB EEE — Class Reminder",
  "notif.pushBody15": "{{title}} starts in 15 min!\n📍 {{room}} · {{teacher}}",
  "notif.pushBody5": "{{title}} starts in 5 min!\n📍 {{room}} · {{teacher}}",
  "notif.pushBodyAt": "{{title}} is starting now!\n📍 {{room}} · {{teacher}}",
  "notif.test": "Send Test Notification",

  // Settings Screen
  "settings.title": "Settings",
  "settings.theme": "Theme",
  "settings.themeLight": "Light",
  "settings.themeDark": "Dark",
  "settings.themeAuto": "Auto",
  "settings.language": "Language",
  "settings.batch": "Change Batch",
  "settings.batchCurrent": "Current batch: {{batch}}",
  "settings.version": "App Version",
  "settings.lastUpdated": "Last Updated",
  "settings.sync": "Sync Data",
  "settings.syncing": "Syncing...",
  "settings.syncDone": "Data updated",
  "settings.deptInfo": "WUB — Dept. of Electrical & Electronic Engineering",
  "settings.never": "Never",

  // Batch Select Screen
  "batch.title": "Enter Your Batch Code",
  "batch.placeholder": "e.g. 94B",
  "batch.confirm": "View Routine",
  "batch.error": "No classes found for this batch",
  "batch.hint": "Enter your batch code (e.g. 94B, 91A)",
  "batch.loading": "Loading data...",

  // Common
  "common.loading": "Loading...",
  "common.error": "Something went wrong",
  "common.retry": "Try Again",
  "common.offline": "Offline mode — showing cached data",
};

export default en;
