import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import { hasMembership, IMember } from '../../model/Member';
import { useServer } from '../../server';
import { orderable } from '../../shared/util';
import styles from './MemberRow.module.css';

interface MemberRowProps {
  member: IMember;
}

export default function MemberRow(props: MemberRowProps) {
  const server = useServer();

  const membershipsOrder = Object.values(server.model.memberships).sort(
    orderable,
  );

  return (
    <Link
      to={'/members/' + props.member.id}
      className={'list-group-item list-group-item-action ' + styles.row}
    >
      <Row>
        <Col xs={5}>{props.member.name}</Col>
        <Col xs={2}>{props.member.id}</Col>
        <Col xs={3}>
          {membershipsOrder
            .flatMap(m =>
              hasMembership(props.member, m.id, server.term) ? [m.name] : [],
            )
            .join(', ')}
          {props.member.terms[server.term]?.memberships.length === 0 && (
            <span className="text-muted">(none)</span>
          )}
        </Col>
        <Col xs={2}>
          {server.model.memberTypes[props.member.memberType]?.name}
        </Col>
      </Row>
    </Link>
  );
}
