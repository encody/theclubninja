import firebase from 'firebase';
import moment from 'moment';

export interface Term {
  id: string;
  name: string;
  start: firebase.firestore.Timestamp;
  end: firebase.firestore.Timestamp | null;
}
