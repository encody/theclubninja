import moment from 'moment';
import React from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Member } from '../../model/Member';
import { memberTypes } from '../../dummydata';
import { MemberTypeId } from '../../model/MemberType';

interface NewMemberModalProps {
  show: boolean;
  onClose: () => void;
}

export default class NewMemberModal extends React.Component<
  NewMemberModalProps,
  { show: boolean; member: Member }
> {
  constructor(props: NewMemberModalProps) {
    super(props);

    this.state = {
      show: false,
      member: {
        name: '',
        graduationYear: moment().year() + 2,
        memberType: 'student',
        isTeamMember: false,
        referralMember: '',
        source: '',
        studentId: '',
        x500: '',
        waivers: [],
        attendance: [],
      },
    };
  }

  updateMember<K extends keyof Member>(prop: K, value: Member[K]) {
    const { member } = this.state;
    member[prop] = value;
    this.setState({ member });
  }

  render() {
    return (
      <Modal size="lg" show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {this.state.member.name.trim().length
              ? this.state.member.name
              : 'New Member'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table responsive>
            <tr>
              <td>Name:</td>
              <td>
                <Form.Control
                  required
                  type="text"
                  value={this.state.member.name}
                  onChange={e => this.updateMember('name', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>x500:</td>
              <td>
                <Form.Control
                  required
                  type="text"
                  value={this.state.member.x500}
                  onChange={e => this.updateMember('x500', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Student ID:</td>
              <td>
                <Form.Control
                  required
                  type="text"
                  value={this.state.member.studentId}
                  onChange={e => this.updateMember('studentId', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Member Type:</td>
              <td>
                <Form.Control
                  required
                  custom
                  as="select"
                  onChange={e =>
                    this.updateMember(
                      'memberType',
                      e.target.value as MemberTypeId,
                    )
                  }
                >
                  {Object.keys(memberTypes).map(k => (
                    <option
                      key={k}
                      value={k}
                      selected={k === this.state.member.memberType}
                    >
                      {memberTypes[k as MemberTypeId].name}
                    </option>
                  ))}
                </Form.Control>
              </td>
            </tr>
            <tr>
              <td>Graduation Year:</td>
              <td>
                <Form.Control
                  required
                  type="text"
                  value={this.state.member.graduationYear}
                  onChange={e => {
                    const { value } = e.target;
                    const p = parseInt(value, 10);
                    if (/^\d+$/.test(value) && !isNaN(p) && p >= 0) {
                      this.updateMember('graduationYear', p);
                    }
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Team Member:</td>
              <td>
                <Form.Check
                  required
                  custom
                  label
                  id="isTeamMemberCheckBox"
                  type="checkbox"
                  checked={this.state.member.isTeamMember}
                  onClick={(
                    e: React.MouseEvent<HTMLInputElement, MouseEvent>,
                  ) =>
                    this.updateMember('isTeamMember', (e.target as any).checked)
                  }
                />
              </td>
            </tr>
            <tr>
              <td>How did you hear about us?</td>
              <td>
                <Form.Control
                  required
                  as="textarea"
                  value={this.state.member.source}
                  onChange={e => this.updateMember('source', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Did anyone refer you?</td>
              <td>
                <Form.Control
                  required
                  type="text"
                  value={this.state.member.referralMember}
                  onChange={e =>
                    this.updateMember('referralMember', e.target.value)
                  }
                />
              </td>
            </tr>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary">Save</Button>
          <Button variant="outline-secondary">Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
