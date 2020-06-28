import firebase from 'firebase';
import { IPayment } from './Payment';

export enum LedgerEntryReason {
  ClubDues = 'club_dues',
  TeamDues = 'team_dues',
  Shoes = 'shoes',
  SingleLesson = 'single_lesson',
  Other = 'other',
}

export interface ILedgerEntry {
  term: string;
  value: number;
  note: string;
  reason: LedgerEntryReason;
  payments: IPayment[];
  start: firebase.firestore.Timestamp;
  end: firebase.firestore.Timestamp;
}
