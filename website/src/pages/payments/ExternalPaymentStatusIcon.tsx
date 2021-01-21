import React from 'react';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';
import Tooltip from 'react-bootstrap/esm/Tooltip';
import * as Icon from 'react-feather';
import { IPayment } from '../../model/Payment';

interface ExternalPaymentStatusIconProps {
  payment: IPayment;
}

export function ExternalPaymentStatusIcon(
  props: ExternalPaymentStatusIconProps,
) {
  const { payment } = props;
  return (
    <>
      {payment.status === 'open' && (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={'ChargeDetails_Open' + payment.id}>
              Invoice has been created and sent.
            </Tooltip>
          }
        >
          <Icon.Send className="text-warning" size={16} />
        </OverlayTrigger>
      )}
      {payment.status === 'paid' && (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={'ChargeDetails_Paid' + payment.id}>
              Invoice has been paid.
            </Tooltip>
          }
        >
          <Icon.DollarSign className="text-success" size={16} />
        </OverlayTrigger>
      )}
      {['uncollectible', 'payment_failed', 'void'].includes(
        payment.status!,
      ) && (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={'ChargeDetails_Failed' + payment.id}>
              There was an issue with the payment. Please check the Stripe
              dashboard!
            </Tooltip>
          }
        >
          <Icon.XCircle className="text-danger" size={16} />
        </OverlayTrigger>
      )}
    </>
  );
}
