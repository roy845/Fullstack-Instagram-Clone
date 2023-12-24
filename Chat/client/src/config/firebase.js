import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAEekMQcJBHUovoUFPA9R19GiBmDQf3Qig",
  authDomain: "fullstack-4298f.firebaseapp.com",
  projectId: "fullstack-4298f",
  storageBucket: "fullstack-4298f.appspot.com",
  messagingSenderId: "536370757518",
  appId: "1:536370757518:web:e3a783c305327ca237aedf",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default storage;
