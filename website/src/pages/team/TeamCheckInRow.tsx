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
import styles from './TeamCheckInRow.module.css';

interface TeamCheckInRowProps {
  member: IMember;
  termId: string;
}

export default class TeamCheckInRow extends React.Component<
  TeamCheckInRowProps
> {
  getAttendanceRecord(): IAttendance | undefined {
    const now = Date.now();
    const today = new Date().getDate();
    const memberTerm = this.props.member.terms[this.props.termId];
    return memberTerm
      ? memberTerm.attendance
          .filter(a => a.event === AttendanceEvent.Team)
          .find(
            a =>
              now - a.timestamp.toDate().getTime() < 24 * 60 * 60 * 1000 &&
              a.timestamp.toDate().getDate() === today,
          )
      : undefined;
  }

  render() {
    const attendanceRecord = this.getAttendanceRecord();

    return (
      <Container className={'list-group-item ' + styles.row}>
        <Row>
          <Col xs={4}>{this.props.member.name}</Col>
          <Col xs={2}>{this.props.member.accountId}</Col>
          <Col xs={6}>
            <ButtonGroup>
              <Button
                variant="outline-success"
                active={
                  attendanceRecord &&
                  attendanceRecord.type === AttendanceType.Present
                }
              >
                Present
              </Button>
              <Button
                variant="outline-warning"
                active={
                  attendanceRecord &&
                  attendanceRecord.type === AttendanceType.Late
                }
              >
                Late
              </Button>
              <Button
                variant="outline-info"
                active={
                  attendanceRecord &&
                  attendanceRecord.type === AttendanceType.Excused
                }
              >
                Excused
              </Button>
              <Button
                variant="outline-danger"
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
}
