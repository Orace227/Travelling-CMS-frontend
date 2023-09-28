import React from 'react';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const validationSchema = Yup.object().shape({
  clientId: Yup.number().required('Client ID is required'),
  familyMembers: Yup.number().required('Number of family members is required'),
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile must contain exactly 10 digits')
    .required('Mobile is required'),
  dateOfBirth: Yup.date().required('Date of Birth is required'),
  passportNumber: Yup.string().required('Passport Number is required'),
  passportExpiryDate: Yup.date().required('Passport Expiry Date is required'),
  frequentFlyerNumbers: Yup.array().of(
    Yup.object().shape({
      type: Yup.string().required('Frequent Flyer Type is required'),
      number: Yup.string().required('Frequent Flyer Number is required')
    })
  ),
  hotelLoyaltyNumbers: Yup.array().of(
    Yup.object().shape({
      type: Yup.string().required('Hotel Loyalty Type is required'),
      number: Yup.string().required('Hotel Loyalty Number is required')
    })
  ),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  country: Yup.string().required('Country is required'),
  postalCode: Yup.string()
    .required('Postal Code is required')
    .matches(/^\d{6}$/, 'Postal Code must be a 6-digit number'),
  foodPreferences: Yup.string(),
  companyName: Yup.string(),
  companyGSTNumber: Yup.string(),
  companyGSTEmail: Yup.string().email('Invalid email address')
});

function generateSixDigitNumber() {
  const min = 100000; // Smallest 6-digit number
  const max = 999999; // Largest 6-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const initialValues = {
  clientId: generateSixDigitNumber(),
  familyMembers: 0,
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  dateOfBirth: '',
  passportNumber: '',
  passportExpiryDate: '',
  frequentFlyerNumbers: [{ type: '', number: '' }],
  hotelLoyaltyNumbers: [{ type: '', number: '' }],
  address: '',
  city: '',
  country: '',
  postalCode: '',
  foodPreferences: '',
  companyName: '',
  companyGSTNumber: '',
  companyGSTEmail: ''
};

const CreateCustomer = () => {
  const handleSubmit = async (values) => {
    // console.log(values);
    try {
      await axios.post('/createClient', values);
      toast.success('Customer created Successfully!!');
      window.location.reload();
    } catch (err) {
      toast.success({ error: err });
    }
  };

  const handleMobileKeyPress = (event) => {
    // Prevent non-numeric characters
    if (!/^\d+$/.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Customer Information
      </Typography>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Field name="firstName" as={TextField} label="First Name" fullWidth margin="normal" variant="outlined" />
                <ErrorMessage name="firstName" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field name="lastName" as={TextField} label="Last Name" fullWidth margin="normal" variant="outlined" />
                <ErrorMessage name="lastName" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field name="email" as={TextField} label="Email" fullWidth margin="normal" variant="outlined" />
                <ErrorMessage name="email" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="mobile"
                  as={TextField}
                  label="Mobile"
                  type="text"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  inputProps={{
                    inputMode: 'numeric',
                    maxLength: 10 // Add maximum length attribute
                  }}
                  onKeyPress={handleMobileKeyPress}
                />
                <ErrorMessage name="mobile" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="dateOfBirth"
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
                <ErrorMessage name="dateOfBirth" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field name="passportNumber" as={TextField} label="Passport Number" fullWidth margin="normal" variant="outlined" />
                <ErrorMessage name="passportNumber" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="passportExpiryDate"
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
                <ErrorMessage name="passportExpiryDate" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                  Frequent Flyer Numbers
                </Typography>
                <FieldArray name="frequentFlyerNumbers">
                  {({ push, remove }) => (
                    <div>
                      {values.frequentFlyerNumbers.map((ffNumber, index) => (
                        <div key={index}>
                          <Field
                            name={`frequentFlyerNumbers[${index}].type`}
                            as={TextField}
                            label="Frequent Flyer Type"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`frequentFlyerNumbers[${index}].type`}
                            component="div"
                            className="error"
                            style={{ color: 'red' }}
                          />
                          <Field
                            name={`frequentFlyerNumbers[${index}].number`}
                            as={TextField}
                            label="Frequent Flyer Number"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`frequentFlyerNumbers[${index}].number`}
                            component="div"
                            className="error"
                            style={{ color: 'red' }}
                          />
                          <Button type="button" variant="outlined" color="secondary" onClick={() => remove(index)}>
                            Remove Frequent Flyer
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outlined" style={{ marginTop: '10px' }} onClick={() => push({ type: '', number: '' })}>
                        Add Frequent Flyer
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                  Hotel Loyalty Numbers
                </Typography>
                <FieldArray name="hotelLoyaltyNumbers">
                  {({ push, remove }) => (
                    <div>
                      {values.hotelLoyaltyNumbers.map((hlNumber, index) => (
                        <div key={index}>
                          <Field
                            name={`hotelLoyaltyNumbers[${index}].type`}
                            as={TextField}
                            label="Hotel Loyalty Type"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`hotelLoyaltyNumbers[${index}].type`}
                            component="div"
                            className="error"
                            style={{ color: 'red' }}
                          />
                          <Field
                            name={`hotelLoyaltyNumbers[${index}].number`}
                            as={TextField}
                            label="Hotel Loyalty Number"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`hotelLoyaltyNumbers[${index}].number`}
                            component="div"
                            className="error"
                            style={{ color: 'red' }}
                          />
                          <Button type="button" variant="outlined" color="secondary" onClick={() => remove(index)}>
                            Remove Hotel Loyalty
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outlined" style={{ marginTop: '10px' }} onClick={() => push({ type: '', number: '' })}>
                        Add Hotel Loyalty
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </Grid>
              <Grid item xs={12}>
                <Field name="address" as={TextField} label="Address" fullWidth margin="normal" variant="outlined" />
                <ErrorMessage name="address" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12}>
                <Field name="city" as={TextField} label="City" fullWidth margin="normal" variant="outlined" />
                <ErrorMessage name="city" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12}>
                <Field name="country" as={TextField} label="Country" fullWidth margin="normal" variant="outlined" />
                <ErrorMessage name="country" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12}>
                <Field name="postalCode" as={TextField} label="Postal Code" fullWidth margin="normal" variant="outlined" />
                <ErrorMessage name="postalCode" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12}>
                <Field name="foodPreferences" as={TextField} label="Food Preferences" fullWidth margin="normal" variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <Field name="companyName" as={TextField} label="Company Name" fullWidth margin="normal" variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <Field name="companyGSTNumber" as={TextField} label="Company GST Number" fullWidth margin="normal" variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <Field name="companyGSTEmail" as={TextField} label="Company GST Email" fullWidth margin="normal" variant="outlined" />
                <ErrorMessage name="companyGSTEmail" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" color="primary" size="large" style={{ marginTop: '1rem' }}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
      <Toaster />
    </Container>
  );
};

export default CreateCustomer;
