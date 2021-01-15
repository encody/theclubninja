import React from 'react';
import Button from 'react-bootstrap/Button';
import { Redirect } from 'react-router-dom';
import { useServer } from '../server';

export default function SignIn() {
  const server = useServer();

  return server.user ? (
    <Redirect to="/" />
  ) : (
    <div>
      <h2>Sign In</h2>
      <p className="lead">Please sign in to access the check-in system.</p>
      <Button variant="primary" onClick={() => server.signIn()}>
        Sign In
      </Button>
    </div>
  );
}
