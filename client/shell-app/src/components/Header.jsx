import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

// Navbar header component
const Header = ({ isLoggedIn, user }) => {
  const navigate = useNavigate();
  const [logout] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => {
      // Dispatch a custom event to notify the app about logout
      window.dispatchEvent(new CustomEvent('logout-success'));
      navigate('/');
    }
  });

  // Handle logout event
  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Vital Signs Management</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn && (
              <Nav.Link as={Link} to="/vital-signs">My Vital Signs</Nav.Link>
            )}
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <>
                <Navbar.Text className="me-3">
                  Signed in as: <span className="fw-bold">{user?.username}</span>
                </Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/">Login / Register</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;