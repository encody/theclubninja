import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { Membership } from '../model/Membership';
import { MemberType, memberTypes } from '../model/MemberType';
import { useServer } from '../server';

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
  const [referralMember, setReferralMember] = useState('');
  const [source, setSource] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [accountId, setAccountId] = useState('');

  const reset = () => {
    setName('');
    setGraduationYear(new Date().getFullYear() + 2);
    setMemberType(MemberType.Student);
    setReferralMember('');
    setSource('');
    setInstitutionId('');
    setAccountId('');
  };

  return (
    <Modal size="lg" show={props.show} onHide={props.onClose}>
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
                type="text"
                placeholder="An unambiguous, human-readable identifier"
                value={accountId}
                onChange={e => setAccountId(e.target.value)}
              />
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
            <td>Referring member account ID:</td>
            <td>
              <Form.Control
                required
                type="text"
                value={referralMember}
                onChange={e => setReferralMember(e.target.value)}
              />
            </td>
          </tr>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
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
                  referralMember,
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
