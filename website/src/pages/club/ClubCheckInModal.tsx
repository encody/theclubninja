import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import { IMember } from '../../model/Member';
import { useServer } from '../../server';
import { AttendanceEvent, AttendanceType } from '../../model/Attendance';

interface ClubCheckInModalProps {
  member: IMember;
  show: boolean;
  onClose: () => void;
}

export default function ClubCheckInModal(props: ClubCheckInModalProps) {
  const server = useServer();

  const creditTypeOrdering = () =>
    Object.values(server.model!.creditTypes).sort((a, b) => a.order - b.order);

  const [creditType, setCreditType] = useState(creditTypeOrdering()[0].id);
  const [useCredit, setUseCredit] = useState(null as boolean | null);
  const [note, setNote] = useState('');

  const reset = () => {
    setCreditType(creditTypeOrdering()[0].id);
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
              {server.model!.creditTypes[creditType].name}
            </Button>

            <Dropdown.Toggle
              split
              variant="success"
              size="lg"
              active={useCredit === true}
              id="dropdown-split-basic"
            />

            <Dropdown.Menu>
              {creditTypeOrdering().map(t => (
                <Dropdown.Item
                  key={t.id}
                  active={creditType === t.id}
                  onClick={() => {
                    setCreditType(t.id);
                    setUseCredit(true);
                  }}
                >
                  {t.name}
                </Dropdown.Item>
              ))}
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
              credit: useCredit ? creditType : null,
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
