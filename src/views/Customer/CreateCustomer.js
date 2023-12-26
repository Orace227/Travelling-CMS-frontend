import React from 'react';
import { Container, Typography, TextField, Button, Grid, Paper, IconButton, FormLabel } from '@mui/material';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ClearIcon from '@mui/icons-material/Clear';

const validationSchema = Yup.object().shape({
  clientId: Yup.number().required('Client ID is Required'),
  familyMembers: Yup.number().required('Number of family members is Required'),
  firstName: Yup.string().required('First Name is Required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is Required'),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile must contain exactly 10 digits')
    .required('Mobile is required'),
  dateOfBirth: Yup.date().required('Date of Birth is Required'),
  passportNumber: Yup.string().required('Passport Number is Required'),
  passportExpiryDate: Yup.date().required('Passport Expiry Date is Required'),
  frequentFlyerNumbers: Yup.array().of(
    Yup.object().shape({
      type: Yup.string().required('Frequent Flyer Type is Required'),
      number: Yup.string().required('Frequent Flyer Number is Required')
    })
  ),
  hotelLoyaltyNumbers: Yup.array().of(
    Yup.object().shape({
      type: Yup.string().required('Hotel Loyalty Type is Required'),
      number: Yup.string().required('Hotel Loyalty Number is Required')
    })
  ),
  address: Yup.string().required('Address is Required'),
  city: Yup.string().required('City is Required'),
  country: Yup.string().required('Country is Required'),
  postalCode: Yup.string()
    .required('Postal Code is Required')
    .matches(/^\d{6}$/, 'Postal Code must be a 6-digit Number'),
  foodPreferences: Yup.string(),
  companyName: Yup.string(),
  companyGSTNumber: Yup.string(),
  companyGSTEmail: Yup.string().email('Invalid Email Address'),
  bookingDetails: Yup.array().of(
    Yup.object().shape({
      bookingType: Yup.string().required('Document Type is Required'),
      bookingName: Yup.string().required('Document Name is Required'),
      docImgName: Yup.string().required('Document is Required'),
      docImg: Yup.mixed().required(' Document is Required')
    })
  )
});

function generateSixDigitNumber() {
  const min = 100000; // Smallest 6-digit number
  const max = 999999; // Largest 6-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const defaultBookingDetail = {
  bookingType: '',
  bookingName: '',
  docImgName: '',
  docImgPath: '',
  docImg: {
    key: ''
  }
};
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
  companyGSTEmail: '',
  bookingDetails: [defaultBookingDetail]
};

const CreateCustomer = () => {
  const handleSubmit = async (values) => {
    console.log(values);
    const formData = new FormData();
    // setLoading(true);
    // toast.loading('Create Booking...');
    // Filter out the booking details for the desired booking type
    const bookingTypeToImages = {};

    values.bookingDetails.forEach((bookingDetail) => {
      const bookingType = bookingDetail.bookingType;

      // If the booking type is not already in the object, initialize it as an empty array
      if (!bookingTypeToImages[bookingType]) {
        bookingTypeToImages[bookingType] = [];
      }

      // Add the image object to the array
      bookingTypeToImages[bookingType].push({
        docImg: bookingDetail.docImg
      });
    });

    const keys = Object.keys(bookingTypeToImages);

    // Using a loop to extract docImg from each object
    let paths = [];
    for (let i = 0; i < keys.length; i++) {
      // let i = 0;
      const docImgs = bookingTypeToImages[keys[i]].map((item) => item.docImg);

      formData.append('key', keys[i]);
      formData.append('clientId', values.clientId);

      // Append each image individually
      docImgs.forEach((docImg) => {
        formData.append('docImg', docImg);
      });
      console.log(formData);
      try {
        const response = await axios.post('/upload-common-doc', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(`Response for key ${keys[i]}:`, response.data.uploadedFilesPath);
        const pathsForCurrentKey = response.data.uploadedFilesPath.map((uploadedFile) => ({
          path: uploadedFile.path,
          originalname: uploadedFile.originalname
        }));
        paths.push(...pathsForCurrentKey);
      } catch (error) {
        console.error(`Error for key ${keys[i]}:`, error);
      }
      // Clear formData for the next iteration
      formData.delete('key');
      formData.delete('clientId');
      formData.delete('docImg');
    }
    console.log('paths', paths);
    console.log('values', values);

    let data = values;
    for (let i = 0; i < data.bookingDetails.length; i++) {
      const bookingDetail = data.bookingDetails[i];
      const docImgName = bookingDetail.docImgName;

      // Loop through the paths array to find a matching originalname
      for (let j = 0; j < paths.length; j++) {
        const pathObj = paths[j];
        if (pathObj.originalname === docImgName) {
          // Update the docImgPath property with the path from the paths object
          bookingDetail.docImgPath = pathObj.path;
          console.log('docImgPath', bookingDetail.docImgPath);
          break; // Stop searching once a match is found
        }
      }
    }
    try {
      await axios.post('/createClient', values);
      toast.success('Customer Created Successfully!!');
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
        {({ values, setFieldValue }) => (
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
              <Grid item xs={12}>
                <Typography variant="h3" style={{ marginTop: '10px' }}>
                  Upload Common Document
                </Typography>
                <FieldArray name="bookingDetails">
                  {({ push, remove }) => (
                    <div>
                      {values?.bookingDetails.map((_, index) => (
                        <Paper key={index} elevation={3} style={{ padding: '10px', margin: '20px' }}>
                          <IconButton
                            onClick={() => {
                              remove(index);
                              // setTotalCost(totalCos);
                              // setFieldValue(`bookingDetails.${index}.price`, 0);
                            }}
                            color="error"
                            aria-label="delete"
                          >
                            <ClearIcon />
                          </IconButton>

                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <Field
                                name={`bookingDetails.${index}.bookingType`}
                                as={TextField}
                                fullWidth
                                label="Document Type"
                                variant="outlined"
                              />
                              <ErrorMessage
                                name={`bookingDetails.${index}.bookingType`}
                                component="div"
                                className="error"
                                style={{ color: 'red' }}
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Field
                                name={`bookingDetails.${index}.bookingName`}
                                as={TextField}
                                fullWidth
                                label="Document Name"
                                variant="outlined"
                              />
                              <ErrorMessage
                                name={`bookingDetails.${index}.bookingName`}
                                component="div"
                                className="error"
                                style={{ color: 'red' }}
                              />
                            </Grid>

                            <Grid item xs={12} sm={4} style={{ marginTop: '7px' }}>
                              <input
                                id={`docImg-${index}`}
                                type="file"
                                name={`bookingDetails[${index}].docImg`}
                                onChange={(e) => {
                                  setFieldValue(`bookingDetails[${index}].docImg`, e?.currentTarget?.files[0]);
                                  setFieldValue(`bookingDetails[${index}].docImgName`, e?.currentTarget?.files[0]?.name);
                                }}
                                accept="image/*"
                                style={{ display: 'none' }}
                              />
                              <FormLabel htmlFor={`docImg-${index}`}>
                                <Button variant="outlined" component="span" fullWidth style={{ textTransform: 'none' }}>
                                  Upload Document
                                </Button>
                              </FormLabel>
                              <div>
                                {values?.bookingDetails[index]?.docImgName && (
                                  <p style={{ margin: '0', paddingTop: '8px' }}>
                                    Selected Document: {values?.bookingDetails[index]?.docImgName}
                                  </p>
                                )}
                              </div>
                              <ErrorMessage
                                name={`bookingDetails.${index}.docImgName`}
                                component="div"
                                className="error"
                                style={{ color: 'red' }}
                              />
                            </Grid>
                          </Grid>
                        </Paper>
                      ))}
                      <Button
                        type="button"
                        onClick={() => {
                          push({ bookingType: '', bookingName: '', price: '', vandor: '', docImg: '' });
                        }}
                      >
                        Add More Document
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              className="bg-blue-500 hover:bg-blue-400"
              color="primary"
              size="large"
              style={{ marginTop: '1rem' }}
            >
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
