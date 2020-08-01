import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { IMember, isActiveMember } from '../../model/Member';
import { IModel } from '../../model/Model';
import NewMemberModal from '../../shared/NewMemberModal';
import MemberDetails from './MemberDetails';
import MemberRow from './MemberRow';

interface MembersProps {
  model: IModel;
  termId: string;
}

interface MembersState {
  filter: string;
  memberList: IMember[];
  filteredMembers: IMember[];
  showNewMemberModal: boolean;
}

export default class Members extends React.Component<
  MembersProps,
  MembersState
> {
  constructor(props: MembersProps) {
    super(props);

    const members = Object.values(this.props.model.members).filter(m =>
      isActiveMember(m, this.props.termId),
    );

    this.state = {
      filter: '',
      memberList: members,
      filteredMembers: members.slice(),
      showNewMemberModal: false,
    };
  }

  openNewMemberModal() {
    this.setState({
      showNewMemberModal: true,
    });
  }

  closeNewMemberModal() {
    this.setState({
      showNewMemberModal: false,
    });
  }

  updateFilter(filter: string) {
    this.setState({
      filter,
      filteredMembers: this.state.memberList.filter(
        member =>
          member.name.toLowerCase().includes(filter.toLowerCase()) ||
          member.studentId.toLowerCase().includes(filter.toLowerCase()) ||
          member.accountId.toLowerCase().includes(filter.toLowerCase()),
      ),
    });
  }

  render() {
    return (
      <>
        <Row as="header">
          <h2 className="mb-3">Members</h2>
        </Row>

        <div className="d-flex mb-3">
          <div className="flex-grow-1">
            <Form.Control
              type="search"
              placeholder="Search&hellip;"
              value={this.state.filter}
              onChange={e => this.updateFilter(e.target.value)}
            />
          </div>
          <div className="ml-3 flex-shrink-1">
            <Button onClick={() => this.openNewMemberModal()}>
              New Member
            </Button>
          </div>
        </div>

        <ListGroup>
          <ListGroup.Item className="border-top-0 border-left-0 border-right-0">
            <Row className="font-weight-bold">
              <Col xs={5}>Name</Col>
              <Col xs={3}>Account ID</Col>
              <Col xs={2}>Team Member</Col>
              <Col xs={2}>Status</Col>
            </Row>
          </ListGroup.Item>
          {this.state.filteredMembers.map(member => (
            <MemberRow
              key={member.accountId}
              member={member}
              termId={this.props.termId}
            />
          ))}
        </ListGroup>

        {this.state.filteredMembers.length ? null : (
          <div className="row justify-content-center m-3">
            <p>No members.</p>
          </div>
        )}

        <Route path="/members/:id?">
          <MemberDetailsModalWithRouter members={this.state.memberList} />
        </Route>

        <NewMemberModal
          show={this.state.showNewMemberModal}
          onClose={() => this.closeNewMemberModal()}
        />
      </>
    );
  }
}

type MemberDetailsModalProps = RouteComponentProps<{ id: string }> & {
  members: IMember[];
};

class MemberDetailsModal extends React.Component<
  MemberDetailsModalProps,
  { show: boolean }
> {
  constructor(props: MemberDetailsModalProps) {
    super(props);
  }

  close() {
    this.props.history.push('/members');
  }

  render() {
    const member = this.props.members.find(
      m => m.accountId === this.props.match.params.id,
    );
    return (
      <Modal
        size="lg"
        show={!!this.props.match.params.id}
        onHide={() => this.close()}
      >
        <MemberDetails member={member} />
      </Modal>
    );
  }
}

const MemberDetailsModalWithRouter = withRouter(MemberDetailsModal);
