import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { hasMembership, IMember, isActiveMember } from '../../model/Member';
import { IMembership } from '../../model/Membership';
import { useServer } from '../../server';
import AddMemberModal from '../../shared/AddMemberModal';
import NewMemberModal from '../../shared/NewMemberModal';
import AttendanceHistoryRow from './AttendanceHistoryRow';
import CheckInRow from './CheckInRow';
import ManageRow from './ManageRow';

interface RosterProps {
  membership: IMembership;
}

export default function Roster(props: RosterProps) {
  const server = useServer();

  const getFilteredMembers = () =>
    Object.values(server.model.members).filter(
      member =>
        isActiveMember(member, server.term) &&
        hasMembership(member, props.membership.id, server.term) &&
        (member.name.toLowerCase().includes(filter.toLowerCase()) ||
          member.institutionId.toLowerCase().includes(filter.toLowerCase()) ||
          member.id.toLowerCase().includes(filter.toLowerCase())),
    );

  const [filter, setFilter] = useState('');
  let filteredMembers = getFilteredMembers();
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showNewMemberModal, setShowNewMemberModal] = useState(false);

  const updateFilter = (filterString: string) => {
    setFilter(filterString);
    filteredMembers = getFilteredMembers();
  };

  return (
    <>
      <Row as="header">
        <h2 className="mb-3">{props.membership.name}</h2>
      </Row>

      <Row className="flex-wrap-reverse">
        <Col className="mb-3">
          <Form.Control
            type="search"
            placeholder="Search&hellip;"
            value={filter}
            onChange={e => updateFilter(e.target.value)}
          />
        </Col>
        <Col md="auto" className="text-right mb-3">
          <Button
            onClick={() => setShowNewMemberModal(true)}
            variant="success"
            className="mr-3"
          >
            New Member
          </Button>
          <Button onClick={() => setShowAddMemberModal(true)}>
            Add Members
          </Button>
        </Col>
      </Row>

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
              <CheckInRow
                key={member.id}
                member={member}
                membership={props.membership}
              />
            ))}
          </ListGroup>
        </Tab>
        {props.membership.useDetailedAttendance && (
          <Tab eventKey="history" title="Attendance History">
            <ListGroup>
              <ListGroup.Item className="border-top-0 border-left-0 border-right-0">
                <Row className="font-weight-bold">
                  <Col xs={4}>Name</Col>
                  <Col xs={2}>Account ID</Col>
                  <Col xs={6}>History</Col>
                </Row>
              </ListGroup.Item>
              {filteredMembers.map(member => (
                <AttendanceHistoryRow
                  key={member.id}
                  member={member}
                  membership={props.membership}
                />
              ))}
            </ListGroup>
          </Tab>
        )}
        <Tab eventKey="manage" title="Manage">
          <ListGroup>
            <ListGroup.Item className="border-top-0 border-left-0 border-right-0">
              <Row className="font-weight-bold">
                <Col xs={4}>Name</Col>
                <Col xs={2}>Account ID</Col>
                <Col xs={6}>Actions</Col>
              </Row>
            </ListGroup.Item>
            {filteredMembers.map(member => (
              <ManageRow
                key={member.id}
                member={member}
                membership={props.membership}
              />
            ))}
          </ListGroup>
        </Tab>
      </Tabs>

      {filteredMembers.length ? null : (
        <div className="row justify-content-center m-3">
          <p>No members.</p>
        </div>
      )}

      <NewMemberModal
        show={showNewMemberModal}
        onClose={() => setShowNewMemberModal(false)}
      />
      <AddMemberModal
        title={`Add Members to ${props.membership.name} Roster`}
        members={Object.values(server.model.members).filter(
          m =>
            isActiveMember(m, server.term) &&
            !hasMembership(m, props.membership.id, server.term),
        )}
        onSelect={async members => {
          const update: {
            [id: string]: IMember;
          } = {};

          members.forEach(m => {
            m.terms[server.term]!.memberships.push(props.membership.id);
            update[m.id] = m;
          });

          if (await server.setMembers(update)) {
            return true;
          } else {
            // TODO: Popup error
            return false;
          }
        }}
        onClose={() => setShowAddMemberModal(false)}
        show={showAddMemberModal}
      />
    </>
  );
}
