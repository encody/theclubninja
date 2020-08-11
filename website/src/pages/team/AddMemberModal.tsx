import moment from 'moment';
import * as Icon from 'react-feather';
import React from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { IMember, isActiveMember, hasMembership } from '../../model/Member';
import { MemberType, memberTypes } from '../../model/MemberType';
import { IModel } from '../../model/Model';
import { Membership } from '../../model/MemberTerm';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface AddMemberModalProps {
  show: boolean;
  onClose: () => void;
  model: IModel;
  termId: string;
}

interface AddMemberModalState {
  filter: string;
  memberList: IMember[];
  filteredMembers: IMember[];
  selectedMembers: {
    [memberId: string]: boolean | undefined;
  };
}

export default class AddMemberModal extends React.Component<
  AddMemberModalProps,
  AddMemberModalState
> {
  constructor(props: AddMemberModalProps) {
    super(props);

    const members = Object.values(this.props.model.members).filter(
      m =>
        isActiveMember(m, this.props.termId) &&
        !hasMembership(m, Membership.Team, this.props.termId),
    );

    this.state = {
      filter: '',
      memberList: members,
      filteredMembers: members,
      selectedMembers: {},
    };
  }

  updateFilter(filter: string) {
    const lcFilter = filter.toLowerCase();

    this.setState({
      filter,
      filteredMembers: this.state.memberList.filter(
        member =>
          member.name.toLowerCase().includes(lcFilter) ||
          member.studentId.toLowerCase().includes(lcFilter) ||
          member.accountId.toLowerCase().includes(lcFilter),
      ),
    });
  }

  toggleSelected(memberId: string) {
    this.setState({
      selectedMembers: Object.assign(this.state.selectedMembers, {
        [memberId]: !this.state.selectedMembers[memberId],
      }),
    });
  }

  render() {
    const selectedMembers = Object.keys(this.state.selectedMembers).filter(
      k => this.state.selectedMembers[k],
    );

    return (
      <Modal size="lg" show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Member to Team Roster</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <Form.Control
              type="search"
              placeholder="Search&hellip;"
              value={this.state.filter}
              onChange={e => this.updateFilter(e.target.value)}
            />
          </div>

          <ListGroup>
            <ListGroup.Item className="border-top-0 border-left-0 border-right-0">
              <Row className="font-weight-bold">
                <Col xs={1}>
                  <Icon.Check size={20} />
                </Col>
                <Col xs={6}>Name</Col>
                <Col xs={5}>Account ID</Col>
              </Row>
            </ListGroup.Item>
            {this.state.filteredMembers.map(member => (
              <ListGroup.Item
                action
                active={selectedMembers.includes(member.accountId)}
                onClick={() => this.toggleSelected(member.accountId)}
                key={member.accountId}
              >
                <Row>
                  <Col xs={1}>
                    {selectedMembers.includes(member.accountId) ? (
                      <Icon.CheckSquare size={20} />
                    ) : (
                      <Icon.Square size={20} />
                    )}
                  </Col>
                  <Col xs={6}>{member.name}</Col>
                  <Col xs={5}>{member.accountId}</Col>
                </Row>
              </ListGroup.Item>
            ))}
            {this.state.filteredMembers.length === 0 && (
              <Row>
                <Col className="text-center m-2">No members found.</Col>
              </Row>
            )}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={selectedMembers.length === 0}>
            Add {selectedMembers.length} member{selectedMembers.length !== 1 && 's'}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
