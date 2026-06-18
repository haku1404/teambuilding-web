import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCLqabwUCha5Qap6nsdSuqx2Mg9jkcpcdI",
  authDomain: "a3-badminton.firebaseapp.com",
  projectId: "a3-badminton",
  storageBucket: "a3-badminton.firebasestorage.app",
  messagingSenderId: "495072972318",
  appId: "1:495072972318:web:7adb86255ad39cfaa4680f",
  databaseURL: "https://a3-badminton-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
get(ref(db, 'gallery')).then((snapshot) => {
    if (snapshot.exists()) {
        console.log("Gallery has data:", JSON.stringify(snapshot.val(), null, 2));
    } else {
        console.log("Gallery is empty.");
    }
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
