import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import { IMember, hasMembership } from '../../model/Member';
import styles from './MemberRow.module.css';
import { Membership } from '../../model/MemberTerm';

export default class MemberRow extends React.Component<{
  member: IMember;
  termId: string;
}> {
  render() {
    return (
      <Link
        to={'/members/' + this.props.member.accountId}
        className={'list-group-item list-group-item-action ' + styles.row}
      >
        <Row>
          <Col xs={5}>{this.props.member.name}</Col>
          <Col xs={3}>{this.props.member.accountId}</Col>
          <Col xs={2}>
            {hasMembership(this.props.member, Membership.Team, this.props.termId)
              ? 'Yes'
              : 'No'}
          </Col>
          <Col xs={2}>Status</Col>
        </Row>
      </Link>
    );
  }
}
