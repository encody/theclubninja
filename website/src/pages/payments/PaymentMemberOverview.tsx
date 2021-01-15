import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import { IMember } from '../../model/Member';
import { useServer } from '../../server';
import PaymentRow from './PaymentRow';

interface PaymentMemberOverviewProps {
  member: IMember;
}

export default function PaymentMemberOverview(
  props: PaymentMemberOverviewProps,
) {
  const server = useServer();
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
        <Card.Body>
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
            {props.member.terms[server.term]?.ledger.map((entry, i) => (
              <PaymentRow key={i} entry={entry} />
            ))}
            {!props.member.terms[server.term]?.ledger.length && (
              <ListGroup.Item>No entries found.</ListGroup.Item>
            )}
          </ListGroup>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}
