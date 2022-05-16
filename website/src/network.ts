import axios from 'axios';
import firebase from './firebase';

const instance = axios.create();

firebase.auth().onAuthStateChanged(async newUser => {
  console.log({newUser});
  if (newUser) {
  }
});

export default instance;
