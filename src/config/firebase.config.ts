// // Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// // import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
//   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);

// src/config/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Lee variables desde Vite (deben empezar con VITE_)
const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? '',
};

// Flag para activar/desactivar Firebase
export const isFirebaseEnabled = Boolean(cfg.apiKey && cfg.projectId && cfg.appId);

let app = null;
let auth = null;

try {
  if (isFirebaseEnabled) {
    app = initializeApp(cfg);
    auth = getAuth(app);
  } else {
    console.warn('[Firebase] deshabilitado: faltan variables de entorno VITE_');
  }
} catch (e) {
  console.warn('[Firebase] deshabilitado por error de inicialización:', e);
}

export { app, auth };

