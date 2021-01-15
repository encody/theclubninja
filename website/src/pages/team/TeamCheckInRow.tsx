import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {
  AttendanceEvent,
  AttendanceType,
  IAttendance,
} from '../../model/Attendance';
import { IMember } from '../../model/Member';
import { useServer } from '../../server';

interface TeamCheckInRowProps {
  member: IMember;
}

export default function TeamCheckInRow(props: TeamCheckInRowProps) {
  const server = useServer();

  const getAttendanceRecord: () => IAttendance | undefined = () => {
    const now = Date.now();
    const today = new Date().getDate();
    const memberTerm = props.member.terms[server.term];
    return memberTerm
      ? memberTerm.attendance
          .filter(a => a.event === AttendanceEvent.Team)
          .find(
            a =>
              now - a.timestamp < 24 * 60 * 60 * 1000 && a.timestamp === today,
          )
      : undefined;
  };

  const attendanceRecord = getAttendanceRecord();

  return (
    <Container className={'list-group-item'}>
      <Row>
        <Col xs={4}>{props.member.name}</Col>
        <Col xs={2}>{props.member.accountId}</Col>
        <Col xs={6}>
          <ButtonGroup>
            <Button
              variant="outline-success"
              size="sm"
              active={
                attendanceRecord &&
                attendanceRecord.type === AttendanceType.Present
              }
            >
              Present
            </Button>
            <Button
              variant="outline-warning"
              size="sm"
              active={
                attendanceRecord &&
                attendanceRecord.type === AttendanceType.Late
              }
            >
              Late
            </Button>
            <Button
              variant="outline-info"
              size="sm"
              active={
                attendanceRecord &&
                attendanceRecord.type === AttendanceType.Excused
              }
            >
              Excused
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              active={
                attendanceRecord &&
                attendanceRecord.type === AttendanceType.Unexcused
              }
            >
              Unexcused
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Container>
  );
}
