import { getApp } from "@react-native-firebase/app";
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore } from "@react-native-firebase/firestore";

// The native Firebase SDK is configured from android/app/google-services.json
// (and GoogleService-Info.plist on iOS), so no JS config object is needed here.
const app = getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
