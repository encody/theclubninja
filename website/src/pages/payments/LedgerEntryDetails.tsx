import React from 'react';
import {
  ILedgerEntry,
  ledgerEntryReasonString,
  isPaid,
  isOverdue,
} from '../../model/LedgerEntry';
import { PaymentType } from '../../model/Payment';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import moment from 'moment';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { PaymentStatusAlert } from './PaymentStatusAlert';

interface LedgerEntryDetailsProps {
  entry: ILedgerEntry;
}

export class LedgerEntryDetails extends React.Component<
  LedgerEntryDetailsProps
> {
  render() {
    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title>
            Ledger Entry <PaymentStatusBadge entry={this.props.entry} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PaymentStatusAlert entry={this.props.entry} />
          <h5>Details</h5>
          <Table responsive>
            <tbody>
              <tr>
                <td>Reason:</td>
                <td>{ledgerEntryReasonString[this.props.entry.reason]}</td>
              </tr>
              <tr>
                <td>Created:</td>
                <td>
                  {moment(this.props.entry.start.toDate()).format('L LT')}
                </td>
              </tr>
              <tr>
                <td>Due:</td>
                <td>{moment(this.props.entry.end.toDate()).format('L LT')}</td>
              </tr>
              <tr>
                <td>Amount:</td>
                <td>
                  {this.props.entry.value.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </td>
              </tr>
            </tbody>
          </Table>
          <h5>Payments</h5>
          <Table responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Reference #</th>
                <th>User</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {this.props.entry.payments.map(payment => (
                <tr>
                  <td>{moment(payment.timestamp.toDate()).format('L LT')}</td>
                  <td>
                    {(payment.type === PaymentType.Online && 'Online') ||
                      'Manual'}
                  </td>
                  <td>
                    {payment.reference ? (
                      <a href="#">{payment.reference}</a>
                    ) : (
                      <span className="text-muted">N/A</span>
                    )}
                  </td>
                  <td>
                    {payment.enteredByUserId ? (
                      <a href="#">{payment.enteredByUserId}</a>
                    ) : (
                      <span className="text-muted">N/A</span>
                    )}
                  </td>
                  <td>
                    {payment.value.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {this.props.entry.payments.length === 0 && (
            <p className="text-center">No payments.</p>
          )}
        </Modal.Body>
      </>
    );
  }
}
