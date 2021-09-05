import { DateTime } from 'luxon';
import React, { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Modal from 'react-bootstrap/esm/Modal';
import Row from 'react-bootstrap/esm/Row';
import * as uuid from 'uuid';
import { ICharge } from '../model/Charge';
import { IMember } from '../model/Member';
import { IMembership } from '../model/Membership';
import { useServer } from '../server';
import MemberSelector from './MemberSelector';
import styles from './NewMemberModal.module.css';
import { orderable } from './util';

interface NewMemberModalProps {
  show: boolean;
  onClose: () => void;
}

export default function NewMemberModal(props: NewMemberModalProps) {
  const server = useServer();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [graduationYear, setGraduationYear] = useState(
    new Date().getFullYear() + 2,
  );
  const memberTypeOrder = Object.values(server.model.memberTypes).sort(
    (a, b) => a.order - b.order,
  );
  const [memberType, setMemberType] = useState(
    memberTypeOrder[0] ? memberTypeOrder[0].id : undefined,
  );
  const [referralMember, setReferralMember] = useState(null as IMember | null);
  const [source, setSource] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [memberId, setMemberId] = useState('');
  const membershipDefaultsMap = () => {
    const entries = Object.entries(server.model.memberships);
    if (entries.length > 0) {
      return Array.from(entries).reduce(
        (acc, [id, m]) => acc.set(id, m.default),
        new Map<string, boolean>(),
      );
    } else {
      return new Map<string, boolean>();
    }
  };
  const [memberships, setMemberships] = useState(membershipDefaultsMap());
  const [dues, setDues] = useState(membershipDefaultsMap());

  const reset = () => {
    setName('');
    setEmail('');
    setGraduationYear(new Date().getFullYear() + 2);
    setMemberType(memberTypeOrder[0] ? memberTypeOrder[0].id : undefined);
    setReferralMember(null);
    setSource('');
    setInstitutionId('');
    setMemberId('');
    setMemberships(membershipDefaultsMap());
    setDues(membershipDefaultsMap());
  };

  const toggleMembership = (membership: IMembership) => {
    memberships.set(
      membership.id,
      !(memberships.has(membership.id)
        ? memberships.get(membership.id)
        : membership.default),
    );
    setMemberships(new Map(memberships));
  };

  const toggleDues = (membership: IMembership) => {
    dues.set(
      membership.id,
      !(dues.has(membership.id) ? dues.get(membership.id) : membership.default),
    );
    setMemberships(new Map(memberships));
  };

  const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

  const memberWithEmailExists = (email: string) =>
    Object.values(server.model.members).findIndex(m => m.email === email) !==
    -1;

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
                autoFocus
                required
                id="NewMemberModal_Name"
                type="text"
                placeholder="James Bond"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col sm={3}>
              <Form.Label htmlFor="NewMemberModal_Email">Email:</Form.Label>
            </Col>
            <Col>
              <Form.Control
                required
                className={
                  email.length === 0
                    ? ''
                    : isValidEmail(email) && !memberWithEmailExists(email)
                    ? 'is-valid'
                    : 'is-invalid'
                }
                id="NewMemberModal_Email"
                type="email"
                placeholder="me@james.bond"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <div className="invalid-feedback">
                {!isValidEmail(email) && 'Please enter a valid email address.'}
                {isValidEmail(email) &&
                  'A member with that email address already exists.'}
              </div>
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col sm={3}>
              <Form.Label htmlFor="NewMemberModal_Id">Member ID (x500):</Form.Label>
            </Col>
            <Col>
              <Form.Control
                required
                id="NewMemberModal_Id"
                className={
                  server.model.members[memberId]
                    ? 'is-invalid'
                    : memberId.trim().length
                    ? 'is-valid'
                    : ''
                }
                type="text"
                placeholder="bond007"
                value={memberId}
                onChange={e => setMemberId(e.target.value)}
              />
              <div className="invalid-feedback">Member ID already exists</div>
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col sm={3}>
              <Form.Label htmlFor="NewMemberModal_InstitutionId">
                School ID:
              </Form.Label>
            </Col>
            <Col>
              <Form.Control
                required
                id="NewMemberModal_InstitutionId"
                type="text"
                placeholder="1234567890"
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
                value={memberType}
              >
                {memberTypeOrder.map(m => (
                  <option key={m.id} value={m.id}>
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
                placeholder={DateTime.local().year.toString()}
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
          <Row className={styles.row}>
            <Col sm={3}>Add membership:</Col>
            <Col className="d-flex">
              {Object.values(server.model.memberships)
                .sort(orderable)
                .map(membership => (
                  <Form.Check
                    key={membership.id}
                    id={'NewMemberModal_CheckMembership-' + membership.id}
                    type="checkbox"
                    custom
                    className="mr-3"
                    label={membership.name}
                    onChange={() => toggleMembership(membership)}
                    checked={
                      memberships.has(membership.id)
                        ? memberships.get(membership.id)
                        : !!membership.default
                    }
                  />
                ))}
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col sm={3}>Add dues:</Col>
            <Col className="d-flex">
              {Object.values(server.model.memberships)
                .sort(orderable)
                .filter(
                  membership => membership.duesId in server.model.chargeTypes,
                )
                .map(membership => (
                  <Form.Check
                    key={membership.id}
                    id={'NewMemberModal_CheckDues-' + membership.id}
                    type="checkbox"
                    custom
                    className="mr-3"
                    label={`${membership.name} (${(
                      server.model.chargeTypes[membership.duesId].defaultValue /
                      100
                    ).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })})`}
                    onChange={() => toggleDues(membership)}
                    checked={
                      dues.has(membership.id)
                        ? dues.get(membership.id)
                        : !!membership.default
                    }
                  />
                ))}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          disabled={
            name.trim().length === 0 || // No name
            memberId.trim().length === 0 || // No account ID
            !!server.model.members[memberId] || // Account ID already exists
            graduationYear < 1900 || // Unlikely graduation year
            graduationYear > 2100 || // ...
            institutionId.trim().length === 0 // No institution ID
          }
          onClick={async () => {
            props.onClose();
            const duesCharges = Object.values(
              server.model.memberships,
            ).flatMap<ICharge>(m =>
              (dues.has(m.id) ? dues.get(m.id) : m.default)
                ? [
                    {
                      id: uuid.v4(),
                      memberId: memberId,
                      chargeType: m.duesId,
                      term: server.term,
                      start: Date.now(),
                      end: DateTime.local().plus({ days: 30 }).toMillis(),
                      note: 'Automatically generated on member creation',
                      payments: [],
                      value: server.model.chargeTypes[m.duesId].defaultValue,
                    },
                  ]
                : [],
            );
            const duesPromise =
              duesCharges.length > 0
                ? server.setCharges(
                    duesCharges.reduce((acc, c) => ({ [c.id]: c, ...acc }), {}),
                  )
                : null;
            if (
              await Promise.all([
                duesPromise,
                server.setMembers({
                  [memberId]: {
                    name,
                    id: memberId,
                    email,
                    graduationYear,
                    institutionId,
                    memberType: memberType ?? memberTypeOrder[0].id,
                    referralMember: referralMember ? referralMember.id : '',
                    source,
                    terms: {
                      [server.term]: {
                        attendance: [],
                        ledger: duesCharges.map(c => c.id),
                        memberships: Object.values(
                          server.model.memberships,
                        ).flatMap(m =>
                          (
                            memberships.has(m.id)
                              ? memberships.get(m.id)
                              : m.default
                          )
                            ? [m.id]
                            : [],
                        ),
                      },
                    },
                    waivers: [],
                  },
                }),
              ])
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
