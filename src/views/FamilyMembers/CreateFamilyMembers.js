import React from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

const validationSchema = Yup.object().shape({
  familyMembers: Yup.array().of(
    Yup.object().shape({
      firstName: Yup.string().required('First Name is Required'),
      lastName: Yup.string().required('Last Name is Required'),
      email: Yup.string().email('Invalid email address').required('Email is Required'),
      mobile: Yup.string()
        .required('Mobile number is Required')
        .matches(/^[0-9]+$/, 'Mobile number must contain only digits'),
      dateOfBirth: Yup.date().nullable().required('Date of Birth is Required'),
      relationship: Yup.string().required('Relationship is Required'),
      address: Yup.string().required('Address is Required'),
      city: Yup.string().required('City is Required'),
      country: Yup.string().required('Country is Required'),
      postalCode: Yup.string()
        .required('Postal Code is Required')
        .matches(/^\d{5}$/, 'Postal Code must be a 5-digit number'),
      passportExpiryDate: Yup.date().nullable().required('Passport Expiry Date is Required'),
      passportNumber: Yup.string().required('Passport Number is Required'),
      foodPreferences: Yup.string()
    })
  )
  // ... other top-level validations if needed
});
export default function CreateFamilyMembers() {
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  const getClientId = () => {
    const searchParams = new URLSearchParams(location.search);
    const queryParams = searchParams.get('clientId');
    return queryParams;
  };

  function generateSixDigitNumber() {
    const min = 100000; // Smallest 6-digit number
    const max = 999999; // Largest 6-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const handleSubmit = (values) => {
    // console.log(values.familyMembers);

    const promise = new Promise((resolve, reject) => {
      try {
        setLoading(true);
        const FamilyMembersArr = values?.familyMembers.map((familyMember) => ({
          ...familyMember,
          FamilyMemberId: generateSixDigitNumber()
        }));
        console.log(FamilyMembersArr);
        axios
          .post('/createFamilyMembers', { FamilyMembersArr })
          .then((response) => {
            if (response) {
              toast.success('Family members were successfully created!!');
              setLoading(false);
              window.location.reload();

              resolve();
            } else {
              setLoading(false);
              reject(new Error('Failed to create family members'));
            }
          })
          .catch((error) => {
            console.log({ error });
            setLoading(false);
            reject(error);
          });
      } catch (err) {
        console.log({ error: err });
        setLoading(false);
        reject(err);
      }
    });
    toast.promise(promise, {
      loading: 'Creating family members...',
      success: 'Family members were successfully created!',
      error: 'Failed to create family members!'
    });
  };

  const initialValues = {
    familyMembers: [
      {
        clientId: getClientId(),
        FamilyMemberId: 0,
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        dateOfBirth: '',
        relationship: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
        passportNumber: '',
        passportExpiryDate: '',
        foodPreferences: ''
      }
    ]
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Create Family Members
      </Typography>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values }) => (
          <Form>
            <FieldArray name="familyMembers">
              {({ push, remove }) => (
                <div>
                  {values.familyMembers.map((familyMember, index) => (
                    <Grid container spacing={2} key={index}>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name={`familyMembers[${index}].firstName`}
                          as={TextField}
                          type="text"
                          label="First Name"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`familyMembers[${index}].firstName`}
                          component="div"
                          className="error"
                          style={{ color: 'red' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name={`familyMembers[${index}].lastName`}
                          as={TextField}
                          label="Last Name"
                          type="text"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`familyMembers[${index}].lastName`}
                          component="div"
                          className="error"
                          style={{ color: 'red' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name={`familyMembers[${index}].email`}
                          as={TextField}
                          label="Email"
                          type="email"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                        <ErrorMessage name={`familyMembers[${index}].email`} component="div" className="error" style={{ color: 'red' }} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name={`familyMembers[${index}].mobile`}
                          as={TextField}
                          label="Mobile"
                          fullWidth
                          type="text"
                          margin="normal"
                          variant="outlined"
                        />
                        <ErrorMessage name={`familyMembers[${index}].mobile`} component="div" className="error" style={{ color: 'red' }} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name={`familyMembers[${index}].dateOfBirth`}
                          as={TextField}
                          label="Date of Birth"
                          type="date"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                        <ErrorMessage
                          name={`familyMembers[${index}].dateOfBirth`}
                          component="div"
                          className="error"
                          style={{ color: 'red' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name={`familyMembers[${index}].relationship`}
                          as={TextField}
                          label="Relationship"
                          fullWidth
                          type="text"
                          margin="normal"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`familyMembers[${index}].relationship`}
                          component="div"
                          className="error"
                          style={{ color: 'red' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name={`familyMembers[${index}].city`}
                          as={TextField}
                          label="City"
                          type="text"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                        <ErrorMessage name={`familyMembers[${index}].city`} component="div" className="error" style={{ color: 'red' }} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name={`familyMembers[${index}].address`}
                          as={TextField}
                          type="text"
                          label="Address"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                        <ErrorMessage name={`familyMembers[${index}].address`} component="div" className="error" style={{ color: 'red' }} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name={`familyMembers[${index}].country`}
                          as={TextField}
                          type="text"
                          label="Country"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                        <ErrorMessage name={`familyMembers[${index}].country`} component="div" className="error" style={{ color: 'red' }} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name={`familyMembers[${index}].postalCode`}
                          as={TextField}
                          label="Postal Code"
                          type="text"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`familyMembers[${index}].postalCode`}
                          component="div"
                          className="error"
                          style={{ color: 'red' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name={`familyMembers[${index}].passportNumber`}
                          as={TextField}
                          label="Passport Number"
                          type="text"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`familyMembers[${index}].passportNumber`}
                          component="div"
                          className="error"
                          style={{ color: 'red' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name={`familyMembers[${index}].passportExpiryDate`}
                          as={TextField}
                          label="Passport Expiry Date"
                          type="date"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                        <ErrorMessage
                          name={`familyMembers[${index}].passportExpiryDate`}
                          component="div"
                          className="error"
                          style={{ color: 'red' }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Field
                          name={`familyMembers[${index}].foodPreferences`}
                          as={TextField}
                          type="text"
                          label="Food Preferences"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`familyMembers[${index}].foodPreferences`}
                          component="div"
                          className="error"
                          style={{ color: 'red' }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          style={{ marginBottom: '10px' }}
                          color="secondary"
                          size="small"
                          onClick={() => remove(index)}
                        >
                          Remove Family Member
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                  <Button variant="contained" color="primary" size="small" onClick={() => push({ ...initialValues.familyMembers[0] })}>
                    Add Family Member
                  </Button>
                </div>
              )}
            </FieldArray>
            <Button type="submit" variant="contained" color="primary" size="large" style={{ marginTop: '1rem' }}>
              {loading ? 'Loading...' : 'Submit'}
            </Button>
          </Form>
        )}
      </Formik>
      <Toaster />
    </Container>
  );
}
