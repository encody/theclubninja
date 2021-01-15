import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { IMember } from '../../model/Member';

interface TeamRosterRowProps {
  member: IMember;
}

export default function TeamRosterRow(props: TeamRosterRowProps) {
  return (
    <Container className={'list-group-item'}>
      <Row>
        <Col xs={4}>{props.member.name}</Col>
        <Col xs={2}>{props.member.accountId}</Col>
        <Col xs={6}>
          <Button size="sm" variant="danger">
            Remove
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
