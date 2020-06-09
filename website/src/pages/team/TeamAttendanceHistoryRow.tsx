import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Member } from '../../model/Member';
import styles from './TeamAttendanceHistoryRow.module.css';
import { Attendance } from '../../model/Attendance';

interface TeamAttendanceHistoryRowProps {
  member: Member;
}

export default class TeamAttendanceHistoryRow extends React.Component<
  TeamAttendanceHistoryRowProps
> {
  render() {
    const attendanceHistory = this.props.member.attendance.reduce(
      (acc, record) => {
        acc[record.type]++;
        return acc;
      },
      {
        present: 0,
        late: 0,
        excused: 0,
        unexcused: 0,
      },
    );
    const attendances = this.props.member.attendance.length;

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
                  now={(attendanceHistory.present / attendances) * 100}
                ></ProgressBar>
              )}
              {!!attendanceHistory.late && (
                <ProgressBar
                  variant="warning"
                  label="Late"
                  title={'Arrived late: ' + attendanceHistory.late}
                  now={(attendanceHistory.late / attendances) * 100}
                ></ProgressBar>
              )}
              {!!attendanceHistory.excused && (
                <ProgressBar
                  variant="info"
                  label="Excused"
                  title={'Excused absences: ' + attendanceHistory.excused}
                  now={(attendanceHistory.excused / attendances) * 100}
                ></ProgressBar>
              )}
              {!!attendanceHistory.unexcused && (
                <ProgressBar
                  variant="danger"
                  label="Unexcused"
                  title={'Unexcused absences: ' + attendanceHistory.unexcused}
                  now={(attendanceHistory.unexcused / attendances) * 100}
                ></ProgressBar>
              )}
            </ProgressBar>
          </Col>
        </Row>
      </Container>
    );
  }
}
