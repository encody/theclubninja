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

export function isPaid(entry: ILedgerEntry) {
  return (
    entry.payments.reduce((total, payment) => total + payment.value, 0) ===
    entry.value
  );
}

export function isOverdue(entry: ILedgerEntry) {
  return Date.now() > entry.end.toDate().getTime() && !isPaid(entry);
}

export function hasPayment(entry: ILedgerEntry) {
  return entry.payments.length > 0;
}
