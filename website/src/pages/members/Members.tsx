import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { IMember, isActiveMember } from '../../model/Member';
import { useServer } from '../../server';
import AddMemberModal from '../../shared/AddMemberModal';
import NewMemberModal from '../../shared/NewMemberModal';
import MemberDetails from './MemberDetails';
import MemberRow from './MemberRow';

export default function Members() {
  const server = useServer();

  const getFilteredMembers = () =>
    Object.values(server.model.members).filter(
      member =>
        isActiveMember(member, server.term) &&
        (member.name.toLowerCase().includes(filter.toLowerCase()) ||
          member.institutionId.toLowerCase().includes(filter.toLowerCase()) ||
          member.accountId.toLowerCase().includes(filter.toLowerCase())),
    );

  const [filter, setFilter] = useState('');
  let filteredMembers = getFilteredMembers();
  const [showNewMemberModal, setShowNewMemberModal] = useState(false);
  const [showInactiveMemberModal, setShowInactiveMemberModal] = useState(false);

  const updateFilter = (filter: string) => {
    setFilter(filter);
    filteredMembers = getFilteredMembers();
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
            <Button onClick={() => setShowNewMemberModal(true)} className="mr-3">
              New Member
            </Button>
            <Button onClick={() => setShowInactiveMemberModal(true)}>
              Inactive Members
            </Button>
        </div>
      </div>

      <ListGroup>
        <ListGroup.Item className="border-top-0 border-left-0 border-right-0">
          <Row className="font-weight-bold">
            <Col xs={5}>Name</Col>
            <Col xs={3}>Account ID</Col>
            <Col xs={2}>Memberships</Col>
            <Col xs={2}>Type</Col>
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
        <MemberDetailsModalWithRouter />
      </Route>

      <NewMemberModal
        show={showNewMemberModal}
        onClose={() => setShowNewMemberModal(false)}
      />
      <AddMemberModal
        show={showInactiveMemberModal}
        onClose={() => setShowInactiveMemberModal(false)}
        title={
          'Add Inactive Members to Term ' +
          server.model.terms[server.term]?.name
        }
        members={Object.values(server.model.members).filter(
          m => !isActiveMember(m, server.term),
        )}
        onSelect={async members => {
          const update: {
            [accountId: string]: IMember;
          } = {};

          members.forEach(m => {
            m.terms[server.term] = {
              attendance: [],
              ledger: [],
              memberships: [],
            };
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

type MemberDetailsModalProps = RouteComponentProps<{ id: string }>;

function MemberDetailsModal(props: MemberDetailsModalProps) {
  const server = useServer();

  const close = () => {
    props.history.push('/members');
  };

  const member = Object.values(server.model.members).find(
    m => m.accountId === props.match.params.id,
  );
  return (
    <Modal size="lg" show={!!props.match.params.id} onHide={() => close()}>
      <MemberDetails member={member} />
    </Modal>
  );
}

const MemberDetailsModalWithRouter = withRouter(MemberDetailsModal);
