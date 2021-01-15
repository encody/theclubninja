export enum PaymentType {
  Manual = 'manual',
  Online = 'online',
}
export interface IPayment {
  timestamp: number;
  type: PaymentType;
  enteredByUserId?: string;
  reference?: string;
  value: number;
}
