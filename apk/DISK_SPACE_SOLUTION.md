# Disk Space Issue - Solution Guide

## Problem
Build failed with: **"There is not enough space on the disk"**

Android builds require significant disk space (typically 5-10GB free).

## Solutions

### Option 1: Free Up Disk Space

1. **Delete temporary files:**
   ```powershell
   # Clean Windows temp files
   Remove-Item -Path "$env:TEMP\*" -Recurse -Force -ErrorAction SilentlyContinue
   
   # Clean Gradle cache (if you have space elsewhere)
   Remove-Item -Path "$env:USERPROFILE\.gradle\caches" -Recurse -Force -ErrorAction SilentlyContinue
   ```

2. **Clean Android build folders:**
   ```powershell
   cd C:\wamp64\www\folio\rahul\apk\android
   .\gradlew clean
   ```

3. **Delete node_modules and reinstall (if needed):**
   ```powershell
   cd C:\wamp64\www\folio\rahul\apk
   Remove-Item -Path "node_modules" -Recurse -Force
   npm install
   ```

### Option 2: Build on Different Drive

If C: drive is full, move project to another drive:

1. Copy entire `apk` folder to another drive (e.g., D:\)
2. Build from there:
   ```powershell
   cd D:\apk\android
   .\gradlew assembleRelease
   ```

### Option 3: Use EAS Build (Cloud - No Local Space Needed)

Since you have EAS setup, use cloud build:

1. **Login to EAS:**
   ```bash
   eas login
   ```

2. **Build in cloud:**
   ```bash
   eas build --platform android --profile production
   ```
   
   This builds on Expo's servers - no local disk space needed!

### Option 4: Build Only ARM64 (Smaller APK)

Edit `android/app/build.gradle` to build only for ARM64:

```gradle
android {
    splits {
        abi {
            reset()
            enable true
            universalApk false
            include "arm64-v8a"
        }
    }
}
```

This reduces build size significantly.

## Recommended: Use EAS Cloud Build

Since disk space is an issue, **EAS cloud build is the best option**:
- No local disk space needed
- Builds on Expo servers
- Get download link when done
- Free tier available

## After Freeing Space

Once you have enough space (at least 10GB free), try building again:

```powershell
cd C:\wamp64\www\folio\rahul\apk\android
.\gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`



