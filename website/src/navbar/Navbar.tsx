import React from 'react';
import * as Icon from 'react-feather';
import styles from './Navbar.module.css';
import Nav from 'react-bootstrap/Nav';
import BootstrapNavbar from 'react-bootstrap/Navbar';
import Spinner from 'react-bootstrap/Spinner';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { NavLink } from 'react-router-dom';
import { useServer } from '../server';

export default function Navbar() {
  const server = useServer();

  return (
    <BootstrapNavbar bg="light" expand="lg">
      <NavLink className="navbar-brand" to="/">
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
          <BootstrapNavbar.Text className="mr-2 d-none d-lg-block">
            {server.nonBlocking ? (
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id="synchronizing-tooltip">Synchronizing...</Tooltip>
                }
              >
                <Spinner animation="border" variant="success" size="sm" />
              </OverlayTrigger>
            ) : (
              <Icon.Check
                color="green"
                size={18}
                className={styles['synchronized-check']}
              />
            )}
          </BootstrapNavbar.Text>
          {server.user ? (
            <>
              <BootstrapNavbar.Text className="text-dark">
                {server.user.displayName}
              </BootstrapNavbar.Text>
              <Nav.Link onClick={() => server.signOut()}>Sign Out</Nav.Link>
            </>
          ) : (
            <NavLink className="nav-link" activeClassName="active" to="/signin">
              Sign In
            </NavLink>
          )}
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
}
