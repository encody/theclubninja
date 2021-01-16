import { DateTime } from 'luxon';
import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import {
  hasPayment,
  ILedgerEntry,
  isOverdue,
  isPaid
} from '../../model/LedgerEntry';
import { isActiveMember } from '../../model/Member';
import { useServer } from '../../server';
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

  const getFilteredMembers = () =>
    Object.values(server.model!.members).filter(
      member =>
        isActiveMember(member, server.term) &&
        // string filter
        (member.name.toLowerCase().includes(filter.string.toLowerCase()) ||
          member.institutionId
            .toLowerCase()
            .includes(filter.string.toLowerCase()) ||
          member.accountId
            .toLowerCase()
            .includes(filter.string.toLowerCase())) &&
        // payment status filters
        member.terms[server.term]?.ledger.some((entry: ILedgerEntry) => {
          const entryIsPaid = isPaid(entry),
            entryIsOverdue = isOverdue(entry),
            entryHasPayment = hasPayment(entry);
          return (
            ((entryIsPaid && filter.paid) ||
              (entryIsOverdue && filter.overdue) ||
              (entryHasPayment && !entryIsPaid && filter.partial) ||
              (!entryIsPaid &&
                !entryIsOverdue &&
                !entryHasPayment &&
                filter.pending)) &&
            (!!filter.after
              ? entry.payments.some(
                  payment => filter.after! < payment.timestamp,
                )
              : true) &&
            (!!filter.before
              ? entry.payments.some(
                  payment => filter.before! > payment.timestamp,
                )
              : true)
          );
        }),
    );

  const [filter, setFilter] = useState({
    string: '',
    paid: true,
    overdue: true,
    partial: true,
    pending: true,
    after: null,
    before: null,
  } as PaymentsFilter);
  let filteredMembers = getFilteredMembers();

  const updateFilterString = (filterString: string) => {
    setFilter({
      ...filter,
      string: filterString,
    });
    filteredMembers = getFilteredMembers();
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
    filteredMembers = getFilteredMembers();
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
                  <small>After</small>
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
                  <small>Before</small>
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
              <PaymentMemberOverview key={member.accountId} member={member} />
            ))}
          </Accordion>

          {filteredMembers.length ? null : (
            <div className="row justify-content-center m-3">
              <p>No members.</p>
            </div>
          )}
        </Col>
      </Row>
    </>
  );
}
