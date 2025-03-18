import { gql } from '@apollo/client';

export const GET_VITAL_SIGNS = gql`
  query GetVitalSigns {
    vitalSigns {
      id
      pulseRate
      bloodPressure
      weight
      temperature
      respiratoryRate
      createdAt
      updatedAt
    }
  }
`;

export const GET_VITAL_SIGN = gql`
  query GetVitalSign($id: ID!) {
    vitalSign(id: $id) {
      id
      pulseRate
      bloodPressure
      weight
      temperature
      respiratoryRate
      createdAt
      updatedAt
    }
  }
`;

export const GET_LATEST_VITAL_SIGNS = gql`
  query GetLatestVitalSigns {
    myLatestVitalSigns {
      id
      pulseRate
      bloodPressure
      weight
      temperature
      respiratoryRate
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_VITAL_SIGN = gql`
  mutation CreateVitalSign($input: VitalSignInput!) {
    createVitalSign(input: $input) {
      id
      pulseRate
      bloodPressure
      weight
      temperature
      respiratoryRate
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_VITAL_SIGN = gql`
  mutation UpdateVitalSign($id: ID!, $input: VitalSignInput!) {
    updateVitalSign(id: $id, input: $input) {
      id
      pulseRate
      bloodPressure
      weight
      temperature
      respiratoryRate
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_VITAL_SIGN = gql`
  mutation DeleteVitalSign($id: ID!) {
    deleteVitalSign(id: $id)
  }
`;