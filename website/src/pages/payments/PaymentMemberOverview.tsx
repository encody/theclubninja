import React from 'react';
import Accordion from 'react-bootstrap/esm/Accordion';
import Card from 'react-bootstrap/esm/Card';
import Col from 'react-bootstrap/esm/Col';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import Row from 'react-bootstrap/esm/Row';
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
        as={Card.Header}
        eventKey={props.member.id}
        style={{ cursor: 'pointer' }}
      >
        {props.member.name} ({props.member.id})
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={props.member.id}>
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
