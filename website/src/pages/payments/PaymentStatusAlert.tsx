import React from 'react';
import Alert from 'react-bootstrap/Alert';
import {
  ILedgerEntry,
  isPaid,
  isOverdue,
  hasPayment,
} from '../../model/LedgerEntry';

export function PaymentStatusAlert(props: { entry: ILedgerEntry }) {
  if (isPaid(props.entry)) {
    return <Alert variant="secondary">This entry has been paid.</Alert>;
  } else if (isOverdue(props.entry)) {
    return <Alert variant="danger">This entry is overdue.</Alert>;
  } else if (hasPayment(props.entry)) {
    return <Alert variant="success">This entry is partially paid.</Alert>;
  }

  return <Alert variant="info">This entry has not been paid.</Alert>;
}
