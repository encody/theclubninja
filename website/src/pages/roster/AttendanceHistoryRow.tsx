import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import { IMember } from '../../model/Member';
import { IMembership } from '../../model/Membership';
import { useServer } from '../../server';

interface AttendanceHistoryRowProps {
  member: IMember;
  membership: IMembership;
}

export default function AttendanceHistoryRow(props: AttendanceHistoryRowProps) {
  const server = useServer();

  const getAttendanceHistory = () => {
    const currentTerm = props.member.terms[server.term];
    const teamAttendance = currentTerm
      ? currentTerm.attendance.filter(a => a.event === props.membership.id)
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
        <Col xs={3}>{props.member.accountId}</Col>
        <Col xs={5}>
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
