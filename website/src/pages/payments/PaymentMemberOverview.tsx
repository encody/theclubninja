import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import { ICharge } from '../../model/Charge';
import { IMember } from '../../model/Member';
import PaymentRow from './PaymentRow';

interface PaymentMemberOverviewProps {
  member: IMember;
  charges: ICharge[];
}

export default function PaymentMemberOverview(
  props: PaymentMemberOverviewProps,
) {
  return (
    <Card>
      <Accordion.Toggle
        className="cursor-pointer"
        as={Card.Header}
        eventKey={props.member.accountId}
        style={{ cursor: 'pointer' }}
      >
        {props.member.name}
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={props.member.accountId}>
        <Card.Body className="p-0 pt-1">
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Row className="font-weight-bold">
                <Col sm={4}>Reason</Col>
                <Col sm={2}>Created</Col>
                <Col sm={2}>Due</Col>
                <Col sm={2}>Value</Col>
                <Col sm={2}>Status</Col>
              </Row>
            </ListGroup.Item>
            {props.charges.map((charge, i) => (
              <PaymentRow
                key={charge.id}
                charge={charge}
                member={props.member}
              />
            ))}
            {!props.charges.length && (
              <ListGroup.Item>No entries found.</ListGroup.Item>
            )}
          </ListGroup>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}
