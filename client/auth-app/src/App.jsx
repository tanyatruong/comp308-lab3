import React from 'react';
import { Card } from 'react-bootstrap';
import AuthTabs from './components/AuthTabs';
import './App.css';

function App({ onLoginSuccess }) {
  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Card.Header className="text-center">
          <h2>Welcome to Vital Signs Management</h2>
          <p className="text-muted">Sign in or create an account to continue</p>
        </Card.Header>
        <Card.Body>
          <AuthTabs onLoginSuccess={onLoginSuccess} />
        </Card.Body>
      </Card>
    </div>
  );
}

export default App;