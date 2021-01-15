import React from 'react';
import Nav from 'react-bootstrap/Nav';
import BootstrapNavbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { useServer } from '../server';

export default function Navbar() {
  const server = useServer();

  return (
    <BootstrapNavbar bg="light" expand="lg">
      <NavLink
        className="navbar-brand"
        to="/"
      >
        UMNBDC Check-In
      </NavLink>
      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

      <BootstrapNavbar.Collapse>
        <Nav className="mr-auto">
          {server.profile && server.profile.admin && (
            <>
              <NavLink className="nav-link" activeClassName="active" to="/club">
                Club
              </NavLink>
              <NavLink className="nav-link" activeClassName="active" to="/team">
                Team
              </NavLink>
              <NavLink
                className="nav-link"
                activeClassName="active"
                to="/members"
              >
                Members
              </NavLink>
              <NavLink
                className="nav-link"
                activeClassName="active"
                to="/payments"
              >
                Payments
              </NavLink>
              <NavLink
                className="nav-link"
                activeClassName="active"
                to="/events"
              >
                Events
              </NavLink>
              <NavLink
                className="nav-link"
                activeClassName="active"
                to="/dashboards"
              >
                Dashboards
              </NavLink>
            </>
          )}
        </Nav>
        <Nav>
          {(server.user && (
            <>
              <BootstrapNavbar.Text className="text-dark">
                Welcome, {server.user.displayName}
              </BootstrapNavbar.Text>
              <Nav.Link onClick={() => server.signOut()}>Sign Out</Nav.Link>
            </>
          )) || (
            <NavLink className="nav-link" activeClassName="active" to="/signin">
              Sign In
            </NavLink>
          )}
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
}
