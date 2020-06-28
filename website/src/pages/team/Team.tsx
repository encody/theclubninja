import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Member } from '../../model/Member';
import { Membership } from '../../model/MemberTerm';
import { Model } from '../../model/Model';
import TeamAttendanceHistoryRow from './TeamAttendanceHistoryRow';
import TeamCheckInRow from './TeamCheckInRow';

interface TeamProps {
  model: Model;
  termId: string;
}

interface TeamState {
  filter: string;
  memberList: Member[];
  filteredMembers: Member[];
}

export default class Team extends React.Component<TeamProps, TeamState> {
  public constructor(props: TeamProps) {
    super(props);

    const members = Object.values(props.model.data.members).filter(
      m =>
        m.isActiveMember(this.props.termId) &&
        m.hasMembership(Membership.Team, this.props.termId),
    );

    this.state = {
      filter: '',
      memberList: members,
      filteredMembers: members.slice(),
    };
  }

  updateFilter(filter: string) {
    this.setState({
      filter,
      filteredMembers: this.state.memberList.filter(
        member =>
          member.data.name.toLowerCase().includes(filter.toLowerCase()) ||
          member.data.studentId.toLowerCase().includes(filter.toLowerCase()) ||
          member.data.accountId.toLowerCase().includes(filter.toLowerCase()),
      ),
    });
  }

  render() {
    const currentTerm = this.props.model.data.terms[
      this.props.model.data.terms.length - 1
    ];

    return (
      <Container>
        <Row as="header">
          <h2 className="mb-3">Team Check-In</h2>
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

        <Tabs id="teamCheckIn" defaultActiveKey="checkin">
          <Tab eventKey="checkin" title="Check-In">
            <ListGroup>
              <ListGroup.Item className="border-top-0 border-left-0 border-right-0">
                <Row className="font-weight-bold">
                  <Col xs={4}>Name</Col>
                  <Col xs={2}>Account ID</Col>
                  <Col xs={6}>Check-In</Col>
                </Row>
              </ListGroup.Item>
              {this.state.filteredMembers.map(member => (
                <TeamCheckInRow
                  key={member.data.accountId}
                  member={member}
                  termId={currentTerm.id}
                />
              ))}
            </ListGroup>
          </Tab>
          <Tab eventKey="history" title="Attendance History">
            <ListGroup>
              <ListGroup.Item className="border-top-0 border-left-0 border-right-0">
                <Row className="font-weight-bold">
                  <Col xs={4}>Name</Col>
                  <Col xs={2}>Account ID</Col>
                  <Col xs={6}>Check-In</Col>
                </Row>
              </ListGroup.Item>
              {this.state.filteredMembers.map(member => (
                <TeamAttendanceHistoryRow
                  key={member.data.accountId}
                  member={member}
                  term={currentTerm.id}
                />
              ))}
            </ListGroup>
          </Tab>
        </Tabs>

        {this.state.filteredMembers.length ? null : (
          <div className="row justify-content-center m-3">
            <p>No members.</p>
          </div>
        )}
      </Container>
    );
  }
}
