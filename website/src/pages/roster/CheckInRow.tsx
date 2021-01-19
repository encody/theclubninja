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
import CheckInCreditModal from './CheckInCreditModal';

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
    if (attendanceRecord) {
      attendanceRecord.credit = credit;
      attendanceRecord.note = note;
      attendanceRecord.timestamp = Date.now();
      attendanceRecord.type = pendingAttendanceType;
    } else {
      props.member.terms[server.term]!.attendance.push({
        credit,
        event: props.membership.id,
        timestamp: Date.now(),
        type: pendingAttendanceType,
        note,
      });
    }
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
                variant="outline-success"
                active={
                  attendanceRecord &&
                  attendanceRecord.type === AttendanceType.Present
                }
                size="sm"
                onClick={() => registerAttendance(AttendanceType.Present)}
              >
                Present
              </Button>
              <Button
                variant="outline-warning"
                active={
                  attendanceRecord &&
                  attendanceRecord.type === AttendanceType.Late
                }
                size="sm"
                onClick={() => registerAttendance(AttendanceType.Late)}
              >
                Late
              </Button>
              <Button
                variant="outline-info"
                active={
                  attendanceRecord &&
                  attendanceRecord.type === AttendanceType.Excused
                }
                size="sm"
                onClick={() => registerAttendance(AttendanceType.Excused)}
              >
                Excused
              </Button>
              <Button
                variant="outline-danger"
                active={
                  attendanceRecord &&
                  attendanceRecord.type === AttendanceType.Unexcused
                }
                size="sm"
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
          {server.profile?.permissions.ledger.read &&
            (hasPaidForTerm(
              props.member,
              props.membership.duesId,
              server.model.charges,
              server.term,
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
            ) : hasUnpaid(
                props.member,
                props.membership.duesId,
                server.model.charges,
                server.term,
              ) ? (
              server.profile?.permissions.ledger.write ? (
                <Link
                  className="btn btn-primary btn-sm"
                  to={
                    '/payments/' +
                    getUnpaid(
                      props.member,
                      props.membership.duesId,
                      server.model.charges,
                      server.term,
                    )[0].id
                  }
                >
                  Pay Now
                </Link>
              ) : (
                <OverlayTrigger
                  overlay={
                    <Tooltip
                      id={`tooltip-chargespaid-${props.member.accountId}`}
                    >
                      Unpaid dues.
                    </Tooltip>
                  }
                >
                  <Icon.DollarSign size={18} className="text-warning" />
                </OverlayTrigger>
              )
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
            ))}
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