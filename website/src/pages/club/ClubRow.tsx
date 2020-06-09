import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Member } from '../../model/Member';
import styles from './ClubRow.module.css';
import { Attendance } from '../../model/Attendance';

interface ClubRowProps {
  member: Member;
}

export default class ClubRow extends React.Component<ClubRowProps> {
  getAttendanceRecord(): Attendance | undefined {
    const now = Date.now();
    const today = new Date().getDate();
    return this.props.member.attendance.find(
      a =>
        now - a.timestamp.getTime() < 24 * 60 * 60 * 1000 &&
        a.timestamp.getDate() === today,
    );
  }

  render() {
    const attendanceRecord = this.getAttendanceRecord();

    return (
      <Container className={'list-group-item ' + styles.row}>
        <Row>
          <Col xs={5}>{this.props.member.name}</Col>
          <Col xs={3}>{this.props.member.accountId}</Col>
          <Col xs={4}>
            <ButtonGroup>
              <Button
                variant="outline-success"
                active={attendanceRecord && attendanceRecord.type === 'present'}
              >
                Present
              </Button>
              <Button
                variant="outline-warning"
                active={attendanceRecord && attendanceRecord.type === 'late'}
              >
                Late
              </Button>
              <Button
                variant="outline-secondary"
                active={attendanceRecord && attendanceRecord.type === 'excused'}
              >
                Excused
              </Button>
              <Button
                variant="outline-danger"
                active={
                  attendanceRecord && attendanceRecord.type === 'unexcused'
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
