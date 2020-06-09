import firebase from 'firebase';
import { AttendanceType } from './AttendanceType';
import { CreditTypeId } from './CreditType';

export interface Attendance {
  credit: CreditTypeId | null;
  type: AttendanceType;
  timestamp: Date;
}

export interface FAttendance {
  credit: CreditTypeId | null;
  type: AttendanceType;
  timestamp: firebase.firestore.Timestamp;
}
