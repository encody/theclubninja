import { writeToString } from '@fast-csv/format';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import Accordion from 'react-bootstrap/esm/Accordion';
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/esm/Card';
import Col from 'react-bootstrap/esm/Col';
import Form from 'react-bootstrap/esm/Form';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import Modal from 'react-bootstrap/esm/Modal';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';
import Row from 'react-bootstrap/esm/Row';
import Tooltip from 'react-bootstrap/esm/Tooltip';
import * as Icon from 'react-feather';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { hasPayment, ICharge, isOverdue, isPaid } from '../../model/Charge';
import { isActiveMember } from '../../model/Member';
import { useServer } from '../../server';
import SpinnyBox from '../../shared/SpinnyBox';
import { ChargeDetails } from './ChargeDetails';
import NewChargeModal from './NewChargeModal';
import PaymentMemberOverview from './PaymentMemberOverview';
import styles from './Payments.module.css';
import { PaymentStatusBadge } from './PaymentStatusBadge';

interface PaymentsFilter {
  string: string;
  paid: boolean;
  overdue: boolean;
  partial: boolean;
  pending: boolean;
  after: number | null;
  before: number | null;
  user: string;
}

export default function Payments() {
  const server = useServer();

  const [filter, setFilter] = useState({
    string: '',
    paid: true,
    overdue: true,
    partial: true,
    pending: true,
    after: null,
    before: null,
    user: '',
  } as PaymentsFilter);
  const [showNewChargeModal, setShowNewChargeModal] = useState(false);

  const getFilteredMembers = () =>
    Object.values(server.model.members).filter(
      member =>
        isActiveMember(member, server.term) &&
        // string filter
        (member.name.toLowerCase().includes(filter.string.toLowerCase()) ||
          member.institutionId
            .toLowerCase()
            .includes(filter.string.toLowerCase()) ||
          member.id.toLowerCase().includes(filter.string.toLowerCase())),
    );

  const stringFilteredMembers = getFilteredMembers();
  const filteredMembersWithCharges = new Set<string>();

  const filterCharge = (charge: ICharge) => {
    const chargeIsPaid = isPaid(charge),
      chargeIsOverdue = isOverdue(charge),
      chargeHasPayment = hasPayment(charge);
    const filterUser = filter.user.trim().toLowerCase();
    const hasPaymentMatchingUser =
      filterUser === '' ||
      charge.payments.some(p =>
        p.enteredByUserId?.toLowerCase().includes(filterUser),
      );
    return (
      ((chargeIsPaid && filter.paid) ||
        (chargeIsOverdue && filter.overdue) ||
        (chargeHasPayment && !chargeIsPaid && filter.partial) ||
        (!chargeIsPaid &&
          !chargeIsOverdue &&
          !chargeHasPayment &&
          filter.pending)) &&
      hasPaymentMatchingUser &&
      (!!filter.after
        ? charge.payments.some(payment => filter.after! < payment.timestamp)
        : true) &&
      (!!filter.before
        ? charge.payments.some(payment => filter.before! > payment.timestamp)
        : true)
    );
  };

  const getFilteredCharges = () =>
    // payment status filters
    stringFilteredMembers
      .flatMap(
        member =>
          member.terms[server.term]?.ledger.flatMap(chargeId => {
            const charge = server.model.charges[chargeId];
            if (charge && filterCharge(charge)) {
              filteredMembersWithCharges.add(charge.memberId);
              return [charge];
            } else {
              return [];
            }
          }) ?? [],
      )
      .reduce((acc, charge) => acc.add(charge.id), new Set<string>());

  const filteredCharges = getFilteredCharges();
  const filteredMembers = stringFilteredMembers.filter(member =>
    filteredMembersWithCharges.has(member.id),
  );

  const updateFilterString = (filterString: string) => {
    setFilter({
      ...filter,
      string: filterString,
    });
  };

  const updateFilter: <
    T extends Exclude<keyof PaymentsFilter, 'string'>,
    K extends PaymentsFilter[T]
  >(
    which: T,
    value: K,
  ) => void = (which, value) => {
    setFilter({
      ...filter,
      [which]: value,
    });
  };

  if (Object.keys(server.model.chargeTypes).length === 0) {
    return <SpinnyBox />;
  }

  const runExport = async () => {
    const a = document.createElement('a');
    const items = Object.values(server.model.members)
      .filter(m => isActiveMember(m, server.term))
      .flatMap(
        member =>
          member.terms[server.term]?.ledger.flatMap(cid => {
            const charge = server.model.charges[cid];
            return (
              charge?.payments.map(payment => ({
                member,
                charge,
                payment,
              })) ?? []
            );
          }) ?? [],
      )
      .map(entry => [
        entry.member.id,
        entry.member.institutionId,
        entry.member.name,
        entry.member.email,
        entry.charge.id,
        entry.charge.chargeType,
        entry.charge.value,
        DateTime.fromMillis(entry.charge.start).toISODate(),
        DateTime.fromMillis(entry.charge.end).toISODate(),
        entry.charge.note,
        entry.payment.id,
        entry.payment.value,
        DateTime.fromMillis(entry.payment.timestamp).toISODate(),
        entry.payment.type,
        entry.payment.enteredByUserId,
        entry.payment.reference,
        entry.payment.status,
      ]);

    const headers = [
      'Member ID',
      'Member Institution ID',
      'Member Name',
      'Member Email',
      'Charge ID',
      'Charge Type',
      'Charge Value',
      'Charge Created Date',
      'Charge Due Date',
      'Charge Note',
      'Payment ID',
      'Payment Value',
      'Payment Date',
      'Payment Type',
      'Payment User',
      'Payment Reference',
      'Payment Status',
    ];

    const csvText = await writeToString(items, {
      headers,
    });

    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvText);
    const fname =
      'payments-' + server.term + '-' + DateTime.local().toISODate() + '.csv';

    a.download = fname;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <Row as="header">
        <h2 className="mb-3">Payments</h2>
        <OverlayTrigger
          placement="left"
          overlay={<Tooltip id="payments-export-tooltip">Export</Tooltip>}
        >
          <Button
            className="ml-auto"
            variant="link"
            size="sm"
            onClick={() => runExport()}
          >
            <Icon.Download />
          </Button>
        </OverlayTrigger>
      </Row>

      <Row className="flex-wrap-reverse">
        <Col className="mb-3">
          <Form.Control
            type="search"
            placeholder="Search&hellip;"
            value={filter.string}
            onChange={e => updateFilterString(e.target.value)}
          />
        </Col>
        <Col md="auto" className="text-right mb-3">
          <Button onClick={() => setShowNewChargeModal(true)}>
            New Charge
          </Button>
        </Col>
      </Row>

      <Row>
        <Col lg={3}>
          <Accordion defaultActiveKey="payments-filters">
            <Card className="mb-2">
              <Accordion.Toggle
                as={Card.Header}
                eventKey="payments-filters"
                style={{ cursor: 'pointer' }}
              >
                <Icon.Filter size={18} /> Filters
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="payments-filters">
                <>
                  {/* payment status filters */}
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Form.Check
                        custom
                        type="checkbox"
                        label={<PaymentStatusBadge variant="overdue" />}
                        id="overdue-checkbox"
                        checked={filter.overdue}
                        onChange={() =>
                          updateFilter('overdue', !filter.overdue)
                        }
                      />
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Form.Check
                        custom
                        type="checkbox"
                        label={<PaymentStatusBadge variant="pending" />}
                        id="pending-checkbox"
                        checked={filter.pending}
                        onChange={() =>
                          updateFilter('pending', !filter.pending)
                        }
                      />
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Form.Check
                        custom
                        type="checkbox"
                        label={<PaymentStatusBadge variant="partial" />}
                        id="partial-checkbox"
                        checked={filter.partial}
                        onChange={() =>
                          updateFilter('partial', !filter.partial)
                        }
                      />
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Form.Check
                        custom
                        type="checkbox"
                        label={<PaymentStatusBadge variant="paid" />}
                        id="paid-checkbox"
                        checked={filter.paid}
                        onChange={() => updateFilter('paid', !filter.paid)}
                      />
                    </ListGroup.Item>
                    {/* payment date filters */}
                    <ListGroup.Item>
                      <Form.Label
                        htmlFor="payments-date-after"
                        className="text-muted"
                      >
                        <small>Payments after</small>
                      </Form.Label>
                      <Form.Control
                        id="payments-date-after"
                        type="date"
                        value={
                          !!filter.after
                            ? DateTime.fromMillis(filter.after).toISODate()
                            : ''
                        }
                        onChange={e =>
                          updateFilter(
                            'after',
                            DateTime.fromISO(e.target.value).toMillis(),
                          )
                        }
                      />
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Form.Label
                        htmlFor="payments-date-before"
                        className="text-muted"
                      >
                        <small>Payments before</small>
                      </Form.Label>
                      <Form.Control
                        id="payments-date-before"
                        type="date"
                        value={
                          !!filter.before
                            ? DateTime.fromMillis(filter.before).toISODate()
                            : ''
                        }
                        onChange={e =>
                          updateFilter(
                            'before',
                            DateTime.fromISO(e.target.value).toMillis(),
                          )
                        }
                      />
                    </ListGroup.Item>
                    {/* payment user filter */}
                    <ListGroup.Item>
                      <Form.Label
                        htmlFor="payments-user"
                        className="text-muted"
                      >
                        <small>Payments created by user</small>
                      </Form.Label>
                      <Form.Control
                        id="payments-user"
                        placeholder="name@example.com"
                        type="text"
                        value={filter.user}
                        onChange={e => updateFilter('user', e.target.value)}
                      />
                    </ListGroup.Item>
                  </ListGroup>
                </>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Col>

        <Col lg={9}>
          <Accordion>
            {filteredMembers.map(member => (
              <PaymentMemberOverview
                key={member.id}
                member={member}
                charges={
                  member.terms[server.term]?.ledger
                    .filter(c => filteredCharges.has(c))
                    .map(c => server.model.charges[c]) ?? []
                }
              />
            ))}
          </Accordion>

          {filteredMembers.length ? null : (
            <div className="row justify-content-center m-3">
              <p>No charges.</p>
            </div>
          )}
        </Col>
      </Row>

      <Route path="/payments/:chargeId?">
        <ChargeDetailsModal />
      </Route>

      <NewChargeModal
        onClose={() => setShowNewChargeModal(false)}
        show={showNewChargeModal}
      />
    </>
  );
}

interface ChargeDetailsModalProps
  extends RouteComponentProps<{ chargeId?: string }> {}

const ChargeDetailsModal = withRouter((props: ChargeDetailsModalProps) => {
  const server = useServer();
  const close = () => props.history.push('/payments');
  const charge = props.match.params.chargeId
    ? server.model.charges[props.match.params.chargeId]
    : undefined;
  const member = charge ? server.model.members[charge.memberId] : undefined;
  return (
    <Modal
      size="lg"
      show={!!props.match.params.chargeId}
      onHide={close}
      dialogClassName={styles['min-dialog']}
    >
      <ChargeDetails member={member} charge={charge} onHide={close} />
    </Modal>
  );
});
