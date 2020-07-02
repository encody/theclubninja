import React from 'react';
import {
  ILedgerEntry,
  LedgerEntryReason,
  isPaid,
  isOverdue,
  hasPayment,
} from '../../model/LedgerEntry';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import { LedgerEntryDetails } from './LedgerEntryDetails';
import { PaymentStatusBadge } from './PaymentStatusBadge';

interface PaymentRowProps {
  entry: ILedgerEntry;
}

interface PaymentRowState {
  showModal: boolean;
}

const reasonString = {
  [LedgerEntryReason.ClubDues]: 'Club Dues',
  [LedgerEntryReason.TeamDues]: 'Team Dues',
  [LedgerEntryReason.Other]: 'Other',
  [LedgerEntryReason.Shoes]: 'Shoes',
  [LedgerEntryReason.SingleLesson]: 'Single Lesson',
};

export default class PaymentRow extends React.Component<
  PaymentRowProps,
  PaymentRowState
> {
  constructor(props: PaymentRowProps) {
    super(props);

    this.state = {
      showModal: false,
    };
  }

  showModal() {
    this.setState({
      showModal: true,
    });
  }

  hideModal() {
    this.setState({
      showModal: false,
    });
  }

  render() {
    return (
      <>
        <ListGroup.Item action onClick={() => this.showModal()}>
          <Row>
            <Col xs={3}>{reasonString[this.props.entry.reason]}</Col>
            <Col xs={2}>
              {moment(this.props.entry.start.toDate()).calendar()}
            </Col>
            <Col xs={2}>{moment(this.props.entry.end.toDate()).calendar()}</Col>
            <Col xs={1}>
              {this.props.entry.value.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
            </Col>
            <Col xs={1}>
              <PaymentStatusBadge entry={this.props.entry} />
            </Col>
            <Col xs={3}></Col>
          </Row>
        </ListGroup.Item>
        <LedgerEntryDetailsModal
          entry={this.props.entry}
          show={this.state.showModal}
          onHide={() => this.hideModal()}
        />
      </>
    );
  }
}

interface LedgerEntryDetailsModalProps {
  entry: ILedgerEntry;
  show: boolean;
  onHide: () => void;
}
class LedgerEntryDetailsModal extends React.Component<
  LedgerEntryDetailsModalProps
> {
  render() {
    return (
      <Modal
        size="lg"
        show={this.props.show}
        onHide={() => this.props.onHide()}
      >
        <LedgerEntryDetails entry={this.props.entry} />
      </Modal>
    );
  }
}
