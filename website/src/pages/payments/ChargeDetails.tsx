import { DateTime } from 'luxon';
import React, { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Spinner from 'react-bootstrap/esm/Spinner';
import Tooltip from 'react-bootstrap/esm/Tooltip';
import Form from 'react-bootstrap/esm/Form';
import Modal from 'react-bootstrap/esm/Modal';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';
import Popover from 'react-bootstrap/esm/Popover';
import Row from 'react-bootstrap/esm/Row';
import Table from 'react-bootstrap/esm/Table';
import * as Icon from 'react-feather';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import * as uuid from 'uuid';
import { amountPaid, ICharge, isPaid } from '../../model/Charge';
import { IMember } from '../../model/Member';
import { PaymentType } from '../../model/Payment';
import { useServer } from '../../server';
import { CurrencyInput } from '../../shared/CurrencyInput';
import { bound } from '../../shared/util';
import { ExternalPaymentStatusIcon } from './ExternalPaymentStatusIcon';
import { PaymentStatusAlert } from './PaymentStatusAlert';
import { PaymentStatusBadge } from './PaymentStatusBadge';

interface ChargeDetailsProps extends RouteComponentProps<{}> {
  member?: IMember;
  charge?: ICharge;
  onHide: () => void;
}

export const ChargeDetails = withRouter(
  React.memo(
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
      const [isSendingInvoice, setIsSendingInvoice] = useState(false);

      const remainingCharge = props.charge
        ? props.charge!.value - amountPaid(props.charge!)
        : 0;

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
                        {props.member.name} ({props.member.id})
                      </td>
                    </tr>
                    <tr>
                      <td>Reason:</td>
                      <td>
                        {
                          server.model.chargeTypes[props.charge.chargeType]
                            ?.name
                        }
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
                          {DateTime.fromMillis(
                            payment.timestamp,
                          ).toLocaleString(DateTime.DATETIME_SHORT)}
                        </td>
                        <td>
                          {(payment.type === PaymentType.Online && 'Online') ||
                            'Manual'}
                        </td>
                        <td>
                          {payment.reference ? (
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={payment.reference}
                            >
                              View
                            </a>
                          ) : payment.type === PaymentType.Online ? (
                            <>
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip
                                    id={'ChargeDetails_Processing' + payment.id}
                                  >
                                    Processing.
                                  </Tooltip>
                                }
                              >
                                <Icon.Clock className="text-info" size={16} />
                              </OverlayTrigger>
                              <ExternalPaymentStatusIcon payment={payment} />
                            </>
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </td>
                        <td>
                          {payment.enteredByUserId ? (
                            payment.enteredByUserId
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
                            <Icon.Info
                              className="ml-2"
                              size={16}
                              stroke="#999"
                              cursor="pointer"
                            />
                          </OverlayTrigger>
                        </td>
                      </tr>
                    ))}
                    {/* New payment form */}
                    {isAddingPayment && (
                      <tr>
                        <td colSpan={5}>
                          <Container fluid>
                            <Form inline className="text-right">
                              <Row className="no-gutters w-100">
                                <Col lg={4} className="m-1">
                                  <CurrencyInput
                                    className="form-control w-100"
                                    placeholder="Amount"
                                    autoFocus
                                    value={newPaymentValue}
                                    onValueChange={v =>
                                      setNewPaymentValue(
                                        bound(0, v, remainingCharge),
                                      )
                                    }
                                  />
                                </Col>
                                <Col lg className="m-1">
                                  <Form.Control
                                    placeholder="Reference link (optional)"
                                    type="url"
                                    value={newPaymentReference}
                                    className="w-100"
                                    onChange={e =>
                                      setNewPaymentReference(e.target.value)
                                    }
                                  />
                                </Col>
                                <Col lg="auto" className="m-1">
                                  <Button
                                    className="mr-1"
                                    onClick={async () => {
                                      setIsAddingPayment(false);
                                      setIsAwaitingAddingPayment(true);
                                      // TODO: Check server-side
                                      props.charge!.payments.push({
                                        id: uuid.v4(),
                                        chargeId: props.charge!.id,
                                        timestamp: Date.now(),
                                        type: PaymentType.Manual,
                                        value: newPaymentValue,
                                        enteredByUserId: server.user!.email!,
                                        reference: newPaymentReference,
                                        status: 'paid',
                                      });
                                      if (
                                        await server.setCharges({
                                          [props.charge!.id]: props.charge!,
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
                                    className="ml-1"
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
                          {isAwaitingAddingPayment ||
                            (isSendingInvoice && (
                              <Spinner
                                className="mr-3"
                                animation="border"
                                size="sm"
                                variant="success"
                              />
                            ))}
                          <div className="mr-2">
                            <strong>Remaining:</strong>{' '}
                            {(remainingCharge / 100).toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD',
                            })}
                          </div>
                          {!isAddingPayment &&
                            !isPaid(props.charge) &&
                            props.charge!.payments.findIndex(
                              p => p.type === PaymentType.Online,
                            ) === -1 && (
                              <>
                                <Button
                                  className="mr-2"
                                  variant="primary"
                                  disabled={isSendingInvoice}
                                  onClick={async () => {
                                    setIsSendingInvoice(true);
                                    if (
                                      await server.sendInvoice({
                                        amount: remainingCharge,
                                        chargeId: props.charge!.id,
                                        description:
                                          server.model.chargeTypes[
                                            props.charge!.chargeType
                                          ].name +
                                          ' on ' +
                                          DateTime.fromMillis(
                                            props.charge!.start,
                                          ).toLocaleString(DateTime.DATE_FULL) +
                                          '\n\n' +
                                          props.charge!.note,
                                        email: props.member!.email,
                                      })
                                    ) {
                                      setIsSendingInvoice(false);
                                    } else {
                                      // TODO: error
                                    }
                                  }}
                                >
                                  Send Invoice
                                </Button>
                                <Button
                                  variant="success"
                                  onClick={() => setIsAddingPayment(true)}
                                >
                                  Add Payment...
                                </Button>
                              </>
                            )}
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              </Modal.Body>
              <Modal.Footer>
                <div className="small text-muted mr-auto">
                  Charge ID:{' '}
                  <Link to={'/payments/' + props.charge.id}>
                    <code>{props.charge.id}</code> <Icon.Link size={14} />
                  </Link>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => props.history.goBack()}
                >
                  Back
                </Button>
                <Button
                  variant="danger"
                  disabled={props.charge!.payments.some(
                    p =>
                      (p.type === PaymentType.Online &&
                        !['void', 'uncollectible', 'payment_failed'].includes(
                          p.status!,
                        )) ||
                      p.type === PaymentType.Manual,
                  )}
                  onClick={async () => {
                    props.onHide();
                    const term = props.member!.terms[props.charge!.term]!;
                    term.ledger = term.ledger.filter(
                      charge => charge !== props.charge!.id,
                    ); // TODO: Delete the actual record
                    if (
                      await server.setMembers({
                        [props.member!.id]: props.member!,
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
  ),
);
