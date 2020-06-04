import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './navbar/Navbar';
import Club from './pages/club/Club';
import Team from './pages/team/Team';
import Members from './pages/members/Members';
import Payments from './pages/payments/Payments';

export default function App() {
  return (
    <Router>
      <div>
        <Navbar />

        <div className="mx-auto my-3 w-75">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/club">
              <Club />
            </Route>
            <Route path="/team">
              <Team />
            </Route>
            <Route path="/members">
              <Members />
            </Route>
            <Route path="/payments">
              <Payments />
            </Route>
            <Route path="/events">
              <NotYet />
            </Route>
            <Route path="/dashboards">
              <NotYet />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
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
