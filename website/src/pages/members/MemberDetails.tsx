import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import moment from 'moment';
import { Member } from '../../model/Member';

interface MemberDetailsProps {
  member: Member | undefined;
}

export default class MemberDetails extends React.Component<
  MemberDetailsProps,
  {}
> {
  shouldComponentUpdate(nextProps: MemberDetailsProps) {
    return !!nextProps.member;
  }

  render() {
    const lastWaiverDisplay = this.props.member
      ? (() => {
          const lastWaiver = this.props.member.data.waivers[
            this.props.member.data.waivers.length - 1
          ];
          return lastWaiver
            ? moment(lastWaiver.timestamp.toDate()).calendar()
            : 'N/A';
        })()
      : '';

    return this.props.member ? (
      <>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.member.data.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table responsive>
            <tr>
              <td>Account ID:</td>
              <td>{this.props.member.data.accountId}</td>
            </tr>
            <tr>
              <td>Student ID:</td>
              <td>{this.props.member.data.studentId}</td>
            </tr>
            <tr>
              <td>Waiver:</td>
              <td>{lastWaiverDisplay}</td>
            </tr>
            <tr>
              <td>Graduation Year:</td>
              <td>{this.props.member.data.graduationYear}</td>
            </tr>
          </Table>
        </Modal.Body>
      </>
    ) : (
      <>
        <Modal.Header closeButton>
          <Modal.Title>Member not found</Modal.Title>
        </Modal.Header>
        <Modal.Body>This member does not exist in the database</Modal.Body>
      </>
    );
  }
}
