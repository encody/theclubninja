import firebase from 'firebase';
import moment from 'moment';

export interface ITerm {
  id: string;
  name: string;
  start: firebase.firestore.Timestamp;
  end: firebase.firestore.Timestamp | null;
}
