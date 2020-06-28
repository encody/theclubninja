import firebase from 'firebase';

export type CreditTypeId = 'free';

export interface ICreditType {
  name: string;
  limit: number;
  order: number;
}
