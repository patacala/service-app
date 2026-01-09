import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const googleServicesFileIos = process.env.EXPO_PUBLIC_GOOGLE_SERVICE_IOS_B64;
const googleServicesFileAndroid = process.env.EXPO_PUBLIC_GOOGLE_SERVICE_ANDROID_B64;

if (googleServicesFileIos) {
  const decodedIos = Buffer.from(googleServicesFileIos, 'base64').toString('utf-8');
  fs.writeFileSync('./GoogleService-Info.plist', decodedIos);
}

if (googleServicesFileAndroid) {
  const decodedAndroid = Buffer.from(googleServicesFileAndroid, 'base64').toString('utf-8');
  fs.writeFileSync('./google-services.json', decodedAndroid);
}

export default {
  expo: {
    name: "awesome-app-expo",
    slug: "contact-my-app-expo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "awesome-app-expo",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.pbarranco.contactmyapp",
      googleServicesFile: "./GoogleService-Info.plist",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.pbarranco.contactmyapp",
      versionCode: 1,
      googleServicesFile: "./google-services.json",
      permissions: [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO"
      ]
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
            unstable_allowFrameworkHeaderIncludes: true
          }
        }
      ],
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      "@react-native-google-signin/google-signin",
      "./plugins/withFirebasePodfileConfig.js",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "expo-localization",
      [
        "expo-image-picker",
        {
          photosPermission: "The app needs access to your photos to select images.",
          cameraPermission: "The app needs access to your camera to take photos."
        }
      ],
      "expo-font",
      "expo-secure-store",
      "expo-web-browser",
      "expo-video"
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    extra: {
      router: {},
      eas: {
        projectId: process.env.EXPO_PUBLIC_EXPO_PROJECT_ID
      }
    },
    owner: "contact-my-app"
  }
};