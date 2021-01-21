export interface IInvoice {
  id: string;
  chargeId: string;
  paymentId: string;
  email: string;
  items: {
    amount: number;
    currency: string;
    description: string;
    quantity?: number;
  }[];
  lastStripeEvent?: string;
  stripeInvoiceId?: string;
  stripeInvoiceRecord?: string;
  stripeInvoiceStatus?:
    | 'draft'
    | 'open'
    | 'paid'
    | 'uncollectible'
    | 'void'
    | 'payment_failed';
}

export interface ISendInvoiceRequest {
  chargeId: string;
  email: string;
  amount: number;
  description: string;
}
