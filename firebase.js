import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_Cz1Jd_hjI9VsJrPHPzBHUy4EzS2x0e4",
  authDomain: "prdguru.firebaseapp.com",
  projectId: "prdguru",
  storageBucket: "prdguru.appspot.com",
  messagingSenderId: "1010199411072",
  appId: "1:1010199411072:web:601a29e76f7bdfd7ba6965"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
