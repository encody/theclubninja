import firebase from 'firebase';
import { CreditTypeId } from './CreditType';

export interface Attendance {
  credit: CreditTypeId | null;
  timestamp: Date;
}

export interface FAttendance {
  credit: CreditTypeId | null;
  timestamp: firebase.firestore.Timestamp;
}
