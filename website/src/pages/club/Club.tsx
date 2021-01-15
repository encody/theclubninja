import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import { mostRecentTerm } from '../../model/Model';
import { useServer } from '../../server';
import NewMemberModal from '../../shared/NewMemberModal';
import ClubRow from './ClubRow';

export default function Club() {
  const server = useServer();
  const members = Object.values(server.model!.members);
  const [filter, setFilter] = useState('');
  const [filteredMembers, setFilteredMembers] = useState(members.slice());
  const [showNewMemberModal, setShowNewMemberModal] = useState(false);

  const openNewMemberModal = () => {
    setShowNewMemberModal(true);
  };

  const closeNewMemberModal = () => {
    setShowNewMemberModal(false);
  };

  const updateFilter = (filter: string) => {
    setFilter(filter);
    setFilteredMembers(
      members.filter(
        member =>
          member.name.toLowerCase().includes(filter.toLowerCase()) ||
          member.studentId.toLowerCase().includes(filter.toLowerCase()) ||
          member.accountId.toLowerCase().includes(filter.toLowerCase()),
      ),
    );
  };

  const currentTerm = mostRecentTerm(server.model!);

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
          <Button onClick={() => openNewMemberModal()}>New Member</Button>
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
          <ClubRow
            key={member.accountId}
            member={member}
          />
        ))}
      </ListGroup>

      {filteredMembers.length ? null : (
        <div className="row justify-content-center m-3">
          <p>No members.</p>
        </div>
      )}

      <NewMemberModal
        show={showNewMemberModal}
        onClose={() => closeNewMemberModal()}
      />
    </>
  );
}
