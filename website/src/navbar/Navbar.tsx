import React, { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import BootstrapNavbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Spinner from 'react-bootstrap/Spinner';
import Tooltip from 'react-bootstrap/Tooltip';
import * as Icon from 'react-feather';
import { NavLink } from 'react-router-dom';
import { useServer } from '../server';
import styles from './Navbar.module.css';
import NewTermModal from './NewTermModal';

export default function Navbar() {
  const server = useServer();

  const [showNewTermModal, setShowNewTermModal] = useState(false);

  return (
    <>
      <BootstrapNavbar bg="light" expand="lg">
        <NavLink className="navbar-brand" to="/">
          UMNBDC
        </NavLink>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BootstrapNavbar.Collapse>
          <Nav className="mr-auto">
            {server.profile && (
              <>
                <NavLink
                  className="nav-link"
                  activeClassName="active"
                  to="/club"
                >
                  Club
                </NavLink>
                <NavLink
                  className="nav-link"
                  activeClassName="active"
                  to="/team"
                >
                  Team
                </NavLink>
                <NavLink
                  className="nav-link"
                  activeClassName="active"
                  to="/members"
                >
                  Members
                </NavLink>
                {server.profile.permissions.charges.read && (
                  <NavLink
                    className="nav-link"
                    activeClassName="active"
                    to="/payments"
                  >
                    Payments
                  </NavLink>
                )}
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
              {server.nonBlocking.size > 0 ? (
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="synchronizing-tooltip">
                      Synchronizing...
                    </Tooltip>
                  }
                >
                  <Spinner animation="border" variant="success" size="sm" />
                </OverlayTrigger>
              ) : (
                <Icon.Check
                  size={18}
                  className={styles['synchronized-check'] + ' text-success'}
                />
              )}
            </BootstrapNavbar.Text>
            {server.blocking.size === 0 && (
              <NavDropdown
                id="Navbar_TermDropdown"
                className="mr-2"
                title={
                  <>
                    Term:{' '}
                    <span className="text-primary">
                      {server.model.terms[server.term]?.name}
                    </span>
                  </>
                }
              >
                {Object.values(server.model.terms)
                  .sort((a, b) => b.start - a.start)
                  .map(term => (
                    <NavDropdown.Item
                      key={term.id}
                      active={server.term === term.id}
                      onClick={() => server.setTerm(term.id)} // TODO: Save in localStorage
                    >
                      {term.name}
                    </NavDropdown.Item>
                  ))}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => setShowNewTermModal(true)}>
                  Create term...
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {server.user ? (
              <>
                <BootstrapNavbar.Text className="text-dark">
                  {server.user.displayName}
                </BootstrapNavbar.Text>
                <Nav.Link onClick={() => server.signOut()}>Sign Out</Nav.Link>
              </>
            ) : (
              <NavLink
                className="nav-link"
                activeClassName="active"
                to="/signin"
              >
                Sign In
              </NavLink>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </BootstrapNavbar>
      <NewTermModal
        show={showNewTermModal}
        onClose={() => setShowNewTermModal(false)}
      />
    </>
  );
}
