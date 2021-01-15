import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { IMember, isActiveMember } from '../../model/Member';
import { useServer } from '../../server';
import NewMemberModal from '../../shared/NewMemberModal';
import MemberDetails from './MemberDetails';
import MemberRow from './MemberRow';

interface MembersState {
  filter: string;
  filteredMembers: IMember[];
  showNewMemberModal: boolean;
}

export default function Members() {
  const server = useServer();
  const members = Object.values(server.model!.members).filter(m =>
    isActiveMember(m, server.term),
  );

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

  return (
    <>
      <Row as="header">
        <h2 className="mb-3">Members</h2>
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
            <Col xs={2}>Team Member</Col>
            <Col xs={2}>Status</Col>
          </Row>
        </ListGroup.Item>
        {filteredMembers.map(member => (
          <MemberRow key={member.accountId} member={member} />
        ))}
      </ListGroup>

      {filteredMembers.length ? null : (
        <div className="row justify-content-center m-3">
          <p>No members.</p>
        </div>
      )}

      <Route path="/members/:id?">
        <MemberDetailsModalWithRouter members={members} />
      </Route>

      <NewMemberModal
        show={showNewMemberModal}
        onClose={() => closeNewMemberModal()}
      />
    </>
  );
}

type MemberDetailsModalProps = RouteComponentProps<{ id: string }> & {
  members: IMember[];
};

class MemberDetailsModal extends React.Component<
  MemberDetailsModalProps,
  { show: boolean }
> {
  constructor(props: MemberDetailsModalProps) {
    super(props);
  }

  close() {
    this.props.history.push('/members');
  }

  render() {
    const member = this.props.members.find(
      m => m.accountId === this.props.match.params.id,
    );
    return (
      <Modal
        size="lg"
        show={!!this.props.match.params.id}
        onHide={() => this.close()}
      >
        <MemberDetails member={member} />
      </Modal>
    );
  }
}

const MemberDetailsModalWithRouter = withRouter(MemberDetailsModal);
