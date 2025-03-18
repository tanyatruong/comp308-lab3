import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_VITAL_SIGN, UPDATE_VITAL_SIGN, GET_VITAL_SIGN, GET_VITAL_SIGNS } from '../graphql/queries';

const VitalSignsForm = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    pulseRate: '',
    bloodPressure: '',
    temperature: '',
    respiratoryRate: ''
  });
  
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  
  // Query for getting existing vital sign data if in edit mode
  const { loading: queryLoading, error: queryError, data } = useQuery(
    GET_VITAL_SIGN, 
    { 
      variables: { id },
      skip: !isEditMode,
      onCompleted: (data) => {
        if (data.vitalSign) {
          setFormData({
            pulseRate: data.vitalSign.pulseRate,
            bloodPressure: data.vitalSign.bloodPressure,
            temperature: data.vitalSign.temperature,
            respiratoryRate: data.vitalSign.respiratoryRate
          });
        }
      }
    }
  );
  
  // Mutation for creating a new vital sign
  const [createVitalSign, { loading: createLoading }] = useMutation(CREATE_VITAL_SIGN, {
    onCompleted: () => {
      navigate('/');
    },
    onError: (error) => {
      setError(error.message);
    },
    update: (cache, { data: { createVitalSign } }) => {
      try {
        // Read the current query data from the cache
        const existingData = cache.readQuery({ 
          query: GET_VITAL_SIGNS 
        });
        
        if (existingData && existingData.vitalSigns) {
          // Update the cache with the new vital sign
          cache.writeQuery({
            query: GET_VITAL_SIGNS,
            data: { 
              vitalSigns: [createVitalSign, ...existingData.vitalSigns] 
            }
          });
        }
      } catch (error) {
        console.error("Error updating cache:", error);
      }
    }
  });
  
  // Mutation for updating an existing vital sign
  const [updateVitalSign, { loading: updateLoading }] = useMutation(UPDATE_VITAL_SIGN, {
    onCompleted: () => {
      navigate('/');
    },
    onError: (error) => {
      setError(error.message);
    }
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'bloodPressure' ? value : Number(value)
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    const vitalSignInput = {
      pulseRate: parseInt(formData.pulseRate),
      bloodPressure: formData.bloodPressure,
      temperature: parseFloat(formData.temperature),
      respiratoryRate: parseInt(formData.respiratoryRate)
    };
    
    setError('');
    
    if (isEditMode) {
      updateVitalSign({ variables: { id, input: vitalSignInput } });
    } else {
      createVitalSign({ variables: { input: vitalSignInput } });
    }
  };
  
  const handleCancel = () => {
    navigate('/');
  };
  
  const isLoading = queryLoading || createLoading || updateLoading;
  
  if (queryLoading) return (
    <div className="text-center p-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
  
  if (queryError) return (
    <Alert variant="danger">
      Error loading vital sign data: {queryError.message}
    </Alert>
  );
  
  return (
    <div className="form-container">
      <Card>
        <Card.Header>
          <h3>{isEditMode ? 'Edit Vital Signs' : 'Add New Vital Signs'}</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="pulseRate">
                  <Form.Label>Pulse Rate (bpm)</Form.Label>
                  <Form.Control
                    type="number"
                    name="pulseRate"
                    placeholder="Enter pulse rate"
                    value={formData.pulseRate}
                    onChange={handleChange}
                    required
                    min={0}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid pulse rate.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3" controlId="bloodPressure">
                  <Form.Label>Blood Pressure (mmHg)</Form.Label>
                  <Form.Control
                    type="text"
                    name="bloodPressure"
                    placeholder="Format: systolic/diastolic (e.g. 120/80)"
                    value={formData.bloodPressure}
                    onChange={handleChange}
                    required
                    pattern="^\d+\/\d+$"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide blood pressure in the format "120/80".
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="temperature">
                  <Form.Label>Temperature (°C)</Form.Label>
                  <Form.Control
                    type="number"
                    name="temperature"
                    placeholder="Enter temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    required
                    min={25}
                    max={45}
                    step="0.1"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid temperature (between 25-45°C).
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3" controlId="respiratoryRate">
                  <Form.Label>Respiratory Rate (bpm)</Form.Label>
                  <Form.Control
                    type="number"
                    name="respiratoryRate"
                    placeholder="Enter respiratory rate"
                    value={formData.respiratoryRate}
                    onChange={handleChange}
                    required
                    min={0}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid respiratory rate.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end mt-4">
              <Button variant="secondary" onClick={handleCancel} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">Saving...</span>
                  </>
                ) : (
                  isEditMode ? 'Update' : 'Save'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default VitalSignsForm;