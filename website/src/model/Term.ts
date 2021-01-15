import firebase from 'firebase';
import moment from 'moment';

export interface ITerm {
  id: string;
  name: string;
  start: number;
  end: number | null;
}
