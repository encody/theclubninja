import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { IMember } from '../../model/Member';
import styles from './TeamAttendanceHistoryRow.module.css';
import { IAttendance, AttendanceEvent } from '../../model/Attendance';

interface TeamAttendanceHistoryRowProps {
  member: IMember;
  term: string;
}

export default class TeamAttendanceHistoryRow extends React.Component<
  TeamAttendanceHistoryRowProps
> {
  private getAttendanceHistory() {
    const currentTerm = this.props.member.terms[this.props.term];
    const teamAttendance = currentTerm
      ? currentTerm.attendance.filter(a => a.event === AttendanceEvent.Team)
      : [];
    const attendanceHistory = teamAttendance.reduce(
      (acc, record) => {
        acc[record.type]++;
        return acc;
      },
      {
        present: 0,
        late: 0,
        excused: 0,
        unexcused: 0,
        attendanceCount: teamAttendance.length,
      },
    );

    return attendanceHistory;
  }

  render() {
    const attendanceHistory = this.getAttendanceHistory();

    return (
      <Container className={'list-group-item ' + styles.row}>
        <Row>
          <Col xs={4}>{this.props.member.name}</Col>
          <Col xs={2}>{this.props.member.accountId}</Col>
          <Col xs={6}>
            <ProgressBar>
              {!!attendanceHistory.present && (
                <ProgressBar
                  variant="success"
                  label="Present"
                  title={'Present: ' + attendanceHistory.present}
                  now={
                    (attendanceHistory.present /
                      attendanceHistory.attendanceCount) *
                    100
                  }
                ></ProgressBar>
              )}
              {!!attendanceHistory.late && (
                <ProgressBar
                  variant="warning"
                  label="Late"
                  title={'Arrived late: ' + attendanceHistory.late}
                  now={
                    (attendanceHistory.late /
                      attendanceHistory.attendanceCount) *
                    100
                  }
                ></ProgressBar>
              )}
              {!!attendanceHistory.excused && (
                <ProgressBar
                  variant="info"
                  label="Excused"
                  title={'Excused absences: ' + attendanceHistory.excused}
                  now={
                    (attendanceHistory.excused /
                      attendanceHistory.attendanceCount) *
                    100
                  }
                ></ProgressBar>
              )}
              {!!attendanceHistory.unexcused && (
                <ProgressBar
                  variant="danger"
                  label="Unexcused"
                  title={'Unexcused absences: ' + attendanceHistory.unexcused}
                  now={
                    (attendanceHistory.unexcused /
                      attendanceHistory.attendanceCount) *
                    100
                  }
                ></ProgressBar>
              )}
            </ProgressBar>
          </Col>
        </Row>
      </Container>
    );
  }
}
