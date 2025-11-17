# MyFolio - React Native App

A React Native app to view portfolio contacts and visits with list and details views.

## Features

- **List View**: Browse all contacts in a scrollable list
- **Details View**: View detailed information about a specific contact
- **Toggle Buttons**: Switch between List and Details views
- **Pull to Refresh**: Refresh the contact list
- **API Integration**: Fetches data from your portfolio API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update API URL in `services/api.js`:
   - Change `BASE_URL` to your live server URL (e.g., `https://rahulkushwaha.net`)

## Running on Connected Device

### For Android (via USB):

1. Enable USB Debugging on your Android device:
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times to enable Developer Options
   - Go to Settings > Developer Options
   - Enable "USB Debugging"

2. Connect your device via USB cable

3. Verify device is connected:
```bash
adb devices
```

4. Start the app:
```bash
npm run android
```
or
```bash
expo start --android
```

### For iOS (via USB):

1. Connect your iPhone via USB cable

2. Start the app:
```bash
npm run ios
```
or
```bash
expo start --ios
```

## Development

- Start Expo: `npm start` or `expo start`
- Run on Android: `npm run android`
- Run on iOS: `npm run ios`
- Run on Web: `npm run web`

## Project Structure

```
apk/
├── App.js                 # Main app component
├── components/
│   ├── ContactsList.js    # List view component
│   └── ContactsDetails.js # Details view component
├── services/
│   └── api.js            # API service for fetching data
├── package.json
└── app.json
```

## API Endpoints

The app fetches data from:
- `/api/contacts.php` - Contact form submissions
- `/api/visits.php` - Site visitor data

Make sure these endpoints are accessible from your mobile device's network.

