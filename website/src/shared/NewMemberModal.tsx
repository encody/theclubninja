import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { IMember } from '../model/Member';
import { useServer } from '../server';
import MemberSelector from './MemberSelector';
import styles from './NewMemberModal.module.css';

interface NewMemberModalProps {
  show: boolean;
  onClose: () => void;
}

export default function NewMemberModal(props: NewMemberModalProps) {
  const server = useServer();

  const [name, setName] = useState('');
  const [graduationYear, setGraduationYear] = useState(
    new Date().getFullYear() + 2,
  );
  const memberTypeOrder = Object.values(server.model.memberTypes).sort(
    (a, b) => a.order - b.order,
  );
  const [memberType, setMemberType] = useState(memberTypeOrder[0]?.id ?? '');
  const [referralMember, setReferralMember] = useState(null as IMember | null);
  const [source, setSource] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [accountId, setAccountId] = useState('');

  const reset = () => {
    setName('');
    setGraduationYear(new Date().getFullYear() + 2);
    setMemberType(memberTypeOrder[0]?.id ?? '');
    setReferralMember(null);
    setSource('');
    setInstitutionId('');
    setAccountId('');
  };

  return (
    <Modal
      size="lg"
      show={props.show}
      onHide={props.onClose}
      scrollable={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {name.trim().length ? 'New Member: ' + name : 'New Member'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row className={styles.row}>
            <Col sm={3}>
              <Form.Label htmlFor="NewMemberModal_Name">Name:</Form.Label>
            </Col>
            <Col>
              <Form.Control
                required
                id="NewMemberModal_Name"
                type="text"
                placeholder="The name's Bond. James Bond."
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col sm={3}>
              <Form.Label htmlFor="NewMemberModal_AccountId">
                Account ID:
              </Form.Label>
            </Col>
            <Col>
              <Form.Control
                required
                id="NewMemberModal_AccountId"
                className={
                  server.model.members[accountId]
                    ? 'is-invalid'
                    : accountId.trim().length
                    ? 'is-valid'
                    : ''
                }
                type="text"
                placeholder="An unambiguous, human-readable identifier"
                value={accountId}
                onChange={e => setAccountId(e.target.value)}
              />
              <div className="invalid-feedback">Account ID already exists</div>
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col sm={3}>
              <Form.Label htmlFor="NewMemberModal_InstitutionId">
                Institution ID:
              </Form.Label>
            </Col>
            <Col>
              <Form.Control
                required
                id="NewMemberModal_InstitutionId"
                type="text"
                placeholder="ID given by the associated institution"
                value={institutionId}
                onChange={e => setInstitutionId(e.target.value)}
              />
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col sm={3}>
              <Form.Label htmlFor="NewMemberModal_MemberType">
                Member Type:
              </Form.Label>
            </Col>
            <Col>
              <Form.Control
                required
                custom
                id="NewMemberModal_MemberType"
                as="select"
                onChange={e =>
                  setMemberType(
                    server.model.memberTypes[e.target.value]
                      ? e.target.value
                      : memberTypeOrder[0].id ?? '',
                  )
                }
              >
                {memberTypeOrder.map(m => (
                  <option
                    key={m.id}
                    value={m.id}
                    selected={m.id === memberType}
                  >
                    {m.name}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col sm={3}>
              <Form.Label htmlFor="NewMemberModal_GraduationYear">
                Graduation Year:
              </Form.Label>
            </Col>
            <Col>
              <Form.Control
                required
                type="text"
                id="NewMemberModal_GraduationYear"
                value={graduationYear}
                onChange={e => {
                  const { value } = e.target;
                  const p = parseInt(value, 10);
                  if (/^\d+$/.test(value) && !isNaN(p) && p >= 0) {
                    setGraduationYear(p);
                  }
                }}
              />
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col sm={3}>
              <Form.Label htmlFor="NewMemberModal_Source">
                How did you hear about us?{' '}
                <small className="text-muted">(optional)</small>
              </Form.Label>
            </Col>
            <Col>
              <Form.Control
                required
                id="NewMemberModal_Source"
                placeholder="Telephone, television, telegraph, tele&hellip;path?"
                as="textarea"
                value={source}
                onChange={e => setSource(e.target.value)}
              />
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col sm={3}>
              <Form.Label htmlFor="NewMemberModal_ReferralMember">
                Referring member:{' '}
                <small className="text-muted">(optional)</small>
              </Form.Label>
            </Col>
            <Col>
              <MemberSelector
                id="NewMemberModal_ReferralMember"
                filter={() => true}
                member={referralMember}
                onSelect={m => setReferralMember(m)}
              />
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          disabled={
            name.trim().length === 0 || // No name
            accountId.trim().length === 0 || // No account ID
            !!server.model.members[accountId] || // Account ID already exists
            graduationYear < 1900 || // Unlikely graduation year
            graduationYear > 2100 || // ...
            institutionId.trim().length === 0 // No institution ID
          }
          onClick={async () => {
            props.onClose();
            if (
              await server.setMembers({
                [accountId]: {
                  name,
                  accountId,
                  graduationYear,
                  institutionId,
                  memberType,
                  referralMember: referralMember
                    ? referralMember.accountId
                    : '',
                  source,
                  terms: {
                    [server.term]: {
                      attendance: [],
                      ledger: [],
                      memberships: [], // TODO: Default memberships
                    },
                  },
                  waivers: [],
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
