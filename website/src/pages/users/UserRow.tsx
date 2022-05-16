import React from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { Link } from 'react-router-dom';
import { IUserProfile } from '../../model/UserProfile';
import { useServer } from '../../server';
import styles from './UserRow.module.css';

interface UserRowProps {
  user: IUserProfile;
}

export default function UserRow(props: UserRowProps) {
  const server = useServer();

  return (
    <Link
      to={'/users/' + props.user.id}
      className={'list-group-item list-group-item-action ' + styles.row}
    >
      <Row>
        <Col xs={5}>{props.user.name || props.user._name}</Col>
        <Col xs={2}>{props.user.email}</Col>
      </Row>
    </Link>
  );
}
