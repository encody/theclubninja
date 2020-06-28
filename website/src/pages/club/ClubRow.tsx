import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Member } from '../../model/Member';
import styles from './ClubRow.module.css';
import { IAttendance, AttendanceEvent } from '../../model/Attendance';
import FormGroup from 'react-bootstrap/FormGroup';
import { IMemberTerm } from '../../model/MemberTerm';

interface ClubRowProps {
  member: Member;
  term: string;
}

export default class ClubRow extends React.Component<ClubRowProps> {
  getAttendanceRecord(): IAttendance | undefined {
    const now = Date.now();
    const today = new Date().getDate();
    const memberTerm = this.props.member.data.terms[this.props.term];
    return memberTerm
      ? memberTerm.attendance
          .filter(a => a.event === AttendanceEvent.Club)
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
          <Col xs={5}>{this.props.member.data.name}</Col>
          <Col xs={3}>{this.props.member.data.accountId}</Col>
          <Col xs={4}>
            {attendanceRecord ? (
              <Button variant="success" disabled>
                Already checked in
              </Button>
            ) : (
              <>
                <Button className="mr-2" variant="primary">
                  Pay Now
                </Button>
                <Button variant="success">Check In</Button>
              </>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}
