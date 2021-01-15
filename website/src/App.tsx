import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { mostRecentTerm } from './model/Model';
import Navbar from './navbar/Navbar';
import Club from './pages/club/Club';
import Members from './pages/members/Members';
import Payments from './pages/payments/Payments';
import SignIn from './pages/SignIn';
import Team from './pages/team/Team';
import { PrivateRoute, ProvideServer } from './server';
import AuthenticationOverlay from './shared/AuthenticationOverlay';

export default function App() {
  return (
    <ProvideServer>
      <AuthenticationOverlay />
      <Router>
        <div>
          <Navbar />

          <Container>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/signin">
                <SignIn />
              </Route>
              <PrivateRoute path="/club">
                <Club />
              </PrivateRoute>
              <PrivateRoute path="/team">
                <Team />
              </PrivateRoute>
              <PrivateRoute path="/members">
                <Members />
              </PrivateRoute>
              <PrivateRoute path="/payments">
                <Payments />
              </PrivateRoute>
              <PrivateRoute path="/events">
                <NotYet />
              </PrivateRoute>
              <PrivateRoute path="/dashboards">
                <NotYet />
              </PrivateRoute>
              <Route path="*">
                <NotFound />
              </Route>
            </Switch>
          </Container>
        </div>
      </Router>
    </ProvideServer>
  );
}

function NotYet() {
  return (
    <div>
      <p>
        Unfortunately, that part of the check-in system is not available yet.
      </p>
    </div>
  );
}

function NotFound() {
  return (
    <div>
      <p>??? not found lol</p>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h2>
        Welcome to the University of Minnesota Ballroom Dance Club Check-In
        System
      </h2>
      <p className="lead">
        Please enjoy your stay and try <em>really hard</em> not to break
        anything.
      </p>
    </div>
  );
}
