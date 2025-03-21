// client/auth-app/src/components/SignupForm.jsx
import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { SIGNUP_MUTATION } from '../graphql/queries';

const SignupForm = ({ onSignupSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const [signup, { loading }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: () => {
      // Clear the form
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setValidated(false);
      
      // Show success alert
      alert('Account created successfully! Please login.');
      
      // If a callback was provided, call it
      if (onSignupSuccess) {
        onSignupSuccess();
      }
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      event.stopPropagation();
      return;
    } else {
      setPasswordMismatch(false);
    }
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    
    setError('');
    signup({ variables: { username, email, password } });
  };

  return (
    // Signup form
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form.Group className="mb-3" controlId="signupUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
        />
        <Form.Control.Feedback type="invalid">
          Username must be at least 3 characters.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="signupEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please provide a valid email.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="signupPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={3}
          isInvalid={passwordMismatch}
        />
        <Form.Control.Feedback type="invalid">
          Password must be at least 3 characters.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="signupConfirmPassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          isInvalid={passwordMismatch}
        />
        {passwordMismatch && (
          <Form.Control.Feedback type="invalid">
            Passwords do not match.
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Button variant="primary" type="submit" disabled={loading} className="w-100">
        {loading ? (
          <>
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            <span className="ms-2">Creating account...</span>
          </>
        ) : (
          'Sign Up'
        )}
      </Button>
    </Form>
  );
};

export default SignupForm;