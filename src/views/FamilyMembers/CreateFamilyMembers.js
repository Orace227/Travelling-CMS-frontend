import React from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Button, Container, Grid, TextField, Typography, Paper, IconButton, FormLabel } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';

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
      foodPreferences: Yup.string(),
      bookingDetails: Yup.array().of(
        Yup.object().shape({
          bookingType: Yup.string().required('Document Type is Required'),
          bookingName: Yup.string().required('Document Name is Required'),
          docImgName: Yup.string().required('Document is Required'),
          docImg: Yup.mixed().required('Document is Required')
        })
      )
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

  const handleSubmit = async (values) => {
    try {
      // Set loading state and show a loading message
      console.log(values);
      setLoading(true);
      toast.loading('Uploading documents...');

      // Generate FamilyMemberIds for each family member
      values.familyMembers.forEach((familyMember) => {
        familyMember.FamilyMemberId = generateSixDigitNumber();
      });

      const paths = await uploadDocuments(values);

      if (paths) {
        // Documents uploaded successfully, now update the document paths in the original object
        for (const familyMember of values.familyMembers) {
          familyMember.bookingDetails.forEach((bookingDetail) => {
            const docImgName = bookingDetail.docImgName;
            const matchingPath = paths.find((pathObj) => pathObj.originalname === docImgName);
            if (matchingPath) {
              bookingDetail.docImgPath = matchingPath.path;
            }
          });
        }

        // Clear loading state
        setLoading(false);

        // After uploading documents and updating docImgPath, create family members
        toast.loading('Creating family members...');

        const FamilyMembersArr = values.familyMembers.map((familyMember) => ({
          ...familyMember
        }));

        const familyMembersResponse = await axios.post('/createFamilyMembers', { FamilyMembersArr });

        if (!familyMembersResponse.data) {
          // Handle the case when creating family members fails
          toast.error('Failed to create family members');
        } else {
          toast.success('Family members and documents were successfully created!');
          window.location.reload();
        }
      } else {
        // Handle the case when document upload fails
        toast.error('Failed to upload documents');
      }
    } catch (error) {
      console.error('Error:', error);
      // Clear loading state and show an error message
      setLoading(false);
      toast.error('Failed to upload documents and create family members');
      // window.location.reload();
    }
  };

  const uploadDocuments = async (values) => {
    const paths = [];

    // An array to store promises for each document upload
    const uploadPromises = [];

    for (const familyMember of values.familyMembers) {
      const bookingTypeToImages = {};

      familyMember.bookingDetails.forEach((bookingDetail) => {
        const bookingType = bookingDetail.bookingType;

        if (!bookingTypeToImages[bookingType]) {
          bookingTypeToImages[bookingType] = [];
        }

        bookingTypeToImages[bookingType].push({
          docImg: bookingDetail.docImg
        });
      });

      const keys = Object.keys(bookingTypeToImages);

      for (let i = 0; i < keys.length; i++) {
        const docImgs = bookingTypeToImages[keys[i]].map((item) => item.docImg);

        const formData = new FormData();
        formData.append('key', keys[i]);
        formData.append('clientId', `${familyMember.clientId}_${familyMember.FamilyMemberId}`);

        docImgs.forEach((docImg) => {
          formData.append('docImg', docImg);
        });

        // Create a promise for each document upload
        const uploadPromise = axios.post('/upload-common-doc', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        uploadPromises.push(uploadPromise);
      }
    }

    // Wait for all document uploads to complete
    const responses = await Promise.all(uploadPromises);

    for (const response of responses) {
      const pathsForCurrentKey = response.data.uploadedFilesPath.map((uploadedFile) => ({
        path: uploadedFile.path,
        originalname: uploadedFile.originalname
      }));

      paths.push(...pathsForCurrentKey);
    }

    return paths;
  };

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
        foodPreferences: '',
        bookingDetails: [defaultBookingDetail]
      }
    ]
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Create Family Members
      </Typography>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => (
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
                        <Typography variant="h3" style={{ marginTop: '10px' }}>
                          Upload Common Document
                        </Typography>
                        <FieldArray name={`familyMembers[${index}].bookingDetails`}>
                          {({ push: pushDocument, remove: removeDocument }) => (
                            <div>
                              {familyMember.bookingDetails.map((document, docIndex) => (
                                <Paper key={docIndex} elevation={3} style={{ padding: '10px', margin: '20px' }}>
                                  <IconButton
                                    onClick={() => {
                                      removeDocument(docIndex);
                                    }}
                                    color="error"
                                    aria-label="delete"
                                  >
                                    <ClearIcon />
                                  </IconButton>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                      <Field
                                        name={`familyMembers[${index}].bookingDetails[${docIndex}].bookingType`}
                                        as={TextField}
                                        fullWidth
                                        label="Document Type"
                                        variant="outlined"
                                      />
                                      <ErrorMessage
                                        name={`familyMembers[${index}].bookingDetails[${docIndex}].bookingType`}
                                        component="div"
                                        className="error"
                                        style={{ color: 'red' }}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                      <Field
                                        name={`familyMembers[${index}].bookingDetails[${docIndex}].bookingName`}
                                        as={TextField}
                                        fullWidth
                                        label="Document Name"
                                        variant="outlined"
                                      />
                                      <ErrorMessage
                                        name={`familyMembers[${index}].bookingDetails[${docIndex}].bookingName`}
                                        component="div"
                                        className="error"
                                        style={{ color: 'red' }}
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={4} style={{ marginTop: '7px' }}>
                                      <input
                                        id={`docImg-${index}-${docIndex}`}
                                        type="file"
                                        name={`familyMembers[${index}].bookingDetails[${docIndex}].docImg`}
                                        onChange={(e) => {
                                          setFieldValue(
                                            `familyMembers[${index}].bookingDetails[${docIndex}].docImg`,
                                            e.currentTarget.files[0]
                                          );
                                          setFieldValue(
                                            `familyMembers[${index}].bookingDetails[${docIndex}].docImgName`,
                                            e.currentTarget.files[0]?.name
                                          );
                                        }}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                      />
                                      <FormLabel htmlFor={`docImg-${index}-${docIndex}`}>
                                        <Button variant="outlined" component="span" fullWidth style={{ textTransform: 'none' }}>
                                          Upload Document
                                        </Button>
                                      </FormLabel>
                                      <div>
                                        {document.docImgName && (
                                          <p style={{ margin: '0', paddingTop: '8px' }}>Selected Document: {document.docImgName}</p>
                                        )}
                                      </div>
                                      <ErrorMessage
                                        name={`familyMembers[${index}].bookingDetails[${docIndex}].docImgName`}
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
                                  pushDocument({ ...defaultBookingDetail });
                                }}
                              >
                                Add More Document
                              </Button>
                            </div>
                          )}
                        </FieldArray>
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
