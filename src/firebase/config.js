  
import firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';


console.log(process.env.API_KEY)

// const firebaseConfig = {
//     apiKey: process.env.API_KEY,
//     authDomain: `${process.env.PROJECT_ID}.firebaseapp.com`,
//     projectId: process.env.PROJECT_ID,
//     storageBucket: `${process.env.PROJECT_ID}.appspot.com`,
//     messagingSenderId: process.env.SENDER_ID,
//     appId: process.env.APP_ID,
//     measurementId: process.env.MEASUREMENT_ID
//   };

const firebaseConfig = {
  apiKey: "AIzaSyCWeCTfjxsVUwaHI5PGylGHjsZnCO6Bsqw",
  authDomain: "spikehub-e49ab.firebaseapp.com",
  projectId: "spikehub-e49ab",
  storageBucket: "spikehub-e49ab.appspot.com",
  messagingSenderId: "1097438416842",
  appId: "1:1097438416842:web:27f6636670b0367fcf8933",
  measurementId: "G-5ZLN93ZY8G"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };