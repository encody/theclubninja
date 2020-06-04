import React from 'react';
import Member from '../../model/Member';

export default class MemberRow extends React.Component<{ member: Member }> {
  render() {
    return (
      <tr>
        <td>{this.props.member.name}</td>
        <td>{this.props.member.x500}</td>
        <td>{this.props.member.isTeamMember ? 'Yes' : 'No'}</td>
        <td>status</td>
        <td>
          <button>Button</button>
        </td>
      </tr>
    );
  }
}
