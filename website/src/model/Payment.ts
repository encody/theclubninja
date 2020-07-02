export enum PaymentType {
  Manual = 'manual',
  Online = 'online',
}
export interface IPayment {
  timestamp: firebase.firestore.Timestamp;
  type: PaymentType;
  enteredByUserId?: string;
  reference?: string;
  value: number;
}
