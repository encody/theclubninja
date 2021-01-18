import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { IMember } from '../../model/Member';
import { IMembership } from '../../model/Membership';
import { useServer } from '../../server';

interface ManagementRowProps {
  member: IMember;
  membership: IMembership;
}

export default function ManagementRow(props: ManagementRowProps) {
  const server = useServer();
  return (
    <Container className={'list-group-item'}>
      <Row>
        <Col xs={4}>{props.member.name}</Col>
        <Col xs={3}>{props.member.accountId}</Col>
        <Col xs={5}>
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
                  [props.member.accountId]: props.member,
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
