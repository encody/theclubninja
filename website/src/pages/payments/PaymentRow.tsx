import { DateTime } from 'luxon';
import React from 'react';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { ILedgerEntry, LedgerEntryReason } from '../../model/LedgerEntry';
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
            <Col xs={4}>{reasonString[this.props.entry.reason]}</Col>
            <Col xs={2}>
              {DateTime.fromMillis(this.props.entry.start).toLocaleString(
                DateTime.DATE_SHORT,
              )}
            </Col>
            <Col xs={2}>
              {DateTime.fromMillis(this.props.entry.end).toLocaleString(
                DateTime.DATE_SHORT,
              )}
            </Col>
            <Col xs={2}>
              {this.props.entry.value.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
            </Col>
            <Col xs={2}>
              <PaymentStatusBadge entry={this.props.entry} />
            </Col>
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
class LedgerEntryDetailsModal extends React.Component<LedgerEntryDetailsModalProps> {
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
