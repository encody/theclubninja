import { DateTime } from 'luxon';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import * as uuid from 'uuid';
import { useServer } from '../../server';

interface NewChargeModalProps {
  show: boolean;
  onClose: () => void;
}

export default function NewChargeModal(props: NewChargeModalProps) {
  const server = useServer();

  const chargeTypesOrder = () =>
    Object.values(server.model!.chargeTypes).sort((a, b) => a.order - b.order);

  const [accountId, setAccountId] = useState('');
  const [note, setNote] = useState('');
  const [due, setDue] = useState(
    DateTime.fromISO(
      DateTime.local().plus({ days: 30 }).toISODate(),
    ).toMillis(),
  );
  const [amountCents, setAmountCents] = useState(0);
  const [chargeType, setChargeType] = useState(chargeTypesOrder()[0].id);

  const reset = () => {
    setAccountId('');
    setAmountCents(0);
    setChargeType(chargeTypesOrder()[0].id);
    setNote('');
    setDue(
      DateTime.fromISO(
        DateTime.local().plus({ days: 30 }).toISODate(),
      ).toMillis(),
    );
  };

  return (
    <Modal size="lg" show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>New Charge</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table responsive>
          <tr>
            <td>Account ID:</td>
            <td>
              <Form.Control
                required
                type="text"
                placeholder="Account ID of the account to charge"
                value={accountId}
                onChange={e => setAccountId(e.target.value)}
                // TODO: Autofill ID's
              />
            </td>
          </tr>
          <tr>
            <td>Reason:</td>
            <td>
              <Form.Control
                required
                custom
                as="select"
                onChange={e =>
                  setChargeType(
                    server.model!.chargeTypes[e.target.value]
                      ? e.target.value
                      : chargeTypesOrder()[0].id,
                  )
                }
              >
                {chargeTypesOrder().map(t => (
                  <option
                    key={t.id}
                    value={t.id}
                    selected={chargeType === t.id}
                  >
                    {t.name}
                  </option>
                ))}
              </Form.Control>
            </td>
          </tr>
          <tr>
            <td>Amount:</td>
            <td>
              <Form.Control
                required
                type="number"
                value={amountCents / 100}
                step={0.01}
                max={1500}
                min={0.0}
                onChange={e => setAmountCents(parseFloat(e.target.value) * 100)}
              />
            </td>
          </tr>
          <tr>
            <td>Due date:</td>
            <td>
              <Form.Control
                required
                type="date"
                value={DateTime.fromMillis(due).toISODate()}
                min={DateTime.local().toISODate()}
                onChange={e =>
                  setDue(DateTime.fromISO(e.target.value).toMillis())
                }
              />
            </td>
          </tr>
          <tr>
            <td>
              Notes: <small className="text-muted">(optional)</small>
            </td>
            <td>
              <Form.Control
                as="textarea"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </td>
          </tr>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          disabled={
            !server.model!.members[accountId] ||
            !server.model!.members[accountId].terms[server.term] ||
            amountCents <= 0
          }
          onClick={async () => {
            props.onClose();

            const member = server.model!.members[accountId];
            const term = member.terms[server.term]!;
            term.ledger.push({
              id: uuid.v4(), // TODO: Generate server-side
              accountId: member.accountId,
              term: server.term,
              end: due,
              start: Date.now(),
              note,
              payments: [],
              chargeType,
              value: amountCents,
            });
            if (
              await server.setMembers({
                [member.accountId]: member,
              })
            ) {
              reset();
            } else {
              // TODO: Alert server error
            }
          }}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
