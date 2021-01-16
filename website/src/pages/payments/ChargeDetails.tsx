import { DateTime } from 'luxon';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import * as Icon from 'react-feather';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { amountPaid, hasPayment, ICharge, isPaid } from '../../model/Charge';
import { IMember } from '../../model/Member';
import { PaymentType } from '../../model/Payment';
import { useServer } from '../../server';
import { bound } from '../../shared/util';
import { PaymentStatusAlert } from './PaymentStatusAlert';
import { PaymentStatusBadge } from './PaymentStatusBadge';

interface ChargeDetailsProps {
  member: IMember;
  charge: ICharge;
  onHide: () => void;
}

export function ChargeDetails(props: ChargeDetailsProps) {
  const server = useServer();
  const newPaymentValueRef: React.RefObject<HTMLInputElement> = React.createRef();

  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [newPaymentValueCents, setNewPaymentValueCents] = useState(
    props.charge.value - amountPaid(props.charge),
  );
  const [newPaymentReference, setNewPaymentReference] = useState('');

  const showAddPaymentForm = () => {
    setIsAddingPayment(true);
    newPaymentValueRef.current?.focus();
  };

  const hideAddPaymentForm = () => {
    setIsAddingPayment(false);
  };

  const updateNewPaymentValue = (value: string) => {
    const v = parseFloat(value);
    setNewPaymentValueCents(
      isNaN(v)
        ? 1
        : Math.floor(
            bound(1, v, props.charge.value - amountPaid(props.charge)),
          ),
    );
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>
          Charge: {server.model!.chargeTypes[props.charge.chargeType].name}
          {' on '}
          {DateTime.fromMillis(props.charge.start).toLocaleString(
            DateTime.DATE_SHORT,
          )}{' '}
          <PaymentStatusBadge charge={props.charge} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <PaymentStatusAlert charge={props.charge} />

        <h5>Details</h5>
        <Table responsive>
          <tbody>
            <tr>
              <td>Reason:</td>
              <td>{server.model!.chargeTypes[props.charge.chargeType].name}</td>
            </tr>
            <tr>
              <td>Created:</td>
              <td>
                {DateTime.fromMillis(props.charge.start).toLocaleString(
                  DateTime.DATETIME_SHORT,
                )}
              </td>
            </tr>
            <tr>
              <td>Due:</td>
              <td>
                {DateTime.fromMillis(props.charge.end).toLocaleString(
                  DateTime.DATETIME_SHORT,
                )}
              </td>
            </tr>
            <tr>
              <td>Amount:</td>
              <td>
                {(props.charge.value / 100).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </td>
            </tr>
            <tr>
              <td>Notes:</td>
              <td>
                {props.charge.note ? (
                  props.charge.note
                ) : (
                  <span className="text-muted">N/A</span>
                )}
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
            {!props.charge.payments.length && (
              <tr>
                <td colSpan={5} className="text-center">
                  No payments.
                </td>
              </tr>
            )}
            {props.charge.payments.map((payment, i) => (
              <tr key={i}>
                <td>
                  {DateTime.fromMillis(payment.timestamp).toLocaleString(
                    DateTime.DATETIME_SHORT,
                  )}
                </td>
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
                  {(payment.value / 100).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                  <OverlayTrigger
                    trigger="click"
                    placement="top"
                    overlay={
                      <Popover id={'popover-' + payment.id}>
                        <Popover.Content>
                          Payment ID: <code>{payment.id}</code>
                        </Popover.Content>
                      </Popover>
                    }
                  >
                    <Button className="ml-2 " variant="outline-light" size="sm">
                      <Icon.Info size={18} stroke="#999" cursor="pointer" />
                    </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
            {/* New payment form */}
            {isAddingPayment && (
              <tr>
                <td colSpan={5}>
                  <Container fluid>
                    <Form inline>
                      <Row>
                        <Col sm className="m-1">
                          <Form.Control
                            ref={newPaymentValueRef}
                            required
                            placeholder="Amount"
                            type="number"
                            min={0.01}
                            step={0.01}
                            max={props.charge.value - amountPaid(props.charge)}
                            value={newPaymentValueCents / 100}
                            onChange={e =>
                              updateNewPaymentValue(e.target.value)
                            }
                          />
                        </Col>
                        <Col sm className="m-1">
                          <Form.Control
                            placeholder="Reference link (optional)"
                            type="url"
                            value={newPaymentReference}
                            onChange={e =>
                              setNewPaymentReference(e.target.value)
                            }
                          />
                        </Col>
                        <Col sm className="m-1">
                          <Button className="mx-1">Add</Button>
                          <Button
                            className="mx-1"
                            variant="secondary"
                            onClick={() => hideAddPaymentForm()}
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
            {!isAddingPayment && !isPaid(props.charge) && (
              <tr>
                <td colSpan={5}>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="success"
                      onClick={() => showAddPaymentForm()}
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
        <div className="small text-muted mr-auto">
          Charge ID: <code>{props.charge.id}</code>
        </div>
        <Button
          variant="danger"
          disabled={hasPayment(props.charge)}
          onClick={async () => {
            props.onHide();
            const term = props.member.terms[props.charge.term]!;
            term.ledger = term.ledger.filter(
              charge => charge.id !== props.charge.id,
            );
            if (
              await server.setMembers({
                [props.member.accountId]: props.member,
              })
            ) {
              // yay
            } else {
              // TODO: Alert error
            }
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </>
  );
}
