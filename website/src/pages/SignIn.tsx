import React from 'react';
import Button from 'react-bootstrap/Button';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../auth';

export default function SignIn() {
  const auth = useAuth();

  return auth.user ? (
    <Redirect to="/" />
  ) : (
    <div>
      <h2>Sign In</h2>
      <p className="lead">Please sign in to access the check-in system.</p>
      <Button variant="primary" onClick={() => auth.signIn()}>
        Sign In
      </Button>
    </div>
  );
}
