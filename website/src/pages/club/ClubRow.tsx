import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Badge from 'react-bootstrap/esm/Badge';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';
import Tooltip from 'react-bootstrap/esm/Tooltip';
import Row from 'react-bootstrap/Row';
import * as Icon from 'react-feather';
import { Link } from 'react-router-dom';
import {
  AttendanceEvent,
  IAttendance,
  AttendanceType,
} from '../../model/Attendance';
import {
  getUnpaid,
  hasPaidForTerm,
  hasUnpaid,
  IMember,
} from '../../model/Member';
import { useServer } from '../../server';
import ClubCheckInModal from './ClubCheckInModal';
import styles from './ClubRow.module.css';

interface ClubRowProps {
  member: IMember;
}

export default function ClubRow(props: ClubRowProps) {
  const server = useServer();

  const [showCheckInModal, setShowCheckInModal] = useState(false);

  const getAttendanceRecord: () => IAttendance | undefined = () => {
    const now = Date.now();
    const today = new Date().getDate();
    const memberTerm = props.member.terms[server.term];
    return memberTerm
      ? memberTerm.attendance
          .filter(
            a =>
              a.event === AttendanceEvent.Club &&
              a.type === AttendanceType.Present,
          )
          .find(
            a =>
              now - a.timestamp < 24 * 60 * 60 * 1000 &&
              new Date(a.timestamp).getDate() === today,
          )
      : undefined;
  };

  const attendanceRecord = getAttendanceRecord();

  return (
    <>
      <Container className={'list-group-item ' + styles.row}>
        <Row>
          <Col xs={5}>{props.member.name}</Col>
          <Col xs={3}>{props.member.accountId}</Col>
          <Col xs={4}>
            {attendanceRecord ? (
              <Button variant="success" size="sm" disabled>
                <Icon.UserCheck size={18} className="mr-1" /> Check In
              </Button>
            ) : (
              <Button
                variant="success"
                size="sm"
                onClick={async () => {
                  setShowCheckInModal(true);
                }}
              >
                <Icon.User size={18} className="mr-1" /> Check In
              </Button>
            )}{' '}
            {hasPaidForTerm(
              props.member,
              server.term,
              'club_dues', // TODO: Read from DB
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
            ) : hasUnpaid(props.member, 'club_dues', server.term) ? (
              <>
                <Link
                  className="btn btn-primary btn-sm"
                  to={
                    '/payments/' +
                    props.member.accountId +
                    '/' +
                    getUnpaid(props.member, 'club_dues', server.term)[0].id
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
      </Container>
      <ClubCheckInModal
        member={props.member}
        show={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
      />
    </>
  );
}
