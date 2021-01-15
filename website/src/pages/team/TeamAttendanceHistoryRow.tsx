import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import { AttendanceEvent } from '../../model/Attendance';
import { IMember } from '../../model/Member';
import { useServer } from '../../server';

interface TeamAttendanceHistoryRowProps {
  member: IMember;
}

export default function TeamAttendanceHistoryRow(
  props: TeamAttendanceHistoryRowProps,
) {
  const server = useServer();

  const getAttendanceHistory = () => {
    const currentTerm = props.member.terms[server.term];
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
  };

  const attendanceHistory = getAttendanceHistory();

  return (
    <Container className={'list-group-item'}>
      <Row>
        <Col xs={4}>{props.member.name}</Col>
        <Col xs={2}>{props.member.accountId}</Col>
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
                  (attendanceHistory.late / attendanceHistory.attendanceCount) *
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
