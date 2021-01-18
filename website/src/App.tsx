import React from 'react';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './navbar/Navbar';
import Members from './pages/members/Members';
import Payments from './pages/payments/Payments';
import Roster from './pages/roster/Roster';
import SignIn from './pages/SignIn';
import { PrivateRoute, ProvideServer, useServer } from './server';
import AuthenticationOverlay from './shared/AuthenticationOverlay';

export default function App() {
  return (
    <ProvideServer>
      <AuthenticationOverlay />
      <Router>
        <div>
          <Navbar />

          <Container>
            <Routes />
          </Container>
        </div>
      </Router>
    </ProvideServer>
  );
}

function Routes() {
  const server = useServer();
  const membershipsOrder = Object.values(server.model.memberships).sort(
    (a, b) => a.order - b.order,
  );

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <SignIn />
      </Route>
      {membershipsOrder.map(m => (
        <PrivateRoute key={m.id} path={'/' + m.slug}>
          <Roster membership={m} />
        </PrivateRoute>
      ))}
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
