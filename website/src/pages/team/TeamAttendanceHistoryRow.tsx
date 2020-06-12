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
  term: string;
}

export default class TeamAttendanceHistoryRow extends React.Component<
  TeamAttendanceHistoryRowProps
> {
  render() {
    const currentTerm = this.props.member.memberTerms[this.props.term];
    const attendanceHistory = currentTerm
      ? currentTerm.teamAttendance.reduce(
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
        )
      : {
          present: 0,
          late: 0,
          excused: 0,
          unexcused: 0,
        };
    const attendanceCount = currentTerm ? currentTerm.teamAttendance.length : 0;

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
                  now={(attendanceHistory.present / attendanceCount) * 100}
                ></ProgressBar>
              )}
              {!!attendanceHistory.late && (
                <ProgressBar
                  variant="warning"
                  label="Late"
                  title={'Arrived late: ' + attendanceHistory.late}
                  now={(attendanceHistory.late / attendanceCount) * 100}
                ></ProgressBar>
              )}
              {!!attendanceHistory.excused && (
                <ProgressBar
                  variant="info"
                  label="Excused"
                  title={'Excused absences: ' + attendanceHistory.excused}
                  now={(attendanceHistory.excused / attendanceCount) * 100}
                ></ProgressBar>
              )}
              {!!attendanceHistory.unexcused && (
                <ProgressBar
                  variant="danger"
                  label="Unexcused"
                  title={'Unexcused absences: ' + attendanceHistory.unexcused}
                  now={(attendanceHistory.unexcused / attendanceCount) * 100}
                ></ProgressBar>
              )}
            </ProgressBar>
          </Col>
        </Row>
      </Container>
    );
  }
}
