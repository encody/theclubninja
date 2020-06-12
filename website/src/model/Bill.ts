import firebase from 'firebase';

export interface Bill {
  term: string;
  value: number;
  note: string;
  start: firebase.firestore.Timestamp;
  end: firebase.firestore.Timestamp;
}
