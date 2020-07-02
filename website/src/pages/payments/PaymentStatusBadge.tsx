import React from 'react';
import Badge from 'react-bootstrap/Badge';
import {
  ILedgerEntry,
  isPaid,
  isOverdue,
  hasPayment,
} from '../../model/LedgerEntry';

export function PaymentStatusBadge(props: { entry: ILedgerEntry }) {
  if (isPaid(props.entry)) {
    return <Badge variant="light">Paid</Badge>;
  } else if (isOverdue(props.entry)) {
    return <Badge variant="danger">Overdue</Badge>;
  } else if (hasPayment(props.entry)) {
    return <Badge variant="success">Partial</Badge>;
  }

  return <Badge variant="info">Pending</Badge>;
}
