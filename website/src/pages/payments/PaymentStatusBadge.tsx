import React from 'react';
import Badge from 'react-bootstrap/Badge';
import {
  ILedgerEntry,
  isPaid,
  isOverdue,
  hasPayment,
} from '../../model/LedgerEntry';

export function PaymentStatusBadge(props: {
  entry?: ILedgerEntry;
  variant?: 'paid' | 'overdue' | 'partial' | 'pending';
}) {
  if (props.variant === 'paid' || props.entry && isPaid(props.entry)) {
    return <Badge variant="light">Paid</Badge>;
  } else if (props.variant === 'overdue' || props.entry && isOverdue(props.entry)) {
    return <Badge variant="danger">Overdue</Badge>;
  } else if (props.variant === 'partial' || props.entry && hasPayment(props.entry)) {
    return <Badge variant="success">Partial</Badge>;
  }

  return <Badge variant="info">Pending</Badge>;
}
