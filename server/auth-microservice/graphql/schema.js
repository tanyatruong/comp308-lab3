const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    createdAt: String
  }

  type Query {
    currentUser: User
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthResponse
    login(email: String!, password: String!): AuthResponse
    logout: Boolean
  }

  type AuthResponse {
    user: User
    token: String
  }
`;

module.exports = typeDefs;