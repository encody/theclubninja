import firebase from 'firebase';

export interface Waiver {
  timestamp: Date;
}

export interface FWaiver {
  timestamp: firebase.firestore.Timestamp;
}
