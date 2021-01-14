import React from 'react';
import styles from './Navbar.module.css';
import { NavLink } from 'react-router-dom';
import BootstrapNavbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useAuth } from '../auth';

export default function Navbar() {
  const auth = useAuth();

  return (
    <BootstrapNavbar bg="light" expand="lg">
      <NavLink className="navbar-brand" to="/">
        UMNBDC Check-In
      </NavLink>
      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

      <BootstrapNavbar.Collapse>
        <Nav className="mr-auto">
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
          <NavLink
            className="nav-link"
            activeClassName="active"
            to="/dashboards"
          >
            Dashboards
          </NavLink>
        </Nav>
        {(auth.user && (
          <Nav>
            <BootstrapNavbar.Text className="text-dark">
              Welcome, {auth.user.displayName}
            </BootstrapNavbar.Text>
            <Nav.Link onClick={() => auth.signOut()}>Sign Out</Nav.Link>
          </Nav>
        )) || (
          <Nav>
            <NavLink className="nav-link" activeClassName="active" to="/signin">
              Sign In
            </NavLink>
          </Nav>
        )}
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
}
