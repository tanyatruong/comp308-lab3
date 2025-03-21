import { gql } from '@apollo/client';

// Login mutation - returns user and token
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        username
        email
      }
      token
    }
  }
`;

// Signup new user mutation - returns user and token
export const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      user {
        id
        username
        email
      }
      token
    }
  }
`;

// Fetch the current user
export const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      id
      username
      email
    }
  }
`;