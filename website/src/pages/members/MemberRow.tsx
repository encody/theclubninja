import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import { hasMembership, IMember } from '../../model/Member';
import { useServer } from '../../server';
import styles from './MemberRow.module.css';

interface MemberRowProps {
  member: IMember;
}

export default function MemberRow(props: MemberRowProps) {
  const server = useServer();

  return (
    <Link
      to={'/members/' + props.member.accountId}
      className={'list-group-item list-group-item-action ' + styles.row}
    >
      <Row>
        <Col xs={5}>{props.member.name}</Col>
        <Col xs={3}>{props.member.accountId}</Col>
        <Col xs={2}>
          {/* TODO: Check membership or something here */}
          {/* {hasMembership(props.member, Membership.Team, server.term)
            ? 'Yes'
            : 'No'} */}
        </Col>
        <Col xs={2}>Status</Col>
      </Row>
    </Link>
  );
}
