import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { IMember, isActiveMember, hasMembership } from '../../model/Member';
import { Membership } from '../../model/MemberTerm';
import { IModel, mostRecentTerm } from '../../model/Model';
import TeamAttendanceHistoryRow from './TeamAttendanceHistoryRow';
import TeamCheckInRow from './TeamCheckInRow';
import TeamRosterRow from './TeamRosterRow';
import Button from 'react-bootstrap/Button';
import AddMemberModal from './AddMemberModal';
import { useServer } from '../../server';

export default function Team() {
  const server = useServer();

  const members = Object.values(server.model!.members).filter(
    m =>
      isActiveMember(m, server.term) &&
      hasMembership(m, Membership.Team, server.term),
  );

  const [filter, setFilter] = useState('');
  const [filteredMembers, setFilteredMembers] = useState(members.slice());
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const updateFilter = (filterString: string) => {
    const lcFilter = filterString.toLowerCase();

    setFilter(filterString);
    setFilteredMembers(
      members.filter(
        member =>
          member.name.toLowerCase().includes(lcFilter) ||
          member.studentId.toLowerCase().includes(lcFilter) ||
          member.accountId.toLowerCase().includes(lcFilter),
      ),
    );
  };

  const openAddMemberModal = () => {
    setShowAddMemberModal(true);
  };

  const closeAddMemberModal = () => {
    setShowAddMemberModal(false);
  };

  return (
    <>
      <Row as="header">
        <h2 className="mb-3">Team Check-In</h2>
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
          <Button onClick={() => openAddMemberModal()}>Add Member</Button>
        </div>
      </div>

      <Tabs id="teamCheckIn" defaultActiveKey="checkin">
        <Tab eventKey="checkin" title="Check-In">
          <ListGroup>
            <ListGroup.Item className="border-top-0 border-left-0 border-right-0">
              <Row className="font-weight-bold">
                <Col xs={4}>Name</Col>
                <Col xs={2}>Account ID</Col>
                <Col xs={6}>Check-In</Col>
              </Row>
            </ListGroup.Item>
            {filteredMembers.map(member => (
              <TeamCheckInRow key={member.accountId} member={member} />
            ))}
          </ListGroup>
        </Tab>
        <Tab eventKey="history" title="Attendance History">
          <ListGroup>
            <ListGroup.Item className="border-top-0 border-left-0 border-right-0">
              <Row className="font-weight-bold">
                <Col xs={4}>Name</Col>
                <Col xs={2}>Account ID</Col>
                <Col xs={6}>Check-In</Col>
              </Row>
            </ListGroup.Item>
            {filteredMembers.map(member => (
              <TeamAttendanceHistoryRow
                key={member.accountId}
                member={member}
              />
            ))}
          </ListGroup>
        </Tab>
        <Tab eventKey="roster" title="Roster">
          <ListGroup>
            <ListGroup.Item className="border-top-0 border-left-0 border-right-0">
              <Row className="font-weight-bold">
                <Col xs={4}>Name</Col>
                <Col xs={2}>Account ID</Col>
                <Col xs={6}>Actions</Col>
              </Row>
            </ListGroup.Item>
            {filteredMembers.map(member => (
              <TeamRosterRow key={member.accountId} member={member} />
            ))}
          </ListGroup>
        </Tab>
      </Tabs>

      {filteredMembers.length ? null : (
        <div className="row justify-content-center m-3">
          <p>No members.</p>
        </div>
      )}

      <AddMemberModal
        onClose={() => closeAddMemberModal()}
        show={showAddMemberModal}
      />
    </>
  );
}
