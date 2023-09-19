import React from 'react';
import { Spinner } from 'react-bootstrap';

export default function Loading() {
  const spinnerStyle = {
    color: '#FFD151',
    width: '100px',
    height: '100px',
    outline: 'none', // Remove the outline
  };

  return <Spinner animation="border" style={spinnerStyle} />;
}
