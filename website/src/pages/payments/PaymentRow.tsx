import { DateTime } from 'luxon';
import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { Link, Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { ICharge } from '../../model/Charge';
import { IMember } from '../../model/Member';
import { useServer } from '../../server';
import { ChargeDetails } from './ChargeDetails';
import { PaymentStatusBadge } from './PaymentStatusBadge';

interface PaymentRowProps {
  member: IMember;
  charge: ICharge;
}

export default function PaymentRow(props: PaymentRowProps) {
  const server = useServer();

  return (
    <Link
      to={'/payments/' + props.member.accountId + '/' + props.charge.id}
      className="list-group-item list-group-item-action"
    >
      <Row>
        <Col xs={4}>
          {server.model.chargeTypes[props.charge.chargeType].name}
        </Col>
        <Col xs={2}>
          {DateTime.fromMillis(props.charge.start).toLocaleString(
            DateTime.DATE_SHORT,
          )}
        </Col>
        <Col xs={2}>
          {DateTime.fromMillis(props.charge.end).toLocaleString(
            DateTime.DATE_SHORT,
          )}
        </Col>
        <Col xs={2}>
          {(props.charge.value / 100).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}
        </Col>
        <Col xs={2}>
          <PaymentStatusBadge charge={props.charge} />
        </Col>
      </Row>
    </Link>
  );
}
