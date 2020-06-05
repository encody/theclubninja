import firebase from 'firebase';
import { Credit, FCredit } from './Credit';

export interface Attendance {
  credit: Credit | null;
  timestamp: Date;
}

export interface FAttendance {
  credit: firebase.firestore.DocumentReference | null;
  timestamp: firebase.firestore.Timestamp;
}
