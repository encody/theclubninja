import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import styles from './Club.module.css';
import { Member } from '../../model/Member';
import ClubRow from './ClubRow';

interface ClubProps {
  members: Member[];
}

interface ClubState {
  filter: string;
  filteredMembers: Member[];
}

export default class Club extends React.Component<ClubProps, ClubState> {
  public constructor(props: ClubProps) {
    super(props);

    this.state = {
      filter: '',
      filteredMembers: props.members,
    };
  }

  updateFilter(filter: string) {
    this.setState({
      filter,
      filteredMembers: this.props.members.filter(
        member =>
          member.name.toLowerCase().includes(filter.toLowerCase()) ||
          member.studentId.toLowerCase().includes(filter.toLowerCase()) ||
          member.accountId.toLowerCase().includes(filter.toLowerCase()),
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
            <ClubRow key={member.accountId} member={member} />
          ))}
        </ListGroup>

        {this.state.filteredMembers.length ? null : (
          <div className="row justify-content-center m-3">
            <p>No members.</p>
          </div>
        )}
      </Container>
    );
  }
}
