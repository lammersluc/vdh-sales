import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1n2JMU_UQJqqgHQj4adl-leZtF2DV-58",
  authDomain: "vdh-sales.firebaseapp.com",
  projectId: "vdh-sales",
  appId: "1:157175479830:web:9360917c2b548b1449ff37"
};


const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const signIn = signInWithEmailAndPassword;

export { app, auth, signIn };