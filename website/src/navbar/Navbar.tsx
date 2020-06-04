import React from 'react';
import styles from './Navbar.module.css';
import { NavLink } from 'react-router-dom';

export default class Navbar extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink className="navbar-brand" to="/">
          UMNBDC Check-In
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="navbar-nav collapse navbar-collapse" id="navbarSupportedContent">
          <NavLink className="nav-link" activeClassName="active" to="/club">
            Club
          </NavLink>
          <NavLink className="nav-link" activeClassName="active" to="/team">
            Team
          </NavLink>
          <NavLink className="nav-link" activeClassName="active" to="/members">
            Members
          </NavLink>
          <NavLink className="nav-link" activeClassName="active" to="/payments">
            Payments
          </NavLink>
          <NavLink className="nav-link" activeClassName="active" to="/events">
            Events
          </NavLink>
          <NavLink className="nav-link" activeClassName="active" to="/dashboards">
            Dashboards
          </NavLink>
        </div>
      </nav>
    );
  }
}
