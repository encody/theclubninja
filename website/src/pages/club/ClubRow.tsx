import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { AttendanceEvent, IAttendance } from '../../model/Attendance';
import { LedgerEntryReason } from '../../model/LedgerEntry';
import { hasPaidForTerm, IMember } from '../../model/Member';
import { useServer } from '../../server';
import styles from './ClubRow.module.css';

interface ClubRowProps {
  member: IMember;
}

export default function ClubRow(props: ClubRowProps) {
  const server = useServer();

  const getAttendanceRecord: () => IAttendance | undefined = () => {
    const now = Date.now();
    const today = new Date().getDate();
    const memberTerm = props.member.terms[server.term];
    return memberTerm
      ? memberTerm.attendance
          .filter(a => a.event === AttendanceEvent.Club)
          .find(
            a =>
              now - a.timestamp < 24 * 60 * 60 * 1000 &&
              new Date(a.timestamp).getDate() === today,
          )
      : undefined;
  };

  const attendanceRecord = getAttendanceRecord();

  return (
    <Container className={'list-group-item ' + styles.row}>
      <Row>
        <Col xs={5}>{props.member.name}</Col>
        <Col xs={3}>{props.member.accountId}</Col>
        <Col xs={4}>
          {hasPaidForTerm(
            props.member,
            server.term,
            LedgerEntryReason.ClubDues,
          ) ? (
            <Button className="mr-2" size="sm" variant="primary" disabled>
              Paid
            </Button>
          ) : (
            <Button className="mr-2" size="sm" variant="primary">
              Pay Now
            </Button>
          )}
          {attendanceRecord ? (
            <Button variant="success" size="sm" disabled>
              Checked in
            </Button>
          ) : (
            <Button variant="success" size="sm">
              Check In
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
}
