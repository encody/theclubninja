import React from 'react';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';
import Tooltip from 'react-bootstrap/esm/Tooltip';
import * as Icon from 'react-feather';
import { Link } from 'react-router-dom';
import {
  getUnpaid,
  hasPaidForTerm,
  hasUnpaid,
  IMember,
} from '../../model/Member';
import { IMembership } from '../../model/Membership';
import { useServer } from '../../server';

interface DuesStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  member: IMember;
  membership: IMembership;
}

export default function DuesStatus(props: DuesStatusProps) {
  const server = useServer();
  if (server.profile?.permissions.charges.read) {
    if (
      hasPaidForTerm(
        props.member,
        props.membership.duesId,
        server.model.charges,
        server.term,
      )
    ) {
      // Dues paid
      return (
        <OverlayTrigger
          overlay={
            <Tooltip id={`tooltip-chargespaid-${props.member.id}`}>
              Dues paid.
            </Tooltip>
          }
        >
          <Icon.DollarSign size={18} className="text-success" />
        </OverlayTrigger>
      );
    } else {
      // Dues not paid
      if (
        hasUnpaid(
          props.member,
          props.membership.duesId,
          server.model.charges,
          server.term,
        )
      ) {
        // Has dues that are not paid
        if (server.profile?.permissions.charges.write) {
          // And we can make those unpaid dues become paid
          return (
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
          );
        } else {
          // We cannot make the unpaid dues become paid
          return (
            <OverlayTrigger
              overlay={
                <Tooltip id={`tooltip-chargespaid-${props.member.id}`}>
                  Unpaid dues.
                </Tooltip>
              }
            >
              <Icon.DollarSign size={18} className="text-warning" />
            </OverlayTrigger>
          );
        }
      } else {
        // No dues at all, paid OR unpaid
        return (
          <OverlayTrigger
            overlay={
              <Tooltip id={`tooltip-nocharges-${props.member.id}`}>
                No charges found.
              </Tooltip>
            }
          >
            <Icon.FileMinus size={18} className="text-danger" />
          </OverlayTrigger>
        );
      }
    }
  } else {
    return <></>;
  }
}
