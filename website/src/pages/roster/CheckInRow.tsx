import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';
import Tooltip from 'react-bootstrap/esm/Tooltip';
import Row from 'react-bootstrap/Row';
import * as Icon from 'react-feather';
import { Link } from 'react-router-dom';
import { AttendanceType, IAttendance } from '../../model/Attendance';
import {
  getUnpaid,
  hasPaidForTerm,
  hasUnpaid,
  IMember,
} from '../../model/Member';
import { IMembership } from '../../model/Membership';
import { useServer } from '../../server';
import CheckInCreditModal from './CheckInModal';

interface TeamCheckInRowProps {
  member: IMember;
  membership: IMembership;
}

export default function TeamCheckInRow(props: TeamCheckInRowProps) {
  const server = useServer();

  const [showCheckInCreditModal, setShowCheckInCreditModal] = useState(false);
  let pendingAttendanceType = AttendanceType.Present;

  const registerAttendance = (attendanceType: AttendanceType) => {
    pendingAttendanceType = attendanceType;
    if (props.membership.canUseCredit) {
      setShowCheckInCreditModal(true);
    } else {
      sendAttendanceToServer(null, '');
    }
  };

  const sendAttendanceToServer = async (
    credit: string | null,
    note: string,
  ) => {
    props.member.terms[server.term]!.attendance.push({
      credit,
      event: props.membership.id,
      timestamp: Date.now(),
      type: pendingAttendanceType,
      note,
    });
    if (
      await server.setMembers({
        [props.member.accountId]: props.member,
      })
    ) {
      return true;
    } else {
      // TODO: Alert failure
      return false;
    }
  };

  const getAttendanceRecord: () => IAttendance | undefined = () => {
    const now = Date.now();
    const today = new Date().getDate();
    const memberTerm = props.member.terms[server.term];
    return memberTerm
      ? memberTerm.attendance
          .filter(a => a.event === props.membership.id)
          .find(
            a =>
              now - a.timestamp < 24 * 60 * 60 * 1000 &&
              new Date(a.timestamp).getDate() === today,
          )
      : undefined;
  };

  const attendanceRecord = getAttendanceRecord();

  return (
    <Container className={'list-group-item'}>
      <Row>
        <Col xs={4}>{props.member.name}</Col>
        <Col xs={3}>{props.member.accountId}</Col>
        <Col xs={5}>
          {/* Check-in buttons */}
          {props.membership.useDetailedAttendance ? (
            <ButtonGroup>
              <Button
                variant={
                  attendanceRecord &&
                  attendanceRecord.type === AttendanceType.Present
                    ? 'success'
                    : 'outline-success'
                }
                size="sm"
                disabled={!!attendanceRecord}
                onClick={() => registerAttendance(AttendanceType.Present)}
              >
                Present
              </Button>
              <Button
                variant={
                  attendanceRecord &&
                  attendanceRecord.type === AttendanceType.Late
                    ? 'warning'
                    : 'outline-warning'
                }
                size="sm"
                disabled={!!attendanceRecord}
                onClick={() => registerAttendance(AttendanceType.Late)}
              >
                Late
              </Button>
              <Button
                variant={
                  attendanceRecord &&
                  attendanceRecord.type === AttendanceType.Excused
                    ? 'info'
                    : 'outline-info'
                }
                size="sm"
                disabled={!!attendanceRecord}
                onClick={() => registerAttendance(AttendanceType.Excused)}
              >
                Excused
              </Button>
              <Button
                variant={
                  attendanceRecord &&
                  attendanceRecord.type === AttendanceType.Unexcused
                    ? 'danger'
                    : 'outline-danger'
                }
                size="sm"
                disabled={!!attendanceRecord}
                onClick={() => registerAttendance(AttendanceType.Unexcused)}
              >
                Unexcused
              </Button>
            </ButtonGroup>
          ) : attendanceRecord ? (
            <Button variant="success" size="sm" disabled>
              <Icon.UserCheck size={18} className="mr-1" /> Check In
            </Button>
          ) : (
            <>
              <Button
                variant="success"
                size="sm"
                onClick={() => registerAttendance(AttendanceType.Present)}
              >
                <Icon.User size={18} className="mr-1" /> Check In
              </Button>
            </>
          )}{' '}
          {/* Dues status indicators */}
          {hasPaidForTerm(
            props.member,
            server.term,
            props.membership.duesId,
          ) ? (
            <OverlayTrigger
              overlay={
                <Tooltip id={`tooltip-chargespaid-${props.member.accountId}`}>
                  Dues paid.
                </Tooltip>
              }
            >
              <Icon.DollarSign size={18} className="text-success" />
            </OverlayTrigger>
          ) : hasUnpaid(props.member, props.membership.duesId, server.term) ? (
            <>
              <Link
                className="btn btn-primary btn-sm"
                to={
                  '/payments/' +
                  props.member.accountId +
                  '/' +
                  getUnpaid(
                    props.member,
                    props.membership.duesId,
                    server.term,
                  )[0].id
                }
              >
                Pay Now
              </Link>
            </>
          ) : (
            <OverlayTrigger
              overlay={
                <Tooltip id={`tooltip-nocharges-${props.member.accountId}`}>
                  No charges found.
                </Tooltip>
              }
            >
              <Icon.FileMinus size={18} className="text-danger" />
            </OverlayTrigger>
          )}
        </Col>
      </Row>

      {/* Check-in modal */}

      <CheckInCreditModal
        member={props.member}
        show={showCheckInCreditModal}
        onClose={() => setShowCheckInCreditModal(false)}
        onSubmit={sendAttendanceToServer}
      />
    </Container>
  );
}
