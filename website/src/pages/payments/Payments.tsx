import React from 'react';
import styles from './Club.module.css';
import { IMember, isActiveMember } from '../../model/Member';
import { IModel } from '../../model/Model';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Accordion from 'react-bootstrap/Accordion';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import MemberRow from '../members/MemberRow';
import PaymentMemberOverview from './PaymentMemberOverview';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { LedgerEntryDetails } from './LedgerEntryDetails';
import { ILedgerEntry } from '../../model/LedgerEntry';

interface PaymentsProps {
  model: IModel;
  termId: string;
}

interface PaymentsState {
  filter: string;
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
      filter: '',
      memberList: members,
      filteredMembers: members.slice(),
    };
  }

  updateFilter(filter: string) {
    this.setState({
      filter,
      filteredMembers: this.state.memberList.filter(
        member =>
          member.name.toLowerCase().includes(filter.toLowerCase()) ||
          member.studentId.toLowerCase().includes(filter.toLowerCase()) ||
          member.accountId.toLowerCase().includes(filter.toLowerCase()),
      ),
    });
  }

  render() {
    return (
      <Container>
        <Row as="header">
          <h2 className="mb-3">Payments</h2>
        </Row>

        <div className="d-flex mb-3">
          <div className="flex-grow-1">
            <Form.Control
              type="search"
              placeholder="Search&hellip;"
              value={this.state.filter}
              onChange={e => this.updateFilter(e.target.value)}
            />
          </div>
        </div>

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
      </Container>
    );
  }
}
