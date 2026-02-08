# Building APK Without Expo (Like JetlyChat)

JetlyChat uses **React Native CLI** (not Expo). Here's how to convert your app and build APKs the same way.

## Option 1: Convert Expo App to React Native CLI

### Step 1: Generate Native Folders
```bash
cd apk
npx expo prebuild
```

This will create `android/` and `ios/` folders.

### Step 2: Install Dependencies
```bash
npm install
cd android
./gradlew clean
cd ..
```

### Step 3: Build Release APK
```bash
cd android
./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

## Option 2: Use React Native CLI Directly (Like JetlyChat)

### Step 1: Initialize React Native Project
```bash
cd ..
npx react-native init MyFolioNative --version 0.72.6
```

### Step 2: Copy Your App Files
- Copy `App.js` and components
- Copy `services/` folder
- Update `package.json` dependencies

### Step 3: Build APK
```bash
cd android
./gradlew assembleRelease
```

## Option 3: Quick Build with Prebuild (Recommended)

Since you already have Expo setup, use prebuild:

```bash
cd apk
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

## Signing the APK (For Release)

1. **Generate Keystore:**
```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore myfolio-release-key.keystore -alias myfolio -keyalg RSA -keysize 2048 -validity 10000
```

2. **Update `android/app/build.gradle`:**
```gradle
signingConfigs {
    release {
        storeFile file('myfolio-release-key.keystore')
        storePassword 'YOUR_PASSWORD'
        keyAlias 'myfolio'
        keyPassword 'YOUR_PASSWORD'
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
    }
}
```

## Build Commands Reference

- **Debug APK:** `./gradlew assembleDebug`
- **Release APK:** `./gradlew assembleRelease`
- **Clean Build:** `./gradlew clean assembleRelease`

## Requirements

- Android Studio installed
- Android SDK configured
- JAVA_HOME set
- Gradle (comes with Android Studio)

