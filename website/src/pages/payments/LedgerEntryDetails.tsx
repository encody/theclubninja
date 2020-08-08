import moment from 'moment';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import {
  amountPaid,
  hasPayment,
  ILedgerEntry,
  isPaid,
  ledgerEntryReasonString,
} from '../../model/LedgerEntry';
import { PaymentType } from '../../model/Payment';
import { bound } from '../../shared/util';
import { PaymentStatusAlert } from './PaymentStatusAlert';
import { PaymentStatusBadge } from './PaymentStatusBadge';

interface LedgerEntryDetailsProps {
  entry: ILedgerEntry;
}

interface LedgerEntryDetailsState {
  isAddingPayment: boolean;
  newPaymentValueCents: number;
  newPaymentReference: string;
}

export class LedgerEntryDetails extends React.Component<
  LedgerEntryDetailsProps,
  LedgerEntryDetailsState
> {
  private newPaymentValueRef: React.RefObject<HTMLInputElement>;

  constructor(props: LedgerEntryDetailsProps) {
    super(props);

    this.newPaymentValueRef = React.createRef();

    this.state = {
      isAddingPayment: false,
      newPaymentValueCents:
        (this.props.entry.value - amountPaid(this.props.entry)) * 100,
      newPaymentReference: '',
    };
  }

  showAddPaymentForm() {
    this.setState(
      {
        isAddingPayment: true,
      },
      () => {
        this.newPaymentValueRef.current?.focus();
      },
    );
  }

  hideAddPaymentForm() {
    this.setState({
      isAddingPayment: false,
    });
  }

  updateNewPaymentValue(value: string) {
    const v = parseFloat(value);
    this.setState({
      newPaymentValueCents: isNaN(v)
        ? 1
        : Math.floor(
            bound(
              1,
              v * 100,
              (this.props.entry.value - amountPaid(this.props.entry)) * 100,
            ),
          ),
    });
  }

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
                <th>Reference</th>
                <th>User</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {!this.props.entry.payments.length && (
                <tr>
                  <td colSpan={5} className="text-center">
                    No payments.
                  </td>
                </tr>
              )}
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
              {/* New payment form */}
              {this.state.isAddingPayment && (
                <tr>
                  <td colSpan={5}>
                    <Container fluid>
                      <Form inline>
                        <Row>
                          <Col sm className="m-1">
                            <Form.Control
                              ref={this.newPaymentValueRef}
                              required
                              placeholder="Amount"
                              type="number"
                              min={0.01}
                              step={0.01}
                              max={
                                this.props.entry.value -
                                amountPaid(this.props.entry)
                              }
                              value={this.state.newPaymentValueCents / 100}
                              onChange={e =>
                                this.updateNewPaymentValue(e.target.value)
                              }
                            />
                          </Col>
                          <Col sm className="m-1">
                            <Form.Control
                              placeholder="Reference link (optional)"
                              type="url"
                              value={this.state.newPaymentReference}
                              onChange={e =>
                                this.setState({
                                  newPaymentReference: e.target.value,
                                })
                              }
                            />
                          </Col>
                          <Col sm className="m-1">
                            <Button className="mx-1">Add</Button>
                            <Button
                              className="mx-1"
                              variant="secondary"
                              onClick={() => this.hideAddPaymentForm()}
                            >
                              Cancel
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </Container>
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              {/* Add payment button */}
              {!this.state.isAddingPayment && !isPaid(this.props.entry) && (
                <tr>
                  <td colSpan={5}>
                    <div className="d-flex justify-content-end">
                      <Button
                        variant="success"
                        onClick={() => this.showAddPaymentForm()}
                      >
                        Add Payment
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tfoot>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" disabled={hasPayment(this.props.entry)}>
            Delete
          </Button>
        </Modal.Footer>
      </>
    );
  }
}
