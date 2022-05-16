import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import Button from 'react-bootstrap/esm/Button';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Modal from 'react-bootstrap/esm/Modal';
import Row from 'react-bootstrap/esm/Row';
import { AuthResponse } from '../model/AuthResponse';
import { FULL_PERMISSIONS } from '../model/UserProfile';
import axios from '../network';
import { useServer } from '../server';
import styles from './NewUserModal.module.css';

interface NewUserModalProps {
  show: boolean;
  onClose: () => void;
}

export default function NewUserModal(props: NewUserModalProps) {
  const server = useServer();

  const [email, setEmail] = useState('');
  const [isAuthRecordMissing, setIsAuthRecordMissing] = useState(false);

  const reset = () => {
    setEmail('');
  };

  const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

  return (
    <Modal
      size="lg"
      show={props.show}
      onHide={props.onClose}
      scrollable={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>New User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row className={styles.row}>
            <Col sm={3}>
              <Form.Label htmlFor="NewUserModal_Email">Email:</Form.Label>
            </Col>
            <Col>
              <Form.Control
                required
                className={
                  email.length === 0
                    ? ''
                    : isValidEmail(email)
                    ? 'is-valid'
                    : 'is-invalid'
                }
                id="NewUserModal_Email"
                type="email"
                placeholder="me@james.bond"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <div className="invalid-feedback">
                {!isValidEmail(email) && 'Please enter a valid email address.'}
              </div>
            </Col>
          </Row>
          {isAuthRecordMissing && (
            <Alert variant="danger">
              Authentication record for that email address does not exist.
              Please have the user attempt to log in first to create the
              authentication record, then you will be able to add permissions to
              their account.
            </Alert>
          )}
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          disabled={
            email.trim().length === 0 // No email
          }
          onClick={async () => {
            const authRecordRes = await axios.get<AuthResponse>('/api/auth', {
              params: { email },
            });

            if (authRecordRes.status !== 200) {
              setIsAuthRecordMissing(true);
              return;
            }

            setIsAuthRecordMissing(false);

            const authRecord = authRecordRes.data;

            props.onClose();
            if (
              await server.setUsers({
                [authRecord.uid]: {
                  id: authRecord.uid,
                  name: authRecord.displayName,
                  email: authRecord.email,
                  permissions: FULL_PERMISSIONS,
                },
              })
            ) {
              reset();
            } else {
              // TODO: Popup error
            }
          }}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
