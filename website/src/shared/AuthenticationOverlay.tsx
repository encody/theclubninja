import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useServer } from '../server';
import styles from './AuthenticationOverlay.module.css';

export default function AuthenticationOverlay() {
  const server = useServer();

  return server.blocking.size > 0 ? (
    <div className={styles.overlay}>
      <Spinner role="status" animation="grow" variant="primary">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  ) : (
    <> </>
  );
}
