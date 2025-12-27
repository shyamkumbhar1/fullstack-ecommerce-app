import React from 'react';
import { Alert } from 'react-bootstrap';

const ErrorMessage = ({ message, variant = 'danger' }) => {
  if (!message) return null;

  return (
    <Alert variant={variant} className="mt-3">
      {message}
    </Alert>
  );
};

export default ErrorMessage;

