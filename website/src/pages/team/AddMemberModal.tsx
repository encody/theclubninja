import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import * as Icon from 'react-feather';
import { hasMembership, IMember, isActiveMember } from '../../model/Member';
import { Membership } from '../../model/Membership';
import { useServer } from '../../server';

interface AddMemberModalProps {
  show: boolean;
  onClose: () => void;
}

export default function AddMemberModal(props: AddMemberModalProps) {
  const server = useServer();

  const members = Object.values(server.model!.members).filter(
    m =>
      isActiveMember(m, server.term) &&
      !hasMembership(m, Membership.Team, server.term),
  );

  const [filter, setFilter] = useState('');
  const [filteredMembers, setFilteredMembers] = useState(members.slice());
  const [selectedMembers, setSelectedMembers] = useState(new Set<IMember>());

  const updateFilter = (filterString: string) => {
    const lcFilter = filterString.toLowerCase();

    setFilter(filterString);
    setFilteredMembers(
      members.filter(
        member =>
          member.name.toLowerCase().includes(lcFilter) ||
          member.institutionId.toLowerCase().includes(lcFilter) ||
          member.accountId.toLowerCase().includes(lcFilter),
      ),
    );
  };

  const toggleSelected = (member: IMember) => {
    if (selectedMembers.has(member)) {
      selectedMembers.delete(member);
    } else {
      selectedMembers.add(member);
    }
    setSelectedMembers(new Set(selectedMembers));
  };

  const reset = () => {
    setSelectedMembers(new Set());
    updateFilter('');
  };

  return (
    <Modal size="lg" show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Member to Team Roster</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <Form.Control
            type="search"
            placeholder="Search&hellip;"
            value={filter}
            onChange={e => updateFilter(e.target.value)}
          />
        </div>

        <ListGroup>
          <ListGroup.Item className="border-top-0 border-left-0 border-right-0">
            <Row className="font-weight-bold">
              <Col xs={1}>
                <Icon.Check size={20} />
              </Col>
              <Col xs={6}>Name</Col>
              <Col xs={5}>Account ID</Col>
            </Row>
          </ListGroup.Item>
          {filteredMembers.map(member => (
            <ListGroup.Item
              action
              active={selectedMembers.has(member)}
              onClick={() => toggleSelected(member)}
              key={member.accountId}
            >
              <Row>
                <Col xs={1}>
                  {selectedMembers.has(member) ? (
                    <Icon.CheckSquare size={20} />
                  ) : (
                    <Icon.Square size={20} />
                  )}
                </Col>
                <Col xs={6}>{member.name}</Col>
                <Col xs={5}>{member.accountId}</Col>
              </Row>
            </ListGroup.Item>
          ))}
          {filteredMembers.length === 0 && (
            <Row>
              <Col className="text-center m-2">No members found.</Col>
            </Row>
          )}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={selectedMembers.size === 0}
          onClick={async () => {
            props.onClose();
            const update: {
              [accountId: string]: IMember;
            } = {};

            selectedMembers.forEach(m => {
              m.terms[server.term]!.memberships.push(Membership.Team);
              update[m.accountId] = m;
            });

            if (await server.setMembers(update)) {
              reset();
            } else {
              // TODO: Popup error
            }
          }}
        >
          Add {selectedMembers.size} member
          {selectedMembers.size !== 1 && 's'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
