import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCtkKFAzGuNeSo1qJLfCdr_06ZK5-9M-4s",
  authDomain: "reaction-time-test-9a417.firebaseapp.com",
  projectId: "reaction-time-test-9a417",
  storageBucket: "reaction-time-test-9a417.firebasestorage.app",
  messagingSenderId: "675615229914",
  appId: "1:675615229914:web:f1312fbd8d26f2f11c22e3",
  measurementId: "G-HENW23KX8R",
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

export { db };
