import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { IMember } from '../model/Member';
import { Membership } from '../model/Membership';
import { MemberType, memberTypes } from '../model/MemberType';
import { useServer } from '../server';
import MemberSelector from './MemberSelector';

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
  const [memberType, setMemberType] = useState(MemberType.Student);
  const [referralMember, setReferralMember] = useState(null as IMember | null);
  const [source, setSource] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [accountId, setAccountId] = useState('');

  const reset = () => {
    setName('');
    setGraduationYear(new Date().getFullYear() + 2);
    setMemberType(MemberType.Student);
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
        <Table responsive>
          <tr>
            <td>Name:</td>
            <td>
              <Form.Control
                required
                type="text"
                placeholder="The name's Bond. James Bond."
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>Account ID:</td>
            <td>
              <Form.Control
                required
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
            </td>
          </tr>
          <tr>
            <td>Institution ID:</td>
            <td>
              <Form.Control
                required
                type="text"
                placeholder="ID given by the associated institution"
                value={institutionId}
                onChange={e => setInstitutionId(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>Member Type:</td>
            <td>
              <Form.Control
                required
                custom
                as="select"
                onChange={e =>
                  setMemberType(
                    e.target.value in MemberType
                      ? (e.target.value as MemberType)
                      : MemberType.Student,
                  )
                }
              >
                {(Object.keys(MemberType) as (keyof typeof MemberType)[]).map(
                  k => (
                    <option
                      key={k}
                      value={k}
                      selected={MemberType[k] === memberType}
                    >
                      {memberTypes[MemberType[k]].name}
                    </option>
                  ),
                )}
              </Form.Control>
            </td>
          </tr>
          <tr>
            <td>Graduation Year:</td>
            <td>
              <Form.Control
                required
                type="text"
                value={graduationYear}
                onChange={e => {
                  const { value } = e.target;
                  const p = parseInt(value, 10);
                  if (/^\d+$/.test(value) && !isNaN(p) && p >= 0) {
                    setGraduationYear(p);
                  }
                }}
              />
            </td>
          </tr>
          <tr>
            <td>How did you hear about us?</td>
            <td>
              <Form.Control
                required
                as="textarea"
                value={source}
                onChange={e => setSource(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>Referring member:</td>
            <td>
              <MemberSelector
                id="NewMemberModal_MemberSelector"
                filter={() => true}
                member={referralMember}
                onSelect={m => setReferralMember(m)}
              />
            </td>
          </tr>
        </Table>
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
                      memberships: [Membership.Club],
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
