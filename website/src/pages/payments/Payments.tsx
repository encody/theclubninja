import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { IMember, isActiveMember } from '../../model/Member';
import { IModel } from '../../model/Model';
import PaymentMemberOverview from './PaymentMemberOverview';
import {
  ILedgerEntry,
  isPaid,
  isOverdue,
  hasPayment,
} from '../../model/LedgerEntry';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import moment from 'moment';

interface PaymentsProps {
  model: IModel;
  termId: string;
}

interface PaymentsState {
  filter: {
    string: string;
    paid: boolean;
    overdue: boolean;
    partial: boolean;
    pending: boolean;
    after: Date | null;
    before: Date | null;
  };
  memberList: IMember[];
  filteredMembers: IMember[];
}

export default class Payments extends React.Component<
  PaymentsProps,
  PaymentsState
> {
  constructor(props: PaymentsProps) {
    super(props);

    const members = Object.values(this.props.model.members).filter(m =>
      isActiveMember(m, this.props.termId),
    );

    this.state = {
      filter: {
        string: '',
        paid: true,
        overdue: true,
        partial: true,
        pending: true,
        after: null,
        before: null,
      },
      memberList: members,
      filteredMembers: members.slice(),
    };
  }

  componentDidMount() {
    this.runFilter();
  }

  runFilter() {
    this.setState(state => ({
      filteredMembers: this.state.memberList.filter(
        member =>
          // string filter
          (member.name
            .toLowerCase()
            .includes(state.filter.string.toLowerCase()) ||
            member.studentId
              .toLowerCase()
              .includes(state.filter.string.toLowerCase()) ||
            member.accountId
              .toLowerCase()
              .includes(state.filter.string.toLowerCase())) &&
          // payment status filters
          member.terms[this.props.termId]?.ledger.some(
            (entry: ILedgerEntry) => {
              const entryIsPaid = isPaid(entry),
                entryIsOverdue = isOverdue(entry),
                entryHasPayment = hasPayment(entry);
              return (
                ((entryIsPaid && state.filter.paid) ||
                  (entryIsOverdue && state.filter.overdue) ||
                  (entryHasPayment && state.filter.partial) ||
                  (!entryIsPaid &&
                    !entryIsOverdue &&
                    !entryHasPayment &&
                    state.filter.pending)) &&
                (!!state.filter.after
                  ? entry.payments.some(
                      payment =>
                        state.filter.after!.getTime() <
                        payment.timestamp.toDate().getTime(),
                    )
                  : true) &&
                (!!state.filter.before
                  ? entry.payments.some(
                      payment =>
                        state.filter.before!.getTime() >
                        payment.timestamp.toDate().getTime(),
                    )
                  : true)
              );
            },
          ),
      ),
    }));
  }

  updateFilterString(filterString: string) {
    this.setState(
      state => ({
        filter: Object.assign(state.filter, {
          string: filterString,
        }),
      }),
      () => {
        this.runFilter();
      },
    );
  }

  updateFilter<
    T extends Exclude<keyof PaymentsState['filter'], 'string'>,
    K extends PaymentsState['filter'][T]
  >(which: T, value: K) {
    console.log('updateFilter:', which, value);
    this.setState(
      state => ({
        filter: Object.assign(state.filter, {
          [which]: value,
        }),
      }),
      () => {
        this.runFilter();
      },
    );
  }

  render() {
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
              value={this.state.filter.string}
              onChange={e => this.updateFilterString(e.target.value)}
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
                    checked={this.state.filter.overdue}
                    onClick={() =>
                      this.updateFilter('overdue', !this.state.filter.overdue)
                    }
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  <Form.Check
                    custom
                    type="checkbox"
                    label={<PaymentStatusBadge variant="pending" />}
                    id="pending-checkbox"
                    checked={this.state.filter.pending}
                    onClick={() =>
                      this.updateFilter('pending', !this.state.filter.pending)
                    }
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  <Form.Check
                    custom
                    type="checkbox"
                    label={<PaymentStatusBadge variant="partial" />}
                    id="partial-checkbox"
                    checked={this.state.filter.partial}
                    onClick={() =>
                      this.updateFilter('partial', !this.state.filter.partial)
                    }
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  <Form.Check
                    custom
                    type="checkbox"
                    label={<PaymentStatusBadge variant="paid" />}
                    id="paid-checkbox"
                    checked={this.state.filter.paid}
                    onClick={() =>
                      this.updateFilter('paid', !this.state.filter.paid)
                    }
                  />
                </ListGroup.Item>
              </ListGroup>
              {/* payment date filters */}
              <ListGroup variant="flush">
                <ListGroup.Item>Payments between:</ListGroup.Item>
                <ListGroup.Item>
                  <Form.Control
                    type="date"
                    value={
                      !!this.state.filter.after
                        ? moment(this.state.filter.after).format('YYYY-MM-DD')
                        : ''
                    }
                    onChange={e =>
                      this.updateFilter(
                        'after',
                        (e.target as HTMLInputElement).valueAsDate,
                      )
                    }
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  <Form.Control
                    type="date"
                    value={
                      !!this.state.filter.before
                        ? moment(this.state.filter.before).format('YYYY-MM-DD')
                        : ''
                    }
                    onChange={e =>
                      this.updateFilter(
                        'before',
                        (e.target as HTMLInputElement).valueAsDate,
                      )
                    }
                  />
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>

          <Col lg={9}>
            <Accordion>
              {this.state.filteredMembers.map(member => (
                <PaymentMemberOverview
                  key={member.accountId}
                  member={member}
                  termId={this.props.termId}
                />
              ))}
            </Accordion>

            {this.state.filteredMembers.length ? null : (
              <div className="row justify-content-center m-3">
                <p>No members.</p>
              </div>
            )}
          </Col>
        </Row>
      </>
    );
  }
}
