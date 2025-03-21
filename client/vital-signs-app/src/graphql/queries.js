import { gql } from '@apollo/client';

// Fetch all vital signs
export const GET_VITAL_SIGNS = gql`
  query GetVitalSigns {
    vitalSigns {
      id
      pulseRate
      bloodPressure
      temperature
      respiratoryRate
      createdAt
      updatedAt
    }
  }
`;

// Fetch a specific vital sign by ID
export const GET_VITAL_SIGN = gql`
  query GetVitalSign($id: ID!) {
    vitalSign(id: $id) {
      id
      pulseRate
      bloodPressure
      temperature
      respiratoryRate
      createdAt
      updatedAt
    }
  }
`;

// Fetch the latest vital signs for the authenticated user
export const GET_LATEST_VITAL_SIGNS = gql`
  query GetLatestVitalSigns {
    myLatestVitalSigns {
      id
      pulseRate
      bloodPressure
      temperature
      respiratoryRate
      createdAt
      updatedAt
    }
  }
`;

// Create a new vital sign record
export const CREATE_VITAL_SIGN = gql`
  mutation CreateVitalSign($input: VitalSignInput!) {
    createVitalSign(input: $input) {
      id
      pulseRate
      bloodPressure
      temperature
      respiratoryRate
      createdAt
      updatedAt
    }
  }
`;

// Update an existing vital sign record
export const UPDATE_VITAL_SIGN = gql`
  mutation UpdateVitalSign($id: ID!, $input: VitalSignInput!) {
    updateVitalSign(id: $id, input: $input) {
      id
      pulseRate
      bloodPressure
      temperature
      respiratoryRate
      createdAt
      updatedAt
    }
  }
`;

// Delete a vital sign record
export const DELETE_VITAL_SIGN = gql`
  mutation DeleteVitalSign($id: ID!) {
    deleteVitalSign(id: $id)
  }
`;