import React, { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Col from 'react-bootstrap/esm/Col';
import Form from 'react-bootstrap/esm/Form';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import Modal from 'react-bootstrap/esm/Modal';
import Row from 'react-bootstrap/esm/Row';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { NO_PERMISSIONS } from '../../model/UserProfile';
import { useServer } from '../../server';
import NewUserModal from '../../shared/NewUserModal';
import { deepEquals } from '../../shared/util';
import UserDetails from './UserDetails';
import UserRow from './UserRow';

export default function Users() {
  const server = useServer();

  const getFilteredUsers = () =>
    Object.values(server.model.users).filter(
      user =>
        !deepEquals(user.permissions, NO_PERMISSIONS) &&
        ((user.email ?? '').toLowerCase().includes(filter.toLowerCase()) ||
          (user.name ?? '').toLowerCase().includes(filter.toLowerCase()) ||
          (user._name ?? '').toLowerCase().includes(filter.toLowerCase())),
    );

  const [filter, setFilter] = useState('');
  let filteredUsers = getFilteredUsers();
  const [showNewUserModal, setShowNewUserModal] = useState(false);

  const updateFilter = (filter: string) => {
    setFilter(filter);
    filteredUsers = getFilteredUsers();
  };

  return (
    <>
      <Row as="header">
        <h2 className="mb-3">Users</h2>
      </Row>

      <Row className="flex-wrap-reverse">
        <Col>
          <Form.Control
            type="search"
            placeholder="Search&hellip;"
            value={filter}
            onChange={e => updateFilter(e.target.value)}
          />
        </Col>
        <Col md="auto" className="text-right mb-3">
          <Button
            onClick={() => setShowNewUserModal(true)}
            variant="success"
            className="mr-3"
          >
            New User
          </Button>
        </Col>
      </Row>

      <ListGroup>
        <ListGroup.Item className="border-top-0 border-left-0 border-right-0">
          <Row className="font-weight-bold">
            <Col xs={5}>Name</Col>
            <Col xs={2}>Email</Col>
          </Row>
        </ListGroup.Item>
        {filteredUsers.map(user => (
          <UserRow key={user.id} user={user} />
        ))}
      </ListGroup>

      {filteredUsers.length ? null : (
        <div className="row justify-content-center m-3">
          <p>No users.</p>
        </div>
      )}

      <Route path="/users/:id?">
        <UserDetailsModalWithRouter />
      </Route>

      <NewUserModal
        show={showNewUserModal}
        onClose={() => setShowNewUserModal(false)}
      />
    </>
  );
}

type UserDetailsModalProps = RouteComponentProps<{ id: string }>;

function UserDetailsModal(props: UserDetailsModalProps) {
  const server = useServer();

  const close = () => {
    props.history.push('/users');
  };

  const user = Object.values(server.model.users).find(
    u => u.id === props.match.params.id,
  );

  return (
    <Modal size="lg" show={!!props.match.params.id} onHide={() => close()}>
      <UserDetails user={user} />
    </Modal>
  );
}

const UserDetailsModalWithRouter = withRouter(UserDetailsModal);
