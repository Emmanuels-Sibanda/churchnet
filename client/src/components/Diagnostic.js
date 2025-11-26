import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Diagnostic = () => {
  const [results, setResults] = useState({
    backend: 'checking...',
    api: 'checking...',
    localStorage: 'checking...',
    errors: []
  });

  useEffect(() => {
    const runDiagnostics = async () => {
      const diagnostics = {
        backend: 'unknown',
        api: 'unknown',
        localStorage: 'unknown',
        errors: []
      };

      // Check backend
      try {
        const response = await axios.get('/api/health', { timeout: 3000 });
        if (response.data.status === 'OK') {
          diagnostics.backend = '✅ Running';
        } else {
          diagnostics.backend = '⚠️ Responding but unexpected response';
        }
      } catch (error) {
        diagnostics.backend = '❌ Not responding';
        diagnostics.errors.push(`Backend error: ${error.message}`);
      }

      // Check API endpoint
      try {
        const response = await axios.get('/api/venues', { timeout: 3000 });
        diagnostics.api = '✅ Working';
      } catch (error) {
        diagnostics.api = '❌ Failed';
        diagnostics.errors.push(`API error: ${error.message}`);
      }

      // Check localStorage
      try {
        const token = localStorage.getItem('token');
        const church = localStorage.getItem('church');
        if (token || church) {
          diagnostics.localStorage = `✅ Has data (token: ${token ? 'yes' : 'no'}, church: ${church ? 'yes' : 'no'})`;
        } else {
          diagnostics.localStorage = '✅ Empty (normal for new users)';
        }
      } catch (error) {
        diagnostics.localStorage = '❌ Error accessing';
        diagnostics.errors.push(`localStorage error: ${error.message}`);
      }

      setResults(diagnostics);
    };

    runDiagnostics();
  }, []);

  return (
    <div style={{
      padding: '20px',
      margin: '20px',
      backgroundColor: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      fontFamily: 'monospace'
    }}>
      <h3>System Diagnostics</h3>
      <div style={{ marginTop: '10px' }}>
        <div><strong>Backend Server:</strong> {results.backend}</div>
        <div><strong>API Connection:</strong> {results.api}</div>
        <div><strong>LocalStorage:</strong> {results.localStorage}</div>
      </div>
      {results.errors.length > 0 && (
        <div style={{ marginTop: '10px', color: '#dc3545' }}>
          <strong>Errors:</strong>
          <ul>
            {results.errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Refresh Diagnostics
      </button>
    </div>
  );
};

export default Diagnostic;

