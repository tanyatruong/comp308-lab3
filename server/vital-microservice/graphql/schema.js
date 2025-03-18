const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type VitalSign {
    id: ID!
    userId: ID!
    pulseRate: Int!
    bloodPressure: String!
    temperature: Float!
    respiratoryRate: Int!
    createdAt: String!
    updatedAt: String!
  }

  input VitalSignInput {
    pulseRate: Int!
    bloodPressure: String!
    temperature: Float!
    respiratoryRate: Int!
  }

  type Query {
    vitalSigns: [VitalSign!]!
    vitalSign(id: ID!): VitalSign
    myLatestVitalSigns: [VitalSign!]!
  }

  type Mutation {
    createVitalSign(input: VitalSignInput!): VitalSign!
    updateVitalSign(id: ID!, input: VitalSignInput!): VitalSign!
    deleteVitalSign(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;