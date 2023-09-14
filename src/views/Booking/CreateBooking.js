import React from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  FormLabel,
  InputLabel,
  FormControl,
  MenuItem,
  Select
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
// import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';

// import axios from 'axios';

const validationSchema = Yup.object().shape({
  bookingId: Yup.number().required('Booking ID is required'),
  packageId: Yup.string()
    .required('Package ID is required')
    .matches(/^\d+$/, 'Package ID must contain only digits')
    .min(6, 'Package ID must be at least 6 digits')
    .max(6, 'Package ID must not exceed 6 digits'),
  clientId: Yup.string()
    .required('Client ID is required')
    .matches(/^\d+$/, 'Client ID must contain only digits')
    .min(6, 'Client ID must be at least 6 digits')
    .max(6, 'Client ID must not exceed 6 digits'),
  startDate: Yup.date().required('Start Date is required'),
  endDate: Yup.date().required('End Date is required'),
  modifiedPackagePrice: Yup.number().required('Modified Package Price is required'),
  bookingDetails: Yup.array().of(
    Yup.object().shape({
      bookingType: Yup.string().required('Booking Type is required'),
      bookingName: Yup.string().required('Booking Name is required'),
      docImgName: Yup.string().required('Document Name is required'),
      docImg: Yup.mixed().required('Booking Document is required')
    })
  )
});

function generateSixDigitNumber() {
  const min = 100000; // Smallest 6-digit number
  const max = 999999; // Largest 6-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// const imgSchema =;

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
  bookingId: generateSixDigitNumber(),
  packageId: '',
  clientId: '',
  startDate: '',
  endDate: '',
  modifiedPackagePrice: '',
  bookingDetails: [defaultBookingDetail]
};

const CreateBooking = () => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [Packages, setPackages] = useState([]);

  const handleSubmit = async (values) => {
    const formData = new FormData();
    setLoading(true);
    toast.loading('Create Booking...');
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

      try {
        const response = await axios.post('/upload-images', formData, {
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
    console.log('data', data);

    try {
      const createdBooking = await axios.post('createBooking', data);

      if (createdBooking) {
        setLoading(false);
        window.location.reload();
        window.location.href = 'http://localhost:3000/Bookings';
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const fetchClientInfo = async () => {
    const allClients = await axios.get('/getclients');
    if (allClients) {
      let clientIDS = [];
      for (let i = 0; i < allClients.data.allClients.length; i++) {
        // console.log(allClients.data.allClients[i].clientId);
        clientIDS.push(allClients.data.allClients[i].clientId);
      }
      // console.log(clientIDS);
      setClients(clientIDS);
      // console.log(clients);
    }
  };

  const fetchPackageInfo = async () => {
    const getLivePackages = await axios.get('/getLivePackages');
    const getDraftPackages = await axios.get('/getDraftPackages');

    if (getLivePackages && getDraftPackages) {
      let packageIDS = [];
      for (let i = 0; i < getLivePackages.data.allPackages.length; i++) {
        if (getLivePackages.data.allPackages[i].isLive) {
          let packageIdName = `${getLivePackages.data.allPackages[i].PackageId} - Live`;
          packageIDS.push({ packageId: getLivePackages.data.allPackages[i].PackageId, packageIdName: packageIdName });
        }
      }
      for (let i = 0; i < getDraftPackages.data.allPackages.length; i++) {
        let packageIdName = `${getDraftPackages.data.allPackages[i].PackageId} - Draft`;

        packageIDS.push({
          packageId: getDraftPackages.data.allPackages[i].PackageId,
          packageIdName: packageIdName
        });
      }

      console.log(packageIDS);
      setPackages(packageIDS);
    }
  };

  useEffect(() => {
    fetchPackageInfo();
    fetchClientInfo();
  }, []);
  return (
    <Container>
      <Typography variant="h2" style={{ marginBottom: '15px' }} gutterBottom>
        Create Booking
      </Typography>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth name="bookingId" label="Booking ID" variant="outlined" value={values.bookingId} disabled />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="packageId">Package ID</InputLabel>
                  <Field as={Select} label="Package ID" name="packageId" variant="outlined">
                    {Packages.map((option) => (
                      <MenuItem key={option.packageId} value={option.packageId}>
                        {option.packageIdName}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
                <ErrorMessage name="packageId" component="div" className="error" style={{ color: 'red' }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="clientId">Client ID</InputLabel>
                  <Field as={Select} label="Client ID" name="clientId" variant="outlined">
                    {clients.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
                <ErrorMessage name="clientId" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="startDate"
                  label="Start Date"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                <ErrorMessage name="startDate" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="endDate"
                  label="End Date"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                <ErrorMessage name="endDate" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field fullWidth as={TextField} name="modifiedPackagePrice" label="Modified Package Price" variant="outlined" />
                <ErrorMessage name="modifiedPackagePrice" style={{ color: 'red' }} component="div" className="error" />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h3" style={{ marginTop: '10px' }}>
                  Booking Details
                </Typography>
                <FieldArray name="bookingDetails">
                  {({ push, remove }) => (
                    <div>
                      {values?.bookingDetails.map((_, index) => (
                        <Paper key={index} elevation={3} style={{ padding: '10px', margin: '20px' }}>
                          <IconButton onClick={() => remove(index)} color="error" aria-label="delete">
                            <ClearIcon />
                          </IconButton>

                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <Field
                                name={`bookingDetails.${index}.bookingType`}
                                as={TextField}
                                fullWidth
                                label="Booking Type"
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
                                label="Booking Name"
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
                                name={`bookingDetails.${index}.docImg`}
                                component="div"
                                className="error"
                                style={{ color: 'red' }}
                              />
                            </Grid>
                          </Grid>
                        </Paper>
                      ))}
                      <Button type="button" onClick={() => push({ bookingType: '', bookingName: '', docImg: '' })}>
                        Add Booking Detail
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit">
                  {loading ? 'loading...' : 'Submit'}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
      <Toaster />
    </Container>
  );
};

export default CreateBooking;
