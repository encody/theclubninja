import { DateTime } from 'luxon';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import * as uuid from 'uuid';
import { IMember, isActiveMember } from '../../model/Member';
import { useServer } from '../../server';
import { CurrencyInput } from '../../shared/CurrencyInput';
import MemberSelector from '../../shared/MemberSelector';
import { bound } from '../../shared/util';
import Container from 'react-bootstrap/esm/Container';
import styles from './NewChargeModal.module.css';
import FormLabel from 'react-bootstrap/esm/FormLabel';

interface NewChargeModalProps {
  show: boolean;
  onClose: () => void;
}

export default function NewChargeModal(props: NewChargeModalProps) {
  const server = useServer();

  const chargeTypesOrder = () =>
    Object.values(server.model.chargeTypes).sort((a, b) => a.order - b.order);

  const [member, setMember] = useState(null as IMember | null);
  const [note, setNote] = useState('');
  const [due, setDue] = useState(
    DateTime.fromISO(
      DateTime.local().plus({ days: 30 }).toISODate(),
    ).toMillis(),
  );
  const [amount, setAmount] = useState(0);
  const [chargeType, setChargeType] = useState(chargeTypesOrder()[0]?.id || '');

  const reset = () => {
    setAmount(0);
    setChargeType(chargeTypesOrder()[0]?.id || '');
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
        <Container>
          <Row className={styles.row}>
            <Col sm={3}>
              <Form.Label htmlFor="NewChargeModal_MemberSelector">
                Account ID:
              </Form.Label>
            </Col>
            <Col>
              <MemberSelector
                id="NewChargeModal_MemberSelector"
                member={member}
                filter={m => isActiveMember(m, server.term)}
                onSelect={m => setMember(m)}
              />
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col sm={3}>
              <Form.Label htmlFor="NewChargeModal_ChargeType">
                Reason:
              </Form.Label>
            </Col>
            <Col>
              <Form.Control
                required
                custom
                id="NewChargeModal_ChargeType"
                as="select"
                onChange={e =>
                  setChargeType(
                    server.model.chargeTypes[e.target.value]
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
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col sm={3}>
              <Form.Label htmlFor="NewChargeModal_Amount">Amount:</Form.Label>
            </Col>
            <Col>
              <CurrencyInput
                required
                id="NewChargeModal_Amount"
                className="form-control"
                onValueChange={v => setAmount(bound(0, v, 150000))}
                value={amount}
              />
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col sm={3}>
              <Form.Label htmlFor="NewChargeModal_DueDate">
                Due date:
              </Form.Label>
            </Col>
            <Col>
              <Form.Control
                required
                type="date"
                id="NewChargeModal_DueDate"
                value={DateTime.fromMillis(due).toISODate()}
                min={DateTime.local().toISODate()}
                onChange={e =>
                  setDue(DateTime.fromISO(e.target.value).toMillis())
                }
              />
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col sm={3}>
              <Form.Label htmlFor="NewChargeModal_Notes">
                Notes: <small className="text-muted">(optional)</small>
              </Form.Label>
            </Col>
            <Col>
              <Form.Control
                as="textarea"
                id="NewChargeModal_Notes"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          disabled={!member || !member.terms[server.term] || amount < 0}
          onClick={async () => {
            props.onClose();

            const term = member!.terms[server.term]!;
            term.ledger.push({
              id: uuid.v4(), // TODO: Generate server-side
              accountId: member!.accountId,
              term: server.term,
              end: due,
              start: Date.now(),
              note,
              payments: [],
              chargeType,
              value: amount,
            });
            if (
              await server.setMembers({
                [member!.accountId]: member!,
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
