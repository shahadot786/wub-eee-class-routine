# EEE Smart Class Routine

A smart, offline-first mobile application for students of the Department of Electrical & Electronic Engineering (EEE) at World University of Bangladesh (WUB). 

## 🚀 Key Features

- **Home Screen Dashboard**: See today's classes and all enrolled subjects (including teacher and credit info) in one place.
- **Offline-First**: Loads data instantly from local cache. Works perfectly without an internet connection once synchronized.
- **Smart Notifications**: Get reminded 15 minutes and 5 minutes before your class starts. Notifications work offline too!
- **Manual Sync**: Control when to update the schedule data from the Google Sheet via a dedicated button in Settings.
- **Flexible Data**: Automatically handles semester transitions and batch-specific schedules.
- **Bilingual Support**: Fully localized in both **Bengali** and **English**.
- **Theming**: Supports Light Mode and Dark Mode.

## 🛠️ Tech Stack

- **Framework**: Expo / React Native
- **Language**: TypeScript
- **State Management**: React Hooks & Context API
- **Data Source**: Google Sheets API (Public)
- **Persistence**: AsyncStorage
- **Notifications**: Expo Notifications

## ⚙️ Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
EXPO_PUBLIC_SHEET_ID=YOUR_GOOGLE_SHEET_ID
EXPO_PUBLIC_API_KEY=YOUR_GOOGLE_CLOUD_API_KEY
```

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shahadot786/eee-smart-class-routine.git
   cd eee-smart-class-routine
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the app**:
   ```bash
   npx expo start
   ```

## 📄 License

This project is developed for the EEE students of World University of Bangladesh.
