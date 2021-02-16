import React, { useState } from 'react';
import Alert from 'react-bootstrap/esm/Alert';
import Button from 'react-bootstrap/esm/Button';
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup';
import Dropdown from 'react-bootstrap/esm/Dropdown';
import Form from 'react-bootstrap/esm/Form';
import Modal from 'react-bootstrap/esm/Modal';
import * as Icon from 'react-feather';
import { ICreditType } from '../../model/CreditType';
import { hasPaidForTerm, IMember } from '../../model/Member';
import { IMembership } from '../../model/Membership';
import { useServer } from '../../server';

interface CheckInCreditModalProps {
  member: IMember;
  membership: IMembership;
  show: boolean;
  onClose: () => void;
  onSubmit: (credit: string | null, note: string) => Promise<boolean>;
}

export default function CheckInCreditModal(props: CheckInCreditModalProps) {
  const server = useServer();

  const available = (creditType: ICreditType) =>
    creditType.limit -
    props.member.terms[server.term]!.attendance.filter(
      a => a.credit === creditType.id,
    ).length;

  const creditTypeOrdering = () =>
    Object.values(server.model.creditTypes).sort((a, b) => a.order - b.order);

  const [creditType, setCreditType] = useState(
    creditTypeOrdering().find(t => available(t) !== 0),
  );
  const [useCredit, setUseCredit] = useState(null as boolean | null);
  const [note, setNote] = useState('');

  const reset = () => {
    setCreditType(creditTypeOrdering().find(t => available(t) !== 0));
    setUseCredit(null);
    setNote('');
  };

  return (
    <Modal size="lg" show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Check In: {props.member.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Button
            size="lg"
            className="my-1 mr-2"
            active={useCredit === false}
            onClick={() => setUseCredit(false)}
          >
            Paid Attendance
          </Button>
          <Dropdown as={ButtonGroup} className="my-1">
            <Button
              size="lg"
              variant="success"
              active={useCredit === true}
              onClick={() => setUseCredit(true)}
            >
              {creditType ? creditType.name : 'Select credit...'}
            </Button>

            <Dropdown.Toggle
              split
              variant="success"
              size="lg"
              active={useCredit === true}
              id="dropdown-split-basic"
            />

            <Dropdown.Menu>
              {creditTypeOrdering().map(t => {
                const a = available(t);
                return (
                  <Dropdown.Item
                    key={t.id}
                    active={creditType === t}
                    disabled={a === 0}
                    onClick={() => {
                      setCreditType(t);
                      setUseCredit(true);
                    }}
                  >
                    {t.name} ({a === -1 ? <>&infin;</> : <>{a}</>})
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>

          {useCredit === false &&
            !hasPaidForTerm(
              props.member,
              props.membership.duesId,
              server.model.charges,
              server.term,
            ) && (
              <Alert variant="warning" className="mt-2">
                <Icon.AlertTriangle size={18} /> This member has not yet paid
                their dues for this attendance.
              </Alert>
            )}

          <hr />
          <Form.Group controlId="clubCheckInModal_textarea">
            <Form.Label>
              Notes: <small className="text-muted">(optional)</small>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          disabled={useCredit === null}
          onClick={async () => {
            props.onClose();
            if (
              await props.onSubmit(
                useCredit && creditType ? creditType.id : null,
                note,
              )
            ) {
              reset();
            } else {
              // TODO: Alert failure
            }
          }}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
