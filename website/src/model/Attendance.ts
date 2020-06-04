import firebase from 'firebase';
import Payment from './Payment';

export default interface Attendance {
  payment: Payment | null;
  timestamp: firebase.firestore.Timestamp;
}
