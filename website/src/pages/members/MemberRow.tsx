import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import { Member } from '../../model/Member';
import styles from './MemberRow.module.css';

export default class MemberRow extends React.Component<{ member: Member }> {
  render() {
    return (
      <Link
        to={'/members/' + this.props.member.data.accountId}
        className={'list-group-item list-group-item-action ' + styles.row}
      >
        <Row>
          <Col xs={5}>{this.props.member.data.name}</Col>
          <Col xs={3}>{this.props.member.data.accountId}</Col>
          <Col xs={2}>{this.props.member.data.isTeamMember ? 'Yes' : 'No'}</Col>
          <Col xs={2}>Status</Col>
        </Row>
      </Link>
    );
  }
}
