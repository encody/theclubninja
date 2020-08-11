import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { IMember } from '../../model/Member';

interface TeamRosterRowProps {
  member: IMember;
  term: string;
}

export default class TeamRosterRow extends React.Component<TeamRosterRowProps> {
  render() {
    return (
      <Container className={'list-group-item'}>
        <Row>
          <Col xs={4}>{this.props.member.name}</Col>
          <Col xs={2}>{this.props.member.accountId}</Col>
          <Col xs={6}>
            <Button size="sm" variant="danger">
              Remove
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}
