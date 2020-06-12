import firebase from 'firebase';

export type CreditTypeId = 'free';

export interface CreditType {
  name: string;
  limit: number;
  order: number;
}
