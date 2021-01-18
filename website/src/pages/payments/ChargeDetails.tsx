import { DateTime } from 'luxon';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/esm/Spinner';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import * as Icon from 'react-feather';
import * as uuid from 'uuid';
import { amountPaid, hasPayment, ICharge, isPaid } from '../../model/Charge';
import { IMember } from '../../model/Member';
import { PaymentType } from '../../model/Payment';
import { useServer } from '../../server';
import { CurrencyInput } from '../../shared/CurrencyInput';
import { bound } from '../../shared/util';
import { PaymentStatusAlert } from './PaymentStatusAlert';
import { PaymentStatusBadge } from './PaymentStatusBadge';

interface ChargeDetailsProps {
  member?: IMember;
  charge?: ICharge;
  onHide: () => void;
}

export const ChargeDetails = React.memo(
  (props: ChargeDetailsProps) => {
    const server = useServer();

    const [isAddingPayment, setIsAddingPayment] = useState(false);
    const [isAwaitingAddingPayment, setIsAwaitingAddingPayment] = useState(
      false,
    );
    const [newPaymentValue, setNewPaymentValue] = useState(
      props.charge ? props.charge.value - amountPaid(props.charge) : 0,
    );
    const [newPaymentReference, setNewPaymentReference] = useState('');

    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title>
            {props.charge && props.member ? (
              <>
                Charge:{' '}
                {server.model.chargeTypes[props.charge.chargeType]?.name}
                {' on '}
                {DateTime.fromMillis(props.charge.start).toLocaleString(
                  DateTime.DATE_SHORT,
                )}{' '}
                <PaymentStatusBadge charge={props.charge} />
              </>
            ) : (
              <>Charge not found.</>
            )}
          </Modal.Title>
        </Modal.Header>
        {props.charge && props.member && (
          <>
            <Modal.Body>
              <PaymentStatusAlert charge={props.charge} />

              <h5>Details</h5>
              <Table responsive>
                <tbody>
                  <tr>
                    <td>To:</td>
                    <td>
                      {props.member.name} ({props.member.accountId})
                    </td>
                  </tr>
                  <tr>
                    <td>Reason:</td>
                    <td>
                      {server.model.chargeTypes[props.charge.chargeType]?.name}
                    </td>
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
                          <Button
                            className="ml-2 "
                            variant="outline-light"
                            size="sm"
                          >
                            <Icon.Info
                              size={18}
                              stroke="#999"
                              cursor="pointer"
                            />
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
                                <CurrencyInput
                                  className="form-control"
                                  placeholder="Amount"
                                  autoFocus
                                  value={newPaymentValue}
                                  onValueChange={v =>
                                    setNewPaymentValue(
                                      bound(
                                        0,
                                        v,
                                        props.charge!.value -
                                          amountPaid(props.charge!),
                                      ),
                                    )
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
                                <Button
                                  className="mx-1"
                                  onClick={async () => {
                                    setIsAddingPayment(false);
                                    setIsAwaitingAddingPayment(true);
                                    props.charge!.payments.push({
                                      id: uuid.v4(),
                                      chargeId: props.charge!.id,
                                      timestamp: Date.now(),
                                      type: PaymentType.Manual,
                                      value: newPaymentValue,
                                      enteredByUserId: server.user!.email!,
                                      reference: newPaymentReference,
                                    });
                                    if (
                                      await server.setMembers({
                                        [props.member!
                                          .accountId]: props.member!,
                                      })
                                    ) {
                                      // TODO: Success
                                    } else {
                                      // TODO: Alert error
                                    }
                                    setIsAwaitingAddingPayment(false);
                                  }}
                                >
                                  Add
                                </Button>
                                <Button
                                  className="mx-1"
                                  variant="secondary"
                                  onClick={() => setIsAddingPayment(false)}
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
                  <tr>
                    <td colSpan={5}>
                      <div className="d-flex justify-content-end align-items-center">
                        {isAwaitingAddingPayment && (
                          <Spinner
                            className="mr-3"
                            animation="border"
                            size="sm"
                            variant="success"
                          />
                        )}
                        <div className="mr-2">
                          <strong>Remaining:</strong>{' '}
                          {(
                            (props.charge!.value - amountPaid(props.charge!)) /
                            100
                          ).toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          })}
                        </div>
                        {!isAddingPayment && !isPaid(props.charge) && (
                          <Button
                            variant="success"
                            onClick={() => setIsAddingPayment(true)}
                          >
                            Add Payment
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
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
                  const term = props.member!.terms[props.charge!.term]!;
                  term.ledger = term.ledger.filter(
                    charge => charge.id !== props.charge!.id,
                  );
                  if (
                    await server.setMembers({
                      [props.member!.accountId]: props.member!,
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
        )}
      </>
    );
  },
  (_, nextProps) => !nextProps.member,
);
