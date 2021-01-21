import { DateTime } from 'luxon';
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { IMember } from '../../model/Member';

interface MemberDetailsProps {
  member: IMember | undefined;
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
          const lastWaiver = this.props.member.waivers[
            this.props.member.waivers.length - 1
          ];
          return lastWaiver
            ? DateTime.fromMillis(lastWaiver.timestamp).toRelative()
            : 'N/A';
        })()
      : '';

    return this.props.member ? (
      <>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.member.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table responsive>
            <tbody>
              <tr>
                <td>Account ID:</td>
                <td>{this.props.member.id}</td>
              </tr>
              <tr>
                <td>Institution ID:</td>
                <td>{this.props.member.institutionId}</td>
              </tr>
              <tr>
                <td>Waiver:</td>
                <td>{lastWaiverDisplay}</td>
              </tr>
              <tr>
                <td>Graduation Year:</td>
                <td>{this.props.member.graduationYear}</td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
      </>
    ) : (
      <>
        <Modal.Header closeButton>
          <Modal.Title>Member not found</Modal.Title>
        </Modal.Header>
        <Modal.Body>This member does not exist in the database.</Modal.Body>
      </>
    );
  }
}
