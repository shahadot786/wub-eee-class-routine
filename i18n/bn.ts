/**
 * Bangla (বাংলা) translation strings
 */
const bn = {
  // App
  appName: "WUB EEE ক্লাস রুটিন",
  deptName: "ইইই বিভাগ · WUB",

  // Navigation
  "nav.home": "হোম",
  "nav.week": "সপ্তাহ",
  "nav.notifications": "নোটিফিকেশন",
  "nav.settings": "সেটিংস",

  // Home Screen
  "home.title": "আজকের ক্লাস",
  "home.noClass": "আজ কোনো ক্লাস নেই 🎉",
  "home.semesterBreak": "সেমিস্টার বিরতি",
  "home.semesterBreakSub": "বর্তমানে কোনো সেমিস্টার চলছে না",
  "home.daysLeft": "দিন বাকি",
  "home.until": "পর্যন্ত",
  "home.courseTitle": "সেমিস্টারের বিষয়সমূহ",
  "home.nextClass": "পরবর্তী ক্লাস",
  "home.noMoreClasses": "আজ আর কোনো ক্লাস নেই। বিশ্রাম নিন! ☕",
  "home.courseCode": "কোড",
  "home.courseCredit": "ক্রেডিট",
  "home.courseTeacher": "শিক্ষক",

  // Badges
  "badge.live": "LIVE",
  "badge.inMinutes": "{{n}} মিনিটে",
  "badge.class": "ক্লাস",
  "badge.lab": "ল্যাব",

  // Week Screen
  "week.title": "সাপ্তাহিক রুটিন",

  // Day Names
  "days.MON": "সোমবার",
  "days.TUE": "মঙ্গলবার",
  "days.WED": "বুধবার",
  "days.THU": "বৃহস্পতিবার",
  "days.FRI": "শুক্রবার",
  "days.SUN": "রবিবার",

  // Day Short Names
  "days.short.MON": "সোমবার",
  "days.short.TUE": "মঙ্গলবার",
  "days.short.WED": "বুধবার",
  "days.short.THU": "বৃহস্পতিবার",
  "days.short.FRI": "শুক্রবার",
  "days.short.SUN": "রবিবার",

  // Notification Screen
  "notif.title": "নোটিফিকেশন সেটিংস",
  "notif.masterOn": "সব নোটিফিকেশন চালু",
  "notif.masterOff": "সব নোটিফিকেশন বন্ধ",
  "notif.before15": "১৫ মিনিট আগে",
  "notif.before15Sub": "প্রস্তুতির জন্য সময়",
  "notif.before5": "৫ মিনিট আগে",
  "notif.before5Sub": "শেষ মুহূর্তের reminder",
  "notif.atStart": "শুরুর সময়ে",
  "notif.atStartSub": "ক্লাস শুরু হওয়ার সাথে সাথে",
  "notif.preview": "নোটিফিকেশন প্রিভিউ",
  "notif.permissionRequired": "নোটিফিকেশন পাঠাতে অনুমতি প্রয়োজন",
  "notif.grantPermission": "অনুমতি দিন",

  // Notification Push Content
  "notif.pushTitle": "🔔 WUB EEE — ক্লাস রিমাইন্ডার",
  "notif.pushBody15":
    "{{title}} শুরু হবে ১৫ মিনিটে!\n📍 {{room}} · {{teacher}}",
  "notif.pushBody5": "{{title}} শুরু হবে ৫ মিনিটে!\n📍 {{room}} · {{teacher}}",
  "notif.pushBodyAt": "{{title}} এখনই শুরু হচ্ছে! 📍 {{room}} · {{teacher}}",
  "notif.test": "টেস্ট নোটিফিকেশন পাঠান",

  // Settings Screen
  "settings.title": "সেটিংস",
  "settings.theme": "থিম",
  "settings.themeLight": "Light",
  "settings.themeDark": "Dark",
  "settings.themeAuto": "Auto",
  "settings.language": "ভাষা",
  "settings.batch": "ব্যাচ পরিবর্তন",
  "settings.batchCurrent": "বর্তমান ব্যাচ: {{batch}}",
  "settings.version": "অ্যাপ ভার্সন",
  "settings.lastUpdated": "সর্বশেষ আপডেট",
  "settings.sync": "ডাটা সিঙ্ক করুন",
  "settings.syncing": "সিঙ্ক হচ্ছে...",
  "settings.syncDone": "ডাটা আপডেট হয়েছে",
  "settings.deptInfo": "WUB — ইলেকট্রিক্যাল ও ইলেকট্রনিক ইঞ্জিনিয়ারিং বিভাগ",
  "settings.never": "কখনো না",

  // Batch Select Screen
  "batch.title": "তোমার Batch Code লেখো",
  "batch.placeholder": "যেমন: 94B",
  "batch.confirm": "রুটিন দেখো",
  "batch.error": "এই ব্যাচ এর কোনো ক্লাস পাওয়া যায়নি",
  "batch.hint": "তোমার ব্যাচ কোড লেখো (যেমন 94B, 91A)",
  "batch.loading": "ডেটা লোড হচ্ছে...",

  // Common
  "common.loading": "লোড হচ্ছে...",
  "common.error": "কিছু একটা ভুল হয়েছে",
  "common.retry": "আবার চেষ্টা করো",
  "common.offline": "অফলাইন মোড — ক্যাশ থেকে দেখাচ্ছে",
} as const;

export type TranslationKey = keyof typeof bn;
export default bn;
