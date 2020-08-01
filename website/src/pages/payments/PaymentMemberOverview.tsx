import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { IMember } from '../../model/Member';
import ListGroup from 'react-bootstrap/ListGroup';
import PaymentRow from './PaymentRow';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default class PaymentMemberOverview extends React.Component<{
  member: IMember;
  termId: string;
}> {
  render() {
    return (
      <Card>
        <Accordion.Toggle
          className="cursor-pointer"
          as={Card.Header}
          eventKey={this.props.member.accountId}
        >
          {this.props.member.name}
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={this.props.member.accountId}>
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
              {this.props.member.terms[this.props.termId]?.ledger.map(
                (entry, i) => (
                  <PaymentRow key={i} entry={entry} />
                ),
              )}
              {!this.props.member.terms[this.props.termId]?.ledger.length && (
                <ListGroup.Item>No entries found.</ListGroup.Item>
              )}
            </ListGroup>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  }
}
