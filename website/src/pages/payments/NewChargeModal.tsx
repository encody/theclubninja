import { DateTime } from 'luxon';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import * as uuid from 'uuid';
import { ICharge } from '../../model/Charge';
import { IMember, isActiveMember } from '../../model/Member';
import { useServer } from '../../server';
import { CurrencyInput } from '../../shared/CurrencyInput';
import MemberSelector from '../../shared/MemberSelector';
import { bound, orderable } from '../../shared/util';
import styles from './NewChargeModal.module.css';

interface NewChargeModalProps {
  show: boolean;
  onClose: () => void;
}

export default function NewChargeModal(props: NewChargeModalProps) {
  const server = useServer();

  const chargeTypesOrder = () =>
    Object.values(server.model.chargeTypes).sort(orderable);

  const [member, setMember] = useState(null as IMember | null);
  const [note, setNote] = useState('');
  const [due, setDue] = useState(
    DateTime.fromISO(
      DateTime.local().plus({ days: 30 }).toISODate(),
    ).toMillis(),
  );
  const [amount, setAmount] = useState(chargeTypesOrder()[0]!.defaultValue);
  const [chargeType, setChargeType] = useState(chargeTypesOrder()[0]!.id);

  const reset = () => {
    setAmount(chargeTypesOrder()[0]!.defaultValue);
    setChargeType(chargeTypesOrder()[0]!.id);
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
                onChange={e => {
                  const type = server.model.chargeTypes[e.target.value]
                    ? e.target.value
                    : chargeTypesOrder()[0].id;
                  setChargeType(type);
                  setAmount(server.model.chargeTypes[type].defaultValue);
                }}
                value={chargeType}
              >
                {chargeTypesOrder().map(t => (
                  <option key={t.id} value={t.id}>
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
          disabled={
            !member ||
            !member.terms[server.term] ||
            (amount !== undefined && amount < 0)
          }
          onClick={async () => {
            props.onClose();

            const newCharge: ICharge = {
              id: uuid.v4(), // TODO: Generate server-side
              memberId: member!.id,
              term: server.term,
              end: due,
              start: Date.now(), // TODO: Also generate server-side
              note,
              payments: [],
              chargeType: chargeType,
              value: amount,
            };
            server.model.members[member!.id].terms[
              server.term
            ]!.ledger.push(newCharge.id);
            if (
              await Promise.all([
                server.setCharges(
                  {
                    [newCharge.id]: newCharge,
                  },
                  true,
                ),
                server.setMembers(
                  {
                    [member!.id]:
                      server.model.members[member!.id],
                  },
                  true,
                ),
              ])
            ) {
              await server.updateModel();
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
