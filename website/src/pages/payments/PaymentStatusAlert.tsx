import React from 'react';
import Alert from 'react-bootstrap/Alert';
import { hasPayment, ICharge, isOverdue, isPaid } from '../../model/Charge';

export function PaymentStatusAlert(props: { charge: ICharge }) {
  if (isPaid(props.charge)) {
    return <Alert variant="secondary">This charge has been paid.</Alert>;
  } else if (isOverdue(props.charge)) {
    return <Alert variant="danger">This charge is overdue.</Alert>;
  } else if (hasPayment(props.charge)) {
    return <Alert variant="success">This charge is partially paid.</Alert>;
  }

  return <Alert variant="info">This charge has not been paid.</Alert>;
}
