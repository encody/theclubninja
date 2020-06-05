import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { members } from '../../dummydata';
import { Member } from '../../model/Member';
import MemberDetails from './MemberDetails';
import MemberRow from './MemberRow';
import NewMemberModal from './NewMemberModal';

export default class Members extends React.Component<
  {},
  { filter: string; filteredMembers: Member[]; showNewMemberModal: boolean }
> {
  constructor(props: {}) {
    super(props);

    this.state = {
      filter: '',
      filteredMembers: members,
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
      filteredMembers: members.filter(
        member =>
          member.name.toLowerCase().includes(filter.toLowerCase()) ||
          member.studentId.toLowerCase().includes(filter.toLowerCase()) ||
          member.x500.toLowerCase().includes(filter.toLowerCase()),
      ),
    });
  }

  render() {
    return (
      <Container>
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
              <Col xs={3}>x500</Col>
              <Col xs={2}>Team Member</Col>
              <Col xs={2}>Status</Col>
            </Row>
          </ListGroup.Item>
          {this.state.filteredMembers.map(member => (
            <MemberRow key={member.x500} member={member} />
          ))}
        </ListGroup>

        {this.state.filteredMembers.length ? null : <EmptyTable />}

        <Route path="/members/:id?">
          <MemberDetailsModalWithRouter />
        </Route>

        <NewMemberModal
          show={this.state.showNewMemberModal}
          onClose={() => this.closeNewMemberModal()}
        />
      </Container>
    );
  }
}

function EmptyTable() {
  return (
    <div className="row justify-content-center m-3">
      <p>No members.</p>
    </div>
  );
}

type MemberDetailsModalProps = RouteComponentProps<{ id: string }>;

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
    const member = members.find(m => m.x500 === this.props.match.params.id);
    return (
      <Modal size="lg" show={!!this.props.match.params.id} onHide={() => this.close()}>
        <MemberDetails member={member} />
      </Modal>
    );
  }
}

const MemberDetailsModalWithRouter = withRouter(MemberDetailsModal);
