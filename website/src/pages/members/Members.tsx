import * as Icon from 'react-feather';
import React, { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Col from 'react-bootstrap/esm/Col';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';
import Form from 'react-bootstrap/esm/Form';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import Modal from 'react-bootstrap/esm/Modal';
import Row from 'react-bootstrap/esm/Row';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { IMember, isActiveMember } from '../../model/Member';
import { useServer } from '../../server';
import AddMemberModal from '../../shared/AddMemberModal';
import NewMemberModal from '../../shared/NewMemberModal';
import MemberDetails from './MemberDetails';
import MemberRow from './MemberRow';
import Tooltip from 'react-bootstrap/esm/Tooltip';
import { DateTime } from 'luxon';
import { writeToString } from '@fast-csv/format';

export default function Members() {
  const server = useServer();

  const getFilteredMembers = () =>
    Object.values(server.model.members).filter(
      member =>
        isActiveMember(member, server.term) &&
        (member.name.toLowerCase().includes(filter.toLowerCase()) ||
          member.institutionId.toLowerCase().includes(filter.toLowerCase()) ||
          member.id.toLowerCase().includes(filter.toLowerCase())),
    );

  const [filter, setFilter] = useState('');
  let filteredMembers = getFilteredMembers();
  const [showNewMemberModal, setShowNewMemberModal] = useState(false);
  const [showInactiveMemberModal, setShowInactiveMemberModal] = useState(false);

  const updateFilter = (filter: string) => {
    setFilter(filter);
    filteredMembers = getFilteredMembers();
  };

  const runExport = async () => {
    const a = document.createElement('a');
    const items = Object.values(server.model.members)
      .filter(m => isActiveMember(m, server.term))
      .map(member => [
        member.id,
        member.institutionId,
        member.name,
        member.email,
        member.memberType,
        member.graduationYear,
        member.referralMember,
        member.source,
      ]);

    const headers = [
      'Member ID',
      'Member Institution ID',
      'Member Name',
      'Member Email',
      'Member Type',
      'Member Graduation Year',
      'Member Referral Member ID',
      'Member Source',
    ];

    const csvText = await writeToString(items, {
      headers,
    });

    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvText);
    const fname =
      'members-' + server.term + '-' + DateTime.local().toISODate() + '.csv';

    a.download = fname;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <Row as="header">
        <h2 className="mb-3">Members</h2>

        <OverlayTrigger
          placement="left"
          overlay={<Tooltip id="payments-export-tooltip">Export</Tooltip>}
        >
          <Button
            className="ml-auto"
            variant="link"
            size="sm"
            onClick={() => runExport()}
          >
            <Icon.Download />
          </Button>
        </OverlayTrigger>
      </Row>

      <Row className="flex-wrap-reverse">
        <Col>
          <Form.Control
            type="search"
            placeholder="Search&hellip;"
            value={filter}
            onChange={e => updateFilter(e.target.value)}
          />
        </Col>
        <Col md="auto" className="text-right mb-3">
          <Button
            onClick={() => setShowNewMemberModal(true)}
            variant="success"
            className="mr-3"
          >
            New Member
          </Button>
          <Button onClick={() => setShowInactiveMemberModal(true)}>
            Inactive Members
          </Button>
        </Col>
      </Row>

      <ListGroup>
        <ListGroup.Item className="border-top-0 border-left-0 border-right-0">
          <Row className="font-weight-bold">
            <Col xs={5}>Name</Col>
            <Col xs={2}>Account ID</Col>
            <Col xs={3}>Memberships</Col>
            <Col xs={2}>Type</Col>
          </Row>
        </ListGroup.Item>
        {filteredMembers.map(member => (
          <MemberRow key={member.id} member={member} />
        ))}
      </ListGroup>

      {filteredMembers.length ? null : (
        <div className="row justify-content-center m-3">
          <p>No members.</p>
        </div>
      )}

      <Route path="/members/:id?">
        <MemberDetailsModalWithRouter />
      </Route>

      <NewMemberModal
        show={showNewMemberModal}
        onClose={() => setShowNewMemberModal(false)}
      />
      <AddMemberModal
        show={showInactiveMemberModal}
        onClose={() => setShowInactiveMemberModal(false)}
        title={
          'Add Inactive Members to Term ' +
          server.model.terms[server.term]?.name
        }
        members={Object.values(server.model.members).filter(
          m => !isActiveMember(m, server.term),
        )}
        onSelect={async members => {
          const update: {
            [id: string]: IMember;
          } = {};

          members.forEach(m => {
            m.terms[server.term] = {
              attendance: [],
              ledger: [],
              memberships: [],
            };
            update[m.id] = m;
          });

          if (await server.setMembers(update)) {
            return true;
          } else {
            // TODO: Popup error
            return false;
          }
        }}
      />
    </>
  );
}

type MemberDetailsModalProps = RouteComponentProps<{ id: string }>;

function MemberDetailsModal(props: MemberDetailsModalProps) {
  const server = useServer();

  const close = () => {
    props.history.push('/members');
  };

  const member = Object.values(server.model.members).find(
    m => m.id === props.match.params.id,
  );
  return (
    <Modal size="lg" show={!!props.match.params.id} onHide={() => close()}>
      <MemberDetails member={member} />
    </Modal>
  );
}

const MemberDetailsModalWithRouter = withRouter(MemberDetailsModal);
