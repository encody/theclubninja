import moment from 'moment';
import React from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { IMember } from '../model/Member';
import { MemberType, memberTypes } from '../model/MemberType';

interface NewMemberModalProps {
  show: boolean;
  onClose: () => void;
}

export default class NewMemberModal extends React.Component<
  NewMemberModalProps,
  { show: boolean; member: IMember }
> {
  constructor(props: NewMemberModalProps) {
    super(props);

    this.state = {
      show: false,
      member: {
        name: '',
        graduationYear: moment().year() + 2,
        memberType: MemberType.Student,
        referralMember: '',
        source: '',
        studentId: '',
        accountId: '',
        waivers: [],
        terms: {},
      },
    };
  }

  updateMember<K extends keyof IMember>(prop: K, value: IMember[K]) {
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
              ? 'New Member: ' + this.state.member.name
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
              <td>Account ID:</td>
              <td>
                <Form.Control
                  required
                  type="text"
                  value={this.state.member.accountId}
                  onChange={e => this.updateMember('accountId', e.target.value)}
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
                      e.target.value in MemberType
                        ? (e.target.value as MemberType)
                        : MemberType.Student,
                    )
                  }
                >
                  {(Object.keys(MemberType) as (keyof typeof MemberType)[]).map(
                    k => (
                      <option
                        key={k}
                        value={k}
                        selected={
                          MemberType[k] === this.state.member.memberType
                        }
                      >
                        {memberTypes[MemberType[k]].name}
                      </option>
                    ),
                  )}
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
              <td>Referring member account ID:</td>
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
