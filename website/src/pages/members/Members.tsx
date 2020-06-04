import React from 'react';
import styles from './Members.module.css';

import { members } from '../../dummydata';
import MemberRow from './MemberRow';

export default class Members extends React.Component<{}, { filter: string }> {
  constructor(props: {}) {
    super(props);

    this.state = {
      filter: '',
    };
  }

  updateFilter(filter: string) {
    this.setState({
      filter,
    });
  }

  render() {
    return (
      <div>
        <h2 className="mb-3">Members</h2>

        <div className="btn-toolbar mb-3">
          <div className="input-group flex-fill mr-3">
            <input
              className="form-control"
              type="search"
              placeholder="Search&hellip;"
              value={this.state.filter}
              onChange={e => this.updateFilter(e.target.value)}
            />
            <div className="input-group-append">
              <button className="btn btn-primary">Search</button>
            </div>
          </div>
          <div className="btn-group">
            <button type="button" className="btn btn-primary">
              New Member
            </button>
          </div>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>x500</th>
              <th>Team Member</th>
              <th>Status</th>
              <th>Open</th>
            </tr>
          </thead>
          <tbody>
            {members
              .filter(
                member =>
                  member.name
                    .toLowerCase()
                    .includes(this.state.filter.toLowerCase()) ||
                  member.studentId
                    .toLowerCase()
                    .includes(this.state.filter.toLowerCase()) ||
                  member.x500
                    .toLowerCase()
                    .includes(this.state.filter.toLowerCase()),
              )
              .map(member => (
                <MemberRow member={member} />
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}
