import React from 'react';
import Button from 'react-bootstrap/esm/Button';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { IMember } from '../../model/Member';
import { IMembership } from '../../model/Membership';
import { useServer } from '../../server';

interface ManageRowProps {
  member: IMember;
  membership: IMembership;
}

export default function ManageRow(props: ManageRowProps) {
  const server = useServer();
  return (
    <Container className={'list-group-item'}>
      <Row>
        <Col xs={4}>{props.member.name}</Col>
        <Col xs={2}>{props.member.id}</Col>
        <Col xs={6}>
          <Button
            size="sm"
            variant="danger"
            onClick={async () => {
              const term = props.member.terms[server.term]!;
              term.memberships = term.memberships.filter(
                m => m !== props.membership.id,
              );
              if (
                await server.setMembers({
                  [props.member.id]: props.member,
                })
              ) {
                // TODO: Alert success
              } else {
                // TODO: Alert error
              }
            }}
          >
            Remove
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
