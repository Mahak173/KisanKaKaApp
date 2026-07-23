import { getApp } from "@react-native-firebase/app";
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore } from "@react-native-firebase/firestore";

// The native Firebase SDK is configured from android/app/google-services.json
// (and GoogleService-Info.plist on iOS), so no JS config object is needed here.
const app = getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// if (__DEV__) {
//    //Skip Play Integrity / reCAPTCHA so Firebase "test phone numbers" work
//   // on emulators without real SMS. Never enabled in release builds.
//   auth.settings.appVerificationDisabledForTesting = true;
// }

export { app, auth, db };
