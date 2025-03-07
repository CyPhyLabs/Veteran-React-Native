# **Veteran-React-Native**

## **Table of Contents**

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Project Structure](#project-structure)
- [Running the App](#running-the-app)
- [Building the App](#building-the-app)
- [EAS (Expo Application Services)](#eas)
- [Running on a Physical Device](#running-on-a-physical-device)
- [Cleanup and Debugging](#cleanup-and-debugging)
- [Common Issues and Fixes](#common-issues-and-fixes)

---

## **Introduction**

This repository contains the code for the **veteran React Native application** using **Expo**. This guide will walk you through **setting up**, **running**, **building**, and **cleaning up** the environment, covering both **Android and iOS** workflows.

---

## **Prerequisites**

Ensure you have the following installed:

- **Node.js** (>= 14.x, recommended: 18.x)
- **npm** (>= 6.x) or **yarn** (>= 1.x)
- **Expo CLI**
  ```bash
  npm install -g expo-cli
  ```
- **EAS CLI**
  ```bash
  npm install -g eas-cli
  ```
- **Android Setup:**
  - **Android Studio**
  - **Java Development Kit (JDK) 11 or later**
  - **Android Emulator or a Physical Device with USB Debugging enabled**
- **iOS Setup (Mac users only):**
  - **Xcode** (Latest version recommended)
  - **CocoaPods**
    ```bash
    sudo gem install cocoapods
    ```
  - **iOS Simulator or a Physical iOS Device**

---

## **Setup**

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-repo/veteran-react-native.git
   cd veteran-react-native/t2t-veteran
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   OR

   ```bash
   yarn install
   ```

3. **Create an environment file**

   ```bash
   cp .env.example .env
   ```

   - Update `.env` with your API keys, Firebase credentials, and other necessary configurations.

4. **Verify the installation**

   ```bash
   npx expo doctor
   ```

   If any dependencies are missing, install them.

---

## **Project Structure**
# T2T Veteran React Native

## Directory Structure

```plaintext
t2t-veteran/
├── src/                        # Source files
│   ├── components/            # Reusable components
│   │   ├── common/           # Shared UI components
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   └── Card/
│   │   └── layout/           # Layout components
│   │       ├── Header/
│   │       └── Footer/
│   ├── screens/              # Application screens
│   │   ├── auth/            # Authentication screens
│   │   │   ├── LoginScreen.js
│   │   │   └── RegisterScreen.js
│   │   └── main/            # Main app screens
│   │       ├── HomeScreen.js
│   │       └── ProfileScreen.js
│   ├── navigation/           # Navigation setup
│   │   ├── AppNavigator.js  # Main navigation
│   │   ├── stacks/          # Stack navigators
│   │   └── tabs/            # Tab navigators
│   ├── services/            # API and services
│   │   ├── api.js          # Base API setup
│   │   ├── auth.service.js # Auth services
│   │   └── user.service.js # User services
│   ├── utils/               # Utilities
│   │   ├── validation.js   # Form validation
│   │   └── helpers.js      # Helper functions
│   ├── context/            # React Context
│   │   └── AuthContext.js  # Auth state management
│   └── styles/             # Global styles
│       ├── colors.js      # Color definitions
│       └── typography.js  # Typography styles
├── assets/                  # Static assets
│   ├── images/            # Image files
│   │   ├── logo.png
│   │   └── icons/
│   └── fonts/             # Custom fonts
├── android/                # Android native files
│   ├── app/
│   │   └── build.gradle
│   └── gradle/
├── ios/                    # iOS native files
│   ├── Podfile
│   └── t2t-veteran.xcworkspace/
├── config/                 # Configuration files
│   └── env.js            # Environment config
└── root files
    ├── .env              # Environment variables
    ├── .env.example      # Example env file
    ├── .gitignore       # Git ignore rules
    ├── app.json         # Expo config
    ├── babel.config.js  # Babel settings
    ├── metro.config.js  # Metro bundler config
    ├── package.json     # Dependencies
    └── README.md        # Documentation
```
## Quick Links

- [/src/components](t2t-veteran/src/components) - Reusable UI components
- [/src/screens](t2t-veteran/src/screens) - Application screens
- [/src/navigation](t2t-veteran/src/navigation) - Navigation configuration
- [/src/services](t2t-veteran/src/services) - API and services
- [/src/utils](t2t-veteran/src/utils) - Helper functions
- [/src/context](t2t-veteran/src/context) - Context providers
- [/src/styles](t2t-veteran/src/styles) - Global styles

## Key Files

- [app.json](t2t-veteran/app.json) - Expo configuration
- [package.json](t2t-veteran/package.json) - Project dependencies
- [.env.example](t2t-veteran/.env.example) - Environment variables template
- [metro.config.js](t2t-veteran/metro.config.js) - Metro bundler configuration

## Platform-Specific

### Android
- [android/app/build.gradle](t2t-veteran/android/app/build.gradle) - Android build configuration
- [android/settings.gradle](t2t-veteran/android/settings.gradle) - Android settings

### iOS
- [ios/Podfile](t2t-veteran/ios/Podfile) - iOS dependencies
- [ios/t2t-veteran.xcworkspace](t2t-veteran/ios/t2t-veteran.xcworkspace) - Xcode workspace
---

## **Running the App**

### **1. Run the app using Expo**

```bash
npx expo start
```

- Scan the **QR Code** using **Expo Go** on your mobile device.
- Press `` to open on an Android emulator.
- Press `` to open on an iOS simulator.

### **2. Run on an Emulator/Simulator**

#### **Android**

```bash
npx expo start --android
```

- Ensure **Android Studio** is running with an **emulator** open.

#### **iOS** (Mac only)

```bash
npx expo start --ios
```

- Ensure **Xcode** is installed and **iOS Simulator** is running.

#### **Web**

```bash
npx expo start --web
```

- Runs the app in a web browser.

---

## **Building the App**

### **1. Android Build**

1. Open Android Studio and ensure all SDKs are installed.
2. Run:
   ```bash
   npx expo run:android
   ```
   OR
   ```bash
   eas build --platform android
   ```

### **2. iOS Build (Mac only)**

1. Navigate to the iOS folder:
   ```bash
   cd ios
   pod install
   cd ..
   ```
2. Run:
   ```bash
   npx expo run:ios
   ```
   OR
   ```bash
   eas build --platform ios
   ```

---

## **EAS (Expo Application Services)**

### **1. Development Build**

```bash
eas build --profile development --platform all
```

### **2. Preview Build**

```bash
eas build --profile preview --platform all
```

### **3. Production Build**

```bash
eas build --profile production --platform all
```

### **4. Submit to App Stores**

```bash
eas submit --platform all
```

- Ensure **App Store** and **Google Play credentials** are set up.

---

## **Running on a Physical Device**

### **Android (ADB Debugging)**

1. Connect your Android device via USB.
2. Enable **USB Debugging** in Developer options.
3. Run:
   ```bash
   npx expo run:android --device
   ```

### **iOS (Physical Device)**

1. Ensure your device is connected to the same Wi-Fi as your Mac.
2. Use the following:
   ```bash
   npx expo run:ios --device
   ```
3. If you encounter issues, use **Xcode** to run the project directly.

---

## **Cleanup and Debugging**

### **1. Clear Expo Cache**

```bash
expo start -c
```

### **2. Remove and Reinstall Dependencies**

```bash
rm -rf node_modules package-lock.json
npm install
```

OR

```bash
yarn install
```

### **3. Reset npm Cache**

```bash
npm cache clean --force
```

### **4. Remove and Reinstall Pods (iOS)**

```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### **5. Force Rebuild**

```bash
expo r -c
```

---

## **Common Issues and Fixes**

### **Issue: “Command Not Found” for Expo**

Fix:

```bash
npm install -g expo-cli
```

### **Issue: Metro Bundler stuck on “Starting project...”**

Fix:

```bash
rm -rf .expo
expo start -c
```

### **Issue: Emulator Not Found**

- Ensure **Android Studio** is open and an emulator is running.

### **Issue: iOS Build Fails**

Fix:

```bash
cd ios
pod install --verbose
cd ..
```

### **Issue: Debugging with React Native Debugger**

1. Install React Native Debugger:
   ```bash
   brew install --cask react-native-debugger
   ```
2. Open **Developer Menu** in Expo (Shake device or `Ctrl + m`) → Enable **Remote JS Debugging**.

---

This README provides **detailed setup, run, build, and debugging instructions** for React Native development using **Expo and EAS**.

