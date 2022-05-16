import axios from 'axios';
import React from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/esm/Modal';
import Table from 'react-bootstrap/esm/Table';
import { useHistory } from 'react-router-dom';
import { AuthResponse } from '../../model/AuthResponse';
import {
  FULL_PERMISSIONS,
  IUserProfile,
  NO_PERMISSIONS,
} from '../../model/UserProfile';
import { IServer, useServer } from '../../server';

interface UserDetailsProps {
  user: IUserProfile | undefined;
}

export default function UserDetails(props: UserDetailsProps) {
  const server = useServer();

  return <UserDetailsWrapped server={server} {...props} />;
}

class UserDetailsWrapped extends React.Component<
  UserDetailsProps & { server: IServer },
  {}
> {
  shouldComponentUpdate(nextProps: UserDetailsProps) {
    return !!nextProps.user;
  }

  render() {
    const updateUser = async () => {
      if (this.props.user) {
        const res = await axios.get<AuthResponse>('/api/auth', {
          params: {
            uid: this.props.user.id,
          },
        });

        if (res.status === 200) {
          const auth = res.data;
          const newUser: IUserProfile = {
            id: auth.uid,
            permissions: FULL_PERMISSIONS,
            email: auth.email,
            name: auth.displayName,
          };

          await this.props.server.setUsers({
            [newUser.id]: newUser,
          });
        }
      }
    };

    const removeUser = async () => {
      if (this.props.user) {
        const res = await axios.get<AuthResponse>('/api/auth', {
          params: {
            uid: this.props.user.id,
          },
        });

        if (res.status === 200) {
          const auth = res.data;
          const newUser: IUserProfile = {
            id: auth.uid,
            permissions: NO_PERMISSIONS,
            email: auth.email,
            name: auth.displayName,
          };

          await this.props.server.setUsers({
            [newUser.id]: newUser,
          });
        }
      }
    };

    return this.props.user ? (
      <>
        <Modal.Header closeButton>
          <Modal.Title>
            {this.props.user.name || this.props.user._name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table responsive>
            <tbody>
              <tr>
                <td>Account ID:</td>
                <td>
                  <code>{this.props.user.id}</code>
                </td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>{this.props.user.email}</td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => updateUser()}>Refresh Information</Button>
          <Button variant="danger" onClick={() => removeUser()}>
            Remove Permissions
          </Button>
        </Modal.Footer>
      </>
    ) : (
      <>
        <Modal.Header closeButton>
          <Modal.Title>User not found</Modal.Title>
        </Modal.Header>
        <Modal.Body>This user does not exist in the database.</Modal.Body>
      </>
    );
  }
}
