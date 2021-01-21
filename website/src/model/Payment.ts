export enum PaymentType {
  Manual = 'manual',
  Online = 'online',
}
export interface IPayment {
  id: string;
  chargeId: string;
  timestamp: number;
  type: PaymentType;
  enteredByUserId?: string;
  reference?: string;
  status?:
    | 'draft'
    | 'open'
    | 'paid'
    | 'uncollectible'
    | 'void'
    | 'payment_failed';
  value: number;
}
