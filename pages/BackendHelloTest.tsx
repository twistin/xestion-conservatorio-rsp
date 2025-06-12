import React, { useEffect, useState } from 'react';
import * as dataService from '../services/dataService';

const BackendHelloTest: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    dataService.getHelloMessage()
      .then(setMessage)
      .catch(() => setError('No se pudo conectar con el backend Django.'));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Test conexión Backend Django</h2>
      {message && <div style={{ color: 'green' }}>Mensaje: {message}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default BackendHelloTest;
