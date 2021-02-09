import { DateTime } from 'luxon';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { useServer } from '../server';
import styles from './NewTermModal.module.css';

interface NewTermModalProps {
  show: boolean;
  onClose: () => void;
}

export default function NewTermModal(props: NewTermModalProps) {
  const server = useServer();

  const [termName, setTermName] = useState('');
  const [startDate, setStartDate] = useState(Date.now());
  const [endDate, setEndDate] = useState(
    DateTime.local().plus({ months: 4 }).toMillis(),
  );

  const reset = () => {
    setTermName('');
  };

  const toTermId = (termName: string) =>
    termName.trim().toLowerCase().replace(/\s+/g, '_');

  return (
    <Modal
      size="lg"
      show={props.show}
      onHide={props.onClose}
      scrollable={false}
      dialogClassName={styles['min-dialog']}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Create Term
          {termName.trim().length > 0 ? ': ' + termName : ''}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row className={styles.row}>
            <Col sm={3}>
              <Form.Label htmlFor="NewTermModal_TermName">
                Term Name:
              </Form.Label>
            </Col>
            <Col>
              <Form.Control
                required
                id="NewTermModal_TermName"
                className={
                  server.model.terms[toTermId(termName)]
                    ? 'is-invalid'
                    : termName.trim().length
                    ? 'is-valid'
                    : ''
                }
                type="text"
                placeholder={'Fall ' + new Date().getFullYear()}
                value={termName}
                onChange={e => setTermName(e.target.value)}
              />
              <div className="invalid-feedback">That term already exists.</div>
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col sm={3}>
              <Form.Label htmlFor="NewTermModal_StartDate">
                Start date:
              </Form.Label>
            </Col>
            <Col>
              <Form.Control
                required
                type="date"
                id="NewTermModal_StartDate"
                value={DateTime.fromMillis(startDate).toISODate()}
                onChange={e =>
                  setStartDate(DateTime.fromISO(e.target.value).toMillis())
                }
              />
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col sm={3}>
              <Form.Label htmlFor="NewTermModal_EndDate">End date:</Form.Label>
            </Col>
            <Col>
              <Form.Control
                required
                type="date"
                className={endDate <= startDate ? 'is-invalid' : ''}
                id="NewTermModal_EndDate"
                value={DateTime.fromMillis(endDate).toISODate()}
                min={DateTime.fromMillis(startDate).toISODate()}
                onChange={e =>
                  setEndDate(DateTime.fromISO(e.target.value).toMillis())
                }
              />
              <div className="invalid-feedback">
                The end date must be after the start date.
              </div>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          disabled={
            termName.trim().length === 0 || // No term name
            !!server.model.terms[toTermId(termName)] || // Account ID already exists
            endDate <= startDate // End date before start date
          }
          onClick={async () => {
            props.onClose();
            if (
              await server.setTerms({
                [toTermId(termName)]: {
                  end: endDate,
                  start: startDate,
                  id: toTermId(termName),
                  name: termName,
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
