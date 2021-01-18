import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import { hasMembership, IMember, isActiveMember } from '../../model/Member';
import { Membership } from '../../model/Membership';
import { useServer } from '../../server';
import AddMemberModal from '../../shared/AddMemberModal';
import ClubRow from './ClubRow';

export default function Club() {
  const server = useServer();
  const [filter, setFilter] = useState('');

  const getFilteredMembers = () =>
    Object.values(server.model.members).filter(
      member =>
        isActiveMember(member, server.term) &&
        hasMembership(member, Membership.Club, server.term) &&
        (member.name.toLowerCase().includes(filter.toLowerCase()) ||
          member.institutionId.toLowerCase().includes(filter.toLowerCase()) ||
          member.accountId.toLowerCase().includes(filter.toLowerCase())),
    );

  let filteredMembers = getFilteredMembers();
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const updateFilter = (filter: string) => {
    setFilter(filter);
    filteredMembers = getFilteredMembers();
  };

  return (
    <>
      <Row as="header">
        <h2 className="mb-3">Club Check-In</h2>
      </Row>

      <div className="d-flex mb-3">
        <div className="flex-grow-1">
          <Form.Control
            type="search"
            placeholder="Search&hellip;"
            value={filter}
            onChange={e => updateFilter(e.target.value)}
          />
        </div>
        <div className="ml-3 flex-shrink-1">
          <Button onClick={() => setShowAddMemberModal(true)}>
            Add Member
          </Button>
        </div>
      </div>

      <ListGroup>
        <ListGroup.Item className="border-top-0 border-left-0 border-right-0">
          <Row className="font-weight-bold">
            <Col xs={5}>Name</Col>
            <Col xs={3}>Account ID</Col>
            <Col xs={4}>Check-In</Col>
          </Row>
        </ListGroup.Item>
        {filteredMembers.map(member => (
          <ClubRow key={member.accountId} member={member} />
        ))}
      </ListGroup>

      {filteredMembers.length ? null : (
        <div className="row justify-content-center m-3">
          <p>No members.</p>
        </div>
      )}

      <AddMemberModal
        title="Add Members to Club Roster"
        members={Object.values(server.model.members).filter(
          m =>
            isActiveMember(m, server.term) &&
            !hasMembership(m, Membership.Club, server.term),
        )}
        onClose={() => setShowAddMemberModal(false)}
        show={showAddMemberModal}
        onSelect={async members => {
          const update: {
            [accountId: string]: IMember;
          } = {};

          members.forEach(m => {
            m.terms[server.term]!.memberships.push(Membership.Club);
            update[m.accountId] = m;
          });

          if (await server.setMembers(update)) {
            return true;
          } else {
            // TODO: Popup error
            return false;
          }
        }}
      />
    </>
  );
}
