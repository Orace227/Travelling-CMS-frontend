import React from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';

// Define your Yup validation schema
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  mobile: Yup.string().required('Mobile number is required'),
  dateOfBirth: Yup.date().nullable().required('Date of Birth is required'),
  relationship: Yup.string().required('Relationship is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  country: Yup.string().required('Country is required'),
  postalCode: Yup.string().required('Postal Code is required'),
  passportExpiryDate: Yup.date().nullable().required('Passport Expiry Date is required'),
  passportNumber: Yup.string().required('Passport Number is required'),
  foodPreferences: Yup.string()
  // frequentFlyerNumbers: Yup.array().of(Yup.string())
});

export default function CreateFamilyMembers() {
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

  const handleSubmit = async (values) => {
    console.log(values);
    // for (let i = 0; i < values.length; i++) {
    // values.FamilyMemberId = generateSixDigitNumber();
    // }
    const newFamilyMember = {
      FamilyMemberId: generateSixDigitNumber(),
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      mobile: values.mobile,
      dateOfBirth: values.dateOfBirth,
      relationship: values.relationship,
      address: values.address,
      city: values.city,
      country: values.country,
      postalCode: values.postalCode,
      passportNumber: values.passportNumber,
      passportExpiryDate: values.passportExpiryDate,
      foodPreferences: values.foodPreferences
    };

    const updatedFamilyMembers = [...values.familyMembers, newFamilyMember];

    // Now you have all family members in one array
    console.log(updatedFamilyMembers);

    // console.log(values);
    // const FamilyMembersArr = await values.familyMembers;
    // console.log(FamilyMembersArr);
    // const createFamilyMembers = await axios.post('/createFamilyMembers', { FamilyMembersArr });
    // if (createFamilyMembers) {
    // toast.success('Family members added successfully!!');
    // window.location.href = `/familyMembers?clientId=${FamilyMembersArr.clientId}`;
    // window.location.reload();
    // }
  };

  const initialValues = {
    clientId: getClientId(),
    familyMembers: [] // Initialize as an empty array
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
                        <Field name="firstName" as={TextField} label="first Name" fullWidth margin="normal" variant="outlined" />
                        <ErrorMessage name="firstName" component="div" className="error" style={{ color: 'red' }} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field name="lastName" as={TextField} label="last Name" fullWidth margin="normal" variant="outlined" />
                        <ErrorMessage name="lastName" component="div" className="error" style={{ color: 'red' }} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field name="email" as={TextField} label="email" fullWidth margin="normal" variant="outlined" />
                        <ErrorMessage name="email" component="div" className="error" style={{ color: 'red' }} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field name="mobile" as={TextField} label="mobile" fullWidth margin="normal" variant="outlined" />
                        <ErrorMessage name="mobile" component="div" className="error" style={{ color: 'red' }} />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Field
                          name="dateOfBirth"
                          as={TextField}
                          label="date Of Birth"
                          type="date"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                        <ErrorMessage name="dateOfBirth" component="div" className="error" style={{ color: 'red' }} />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Field name="relationship" as={TextField} label="relationship" fullWidth margin="normal" variant="outlined" />
                        <ErrorMessage name="relationship" component="div" className="error" style={{ color: 'red' }} />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Field name="city" as={TextField} label="city" fullWidth margin="normal" variant="outlined" />
                        <ErrorMessage name="city" component="div" className="error" style={{ color: 'red' }} />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Field name="address" as={TextField} label="address" fullWidth margin="normal" variant="outlined" />
                        <ErrorMessage name="address" component="div" className="error" style={{ color: 'red' }} />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Field name="country" as={TextField} label="country" fullWidth margin="normal" variant="outlined" />
                        <ErrorMessage name="country" component="div" className="error" style={{ color: 'red' }} />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Field name="postalCode" as={TextField} label="postal Code" fullWidth margin="normal" variant="outlined" />
                        <ErrorMessage name="postalCode" component="div" className="error" style={{ color: 'red' }} />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Field name="passportNumber" as={TextField} label="passport Number" fullWidth margin="normal" variant="outlined" />
                        <ErrorMessage name="passportNumber" component="div" className="error" style={{ color: 'red' }} />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Field
                          name="passportExpiryDate"
                          as={TextField}
                          label="passport Expiry Date"
                          type="date"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                        <ErrorMessage name="passportExpiryDate" component="div" className="error" style={{ color: 'red' }} />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Field
                          name="foodPreferences"
                          as={TextField}
                          label="food Preferences"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                        <ErrorMessage name="foodPreferences" component="div" className="error" style={{ color: 'red' }} />
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
                  <Button variant="contained" color="primary" size="small" onClick={() => push(initialValues.familyMembers)}>
                    Add Family Member
                  </Button>
                </div>
              )}
            </FieldArray>
            <Button type="submit" variant="contained" color="primary" size="large" style={{ marginTop: '1rem' }}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
      <Toaster />
    </Container>
  );
}
