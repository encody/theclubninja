import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import { IMember } from '../../model/Member';
import { IModel } from '../../model/Model';
import NewMemberModal from '../../shared/NewMemberModal';
import ClubRow from './ClubRow';

interface ClubProps {
  model: IModel;
}

interface ClubState {
  filter: string;
  memberList: IMember[];
  filteredMembers: IMember[];
  showNewMemberModal: boolean;
}

export default class Club extends React.Component<ClubProps, ClubState> {
  public constructor(props: ClubProps) {
    super(props);

    const members = Object.values(props.model.members);

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
    const currentTerm = this.props.model.terms[
      this.props.model.terms.length - 1
    ];

    return (
      <>
        <Row as="header">
          <h2 className="mb-3">Club Check-In</h2>
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
              <Col xs={4}>Check-In</Col>
            </Row>
          </ListGroup.Item>
          {this.state.filteredMembers.map(member => (
            <ClubRow
              key={member.accountId}
              member={member}
              term={currentTerm.id}
            />
          ))}
        </ListGroup>

        {this.state.filteredMembers.length ? null : (
          <div className="row justify-content-center m-3">
            <p>No members.</p>
          </div>
        )}

        <NewMemberModal
          show={this.state.showNewMemberModal}
          onClose={() => this.closeNewMemberModal()}
        />
      </>
    );
  }
}
