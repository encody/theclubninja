import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { AttendanceEvent, AttendanceType } from '../../model/Attendance';
import { ICreditType } from '../../model/CreditType';
import { IMember } from '../../model/Member';
import { useServer } from '../../server';

interface ClubCheckInModalProps {
  member: IMember;
  show: boolean;
  onClose: () => void;
}

export default function ClubCheckInModal(props: ClubCheckInModalProps) {
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
            className="mx-2"
            active={useCredit === false}
            onClick={() => setUseCredit(false)}
          >
            Paid Lesson
          </Button>
          <Dropdown as={ButtonGroup} className="mx-2">
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
            props.member.terms[server.term]!.attendance.push({
              credit: useCredit && creditType ? creditType.id : null,
              event: AttendanceEvent.Club,
              timestamp: Date.now(),
              type: AttendanceType.Present,
              note,
            });
            if (
              await server.setMembers({
                [props.member.accountId]: props.member,
              })
            ) {
              reset();
              // TODO: Alert success
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
