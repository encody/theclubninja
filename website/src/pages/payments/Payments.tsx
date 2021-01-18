import { DateTime } from 'luxon';
import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/esm/Modal';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { hasPayment, ICharge, isOverdue, isPaid } from '../../model/Charge';
import { isActiveMember } from '../../model/Member';
import { useServer } from '../../server';
import { ChargeDetails } from './ChargeDetails';
import NewChargeModal from './NewChargeModal';
import PaymentMemberOverview from './PaymentMemberOverview';
import { PaymentStatusBadge } from './PaymentStatusBadge';

interface PaymentsFilter {
  string: string;
  paid: boolean;
  overdue: boolean;
  partial: boolean;
  pending: boolean;
  after: number | null;
  before: number | null;
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
          member.accountId.toLowerCase().includes(filter.string.toLowerCase())),
    );

  const stringFilteredMembers = getFilteredMembers();
  const filteredMembersWithCharges = new Set<string>();

  const filterCharge = (charge: ICharge) => {
    const chargeIsPaid = isPaid(charge),
      chargeIsOverdue = isOverdue(charge),
      chargeHasPayment = hasPayment(charge);
    return (
      ((chargeIsPaid && filter.paid) ||
        (chargeIsOverdue && filter.overdue) ||
        (chargeHasPayment && !chargeIsPaid && filter.partial) ||
        (!chargeIsPaid &&
          !chargeIsOverdue &&
          !chargeHasPayment &&
          filter.pending)) &&
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
          member.terms[server.term]?.ledger.flatMap(charge => {
            if (filterCharge(charge)) {
              filteredMembersWithCharges.add(charge.accountId);
              return [charge];
            } else {
              return [];
            }
          }) ?? [],
      )
      .reduce((acc, charge) => acc.add(charge.id), new Set<string>());

  const filteredCharges = getFilteredCharges();
  const filteredMembers = stringFilteredMembers.filter(member =>
    filteredMembersWithCharges.has(member.accountId),
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

  return (
    <>
      <Row as="header">
        <h2 className="mb-3">Payments</h2>
      </Row>

      <div className="d-flex mb-3">
        <div className="flex-grow-1">
          <Form.Control
            type="search"
            placeholder="Search&hellip;"
            value={filter.string}
            onChange={e => updateFilterString(e.target.value)}
          />
        </div>
        <div className="ml-3 flex-shrink-1">
          <Button onClick={() => setShowNewChargeModal(true)}>
            New Charge
          </Button>
        </div>
      </div>

      <Row>
        <Col lg={3}>
          <Card className="mb-2">
            <Card.Header>Filters</Card.Header>
            {/* payment status filters */}
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Form.Check
                  custom
                  type="checkbox"
                  label={<PaymentStatusBadge variant="overdue" />}
                  id="overdue-checkbox"
                  checked={filter.overdue}
                  onChange={() => updateFilter('overdue', !filter.overdue)}
                />
              </ListGroup.Item>
              <ListGroup.Item>
                <Form.Check
                  custom
                  type="checkbox"
                  label={<PaymentStatusBadge variant="pending" />}
                  id="pending-checkbox"
                  checked={filter.pending}
                  onChange={() => updateFilter('pending', !filter.pending)}
                />
              </ListGroup.Item>
              <ListGroup.Item>
                <Form.Check
                  custom
                  type="checkbox"
                  label={<PaymentStatusBadge variant="partial" />}
                  id="partial-checkbox"
                  checked={filter.partial}
                  onChange={() => updateFilter('partial', !filter.partial)}
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
            </ListGroup>
            {/* payment date filters */}
            <ListGroup variant="flush">
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
            </ListGroup>
          </Card>
        </Col>

        <Col lg={9}>
          <Accordion>
            {filteredMembers.map(member => (
              <PaymentMemberOverview
                key={member.accountId}
                member={member}
                charges={
                  member.terms[server.term]?.ledger.filter(c =>
                    filteredCharges.has(c.id),
                  ) ?? []
                }
              />
            ))}
          </Accordion>

          {filteredMembers.length ? null : (
            <div className="row justify-content-center m-3">
              <p>No members.</p>
            </div>
          )}
        </Col>
      </Row>

      <Route path="/payments/:accountId?/:chargeId?">
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
  extends RouteComponentProps<{ accountId: string; chargeId?: string }> {}

const ChargeDetailsModal = withRouter((props: ChargeDetailsModalProps) => {
  const server = useServer();
  const close = () => props.history.push('/payments');
  const member = server.model.members[props.match.params.accountId];
  const [charge] = Object.values(member?.terms ?? {}).flatMap(term =>
    term!.ledger.filter(c => c.id === props.match.params.chargeId),
  );
  return (
    <Modal size="lg" show={!!props.match.params.chargeId} onHide={close}>
      <ChargeDetails member={member} charge={charge} onHide={close} />
    </Modal>
  );
});
