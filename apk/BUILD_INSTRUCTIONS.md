# Building Release APK for MyFolio

## Option 1: Using EAS Build (Cloud Build - Recommended)

1. **Login to EAS:**
   ```bash
   eas login
   ```
   Enter your Expo account credentials when prompted.

2. **Build the APK:**
   ```bash
   eas build --platform android --profile production
   ```
   
   This will build the APK in the cloud. You'll get a download link when it's done.

## Option 2: Build Locally (Requires Android Studio)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build locally:**
   ```bash
   eas build --platform android --profile production --local
   ```
   
   Note: This requires Android Studio and Android SDK to be installed.

## Option 3: Using Expo CLI (Alternative)

1. **Install Expo CLI globally:**
   ```bash
   npm install -g expo-cli
   ```

2. **Build APK:**
   ```bash
   expo build:android -t apk
   ```
   
   Note: This method is deprecated but may still work.

## After Building

- The APK file will be available for download
- For EAS builds, you'll get a download link
- For local builds, the APK will be in the `build` folder
- Install the APK on your Android device to test

## Important Notes

- Make sure your `app.json` has the correct package name: `com.myfolio.app`
- Update the API URL in `services/api.js` to your production server
- The APK will be signed and ready for distribution


