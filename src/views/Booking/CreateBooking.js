import React from 'react';
import { Container, Typography, TextField, Button, Grid, Paper, IconButton, FormLabel, Autocomplete } from '@mui/material';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
// import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
// import axios from 'axios';

function generateSixDigitNumber() {
  const min = 100000; // Smallest 6-digit number
  const max = 999999; // Largest 6-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// const imgSchema =;

const defaultBookingDetail = {
  bookingType: '',
  bookingName: '',
  price: '',
  vandor: '',
  docImgName: '',
  docImgPath: '',
  docImg: {
    key: ''
  }
};

const CreateBooking = () => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [Packages, setPackages] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [MPPrice, setMPPrice] = useState(0);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isToastVisible1, setIsToastVisible1] = useState(false);

  const handleClientChange = (_, newValue, setFieldValue) => {
    // When a client is selected, update the clientId field with the client ID
    if (newValue) {
      setFieldValue('clientId', newValue.clientId);
      setSelectedClient(newValue);
    } else {
      setFieldValue('clientId', ''); // Clear the clientId field if nothing is selected
      setSelectedClient(null);
    }
  };

  // Function to handle package change
  const handlePackageChange = (_, newValue, setFieldValue) => {
    // When a package is selected, update the packageId field with the package ID
    if (newValue) {
      setFieldValue('packageId', newValue.packageId);
      setSelectedPackage(newValue);
    } else {
      setFieldValue('packageId', ''); // Clear the packageId field if nothing is selected
      setSelectedPackage(null);
    }
  };

  // Custom filtering function to filter clients based on input value
  const filterClientOptions = (options, { inputValue }) => {
    return options.filter((option) => option.name.toLowerCase().includes(inputValue.toLowerCase()));
  };
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
    values.totalCost = totalCost;
    values.modifiedPackagePrice = MPPrice;
    console.log('data', data);
    // Calculate the total price of all booking details

    try {
      console.log('this is last:', values);
      const createdBooking = await axios.post('/createBooking', data);

      if (createdBooking) {
        setLoading(false);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };
  function calculate5Percent(number) {
    // Calculate 5% of the number
    const result = 0.05 * number;
    return result;
  }
  // Custom validation function

  const initialValues = {
    bookingId: generateSixDigitNumber(),
    packageId: '',
    clientId: '',
    totalCost: 0,
    startDate: '',
    endDate: '',
    modifiedPackagePrice: MPPrice,
    bookingDetails: [defaultBookingDetail]
  };
  const validationSchema = Yup.object().shape({
    bookingId: Yup.number().required('Booking ID is Required'),
    packageId: Yup.string()
      .required('Package ID is Required')
      .matches(/^\d+$/, 'Package ID must contain only digits')
      .min(6, 'Package ID must be at least 6 digits')
      .max(6, 'Package ID must not exceed 6 digits'),
    clientId: Yup.string().required('Client Name is Required'),
    startDate: Yup.date().required('Start Date is Required'),
    endDate: Yup.date().required('End Date is Required'),
    modifiedPackagePrice: Yup.number()
      .required('Modified Package Price is Required')
      .test('is-valid-price', `Modified Price must be ${minValidPrice()} or more`, function () {
        // const TotalCost = totalCost || 0; // Get the total cost from the form values

        const minValidPrice = totalCost * 1.05; // Calculate 5% of the total cost
        // console.log('minvalidvalue', minValidPrice, 'total cost', MPPrice);
        return MPPrice >= minValidPrice;
      }),
    bookingDetails: Yup.array().of(
      Yup.object().shape({
        bookingType: Yup.string().required('Booking Type is Required'),
        bookingName: Yup.string().required('Booking Name is Required'),
        price: Yup.number().required('Price is Required'),
        vandor: Yup.string().required('Vandor is Required'),
        docImgName: Yup.string().required('Document is Required'),
        docImg: Yup.mixed().required('Booking Document is Required')
      })
    )
  });
  function minValidPrice() {
    let fivePercent = calculate5Percent(totalCost);
    let requiredCost = totalCost + fivePercent;
    // let minval = requiredCost - MPPrice;
    return requiredCost;
  }

  console.log('this value is to required', minValidPrice());
  const fetchClients = async () => {
    try {
      const response = await axios.get('/getclients');
      const allClientsData = response.data.allClients;

      // Map the client data to an array of client objects
      const clientObjects = allClientsData.map((item) => ({
        clientId: item.clientId,
        name: `${item.firstName} ${item.lastName}`
      }));

      // Set the clients state with the array of client objects
      setClients(clientObjects);

      console.log('clientObjects', clientObjects);
    } catch (error) {
      console.error('Error fetching clients:', error);
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
      // console.log(clients);
      setPackages(packageIDS);
    }
  };
  // console.log('clients:', clients);

  useEffect(() => {
    fetchPackageInfo();
    fetchClients();
  }, []);

  const handleTotalPrice = (e, index, values) => {
    const newPrice = parseInt(e.target.value, 10) || 0;

    // Update the price for the specific booking detail at the given index
    const updatedBookingDetails = [...values.bookingDetails];
    updatedBookingDetails[index].price = newPrice;

    // Calculate the total price by summing up the prices of all booking details
    const bookingDetailsPrice = updatedBookingDetails.reduce((total, bookingDetail) => {
      return total + (parseInt(bookingDetail.price, 10) || 0);
    }, 0);

    // Update the total cost
    setTotalCost(bookingDetailsPrice);

    // Update the booking details in the form values
    values.bookingDetails = updatedBookingDetails; // Update the booking details array

    // Update the total cost when booking details are removed
    const originalBookingDetails = [...values.bookingDetails];
    const removedBookingDetail = originalBookingDetails[index];
    const removedPrice = parseInt(removedBookingDetail.price, 10) || 0;

    // Check if the user deleted a booking detail (price is zero)
    if (removedPrice === 0) {
      // Subtract the price of the removed booking detail from the total cost
      setTotalCost((prevTotal) => prevTotal - removedBookingDetail.price);
    }
  };

  function handleModifiedPrice(e) {
    let fivePercent = calculate5Percent(totalCost);
    setMPPrice(e.target.value);
    let recommndedPrice = fivePercent + totalCost;
    console.log('recommndedPrice', recommndedPrice);

    if (e.target.value >= recommndedPrice) {
      console.log('price is correct', fivePercent);
      if (!isToastVisible1) {
        toast.success(`Modified Package Price is Correct!!`);
        setIsToastVisible1(true);
      }
    } else {
      console.log('price is not correct', fivePercent);
      if (!isToastVisible) {
        toast.error(`Modified Package Price is not correct please add more`);
        setIsToastVisible(true);
      }
    }
  }

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
                <Autocomplete
                  id="packageId"
                  options={Packages}
                  getOptionLabel={(option) => option.packageIdName}
                  value={selectedPackage}
                  onChange={(_, newValue) => handlePackageChange(_, newValue, setFieldValue)}
                  renderInput={(params) => <Field {...params} as={TextField} label="Select Package" name="packageId" variant="outlined" />}
                />
                <ErrorMessage name="packageId" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid xs={12} sm={6}>
                <Autocomplete
                  style={{ paddingLeft: '15px' }}
                  id="clientId"
                  options={clients}
                  getOptionLabel={(option) => option.name}
                  filterOptions={filterClientOptions}
                  value={selectedClient}
                  onChange={(_, newValue) => handleClientChange(_, newValue, setFieldValue)}
                  renderInput={(params) => (
                    <Field {...params} as={TextField} label="Select Client" name="clientId" variant="outlined" margin="normal" />
                  )}
                />
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
                <Field
                  fullWidth
                  as={TextField}
                  value={MPPrice}
                  name="modifiedPackagePrice"
                  onChange={handleModifiedPrice}
                  label="Modified Package Price"
                  variant="outlined"
                />
                <ErrorMessage name="modifiedPackagePrice" style={{ color: 'red' }} component="div" className="error" />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  fullWidth
                  as={TextField}
                  name="totalCost"
                  label="Total Cost"
                  variant="outlined"
                  value={totalCost} // Bind the value to the totalCost state variable
                  disabled
                />
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
                            <Grid item xs={12} md={4}>
                              <Field
                                name={`bookingDetails.${index}.price`}
                                onBlur={(e) => {
                                  handleTotalPrice(e, index, values); // Call the function when the input field loses focus
                                }}
                                as={TextField}
                                fullWidth
                                label="Price"
                                variant="outlined"
                              />
                              <ErrorMessage
                                name={`bookingDetails.${index}.price`}
                                component="div"
                                className="error"
                                style={{ color: 'red' }}
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Field name={`bookingDetails.${index}.vandor`} as={TextField} fullWidth label="Vandor" variant="outlined" />
                              <ErrorMessage
                                name={`bookingDetails.${index}.vandor`}
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
