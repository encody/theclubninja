import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { Member } from '../../model/Member';

export default class PaymentMemberOverview extends React.Component<{
  member: Member;
  termId: string;
}> {
  render() {
    return (
      <Card>
        <Accordion.Toggle
          className="cursor-pointer"
          as={Card.Header}
          eventKey={this.props.member.data.accountId}
        >
          {this.props.member.data.name}
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={this.props.member.data.accountId}>
          <Card.Body>
            {this.props.member.data.terms[this.props.termId]?.ledger.map(
              entry => (
                <p>{entry.note}</p>
              ),
            )}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  }
}
