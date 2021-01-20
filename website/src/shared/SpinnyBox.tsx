import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

export default function SpinnyBox() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spinner role="status" animation="border" variant="primary">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
}
