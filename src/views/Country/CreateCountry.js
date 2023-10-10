import React from 'react';
import { Container, Typography, TextField, Button, Grid, FormLabel } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useState } from 'react';

const validationSchema = Yup.object().shape({
  countryId: Yup.number().required('Package ID is Required'),
  countryName: Yup.string().required('Package Name is Required'),
  continent: Yup.string().required('Select Country Name'),
  countryImgName: Yup.string().required('Country Image is Required')
});

const generateSixDigitNumber = () => {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const initialValues = {
  countryId: generateSixDigitNumber(),
  countryName: '',
  continent: '',
  countryImgName: '',
  countryImgPath: '',
  countryImg: {} // Use null for file uploads
};

const CreateCountry = () => {
  const [loading, setLoading] = useState(false);

  let [Country, setCountry] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('');

  const continents = {
    'North America': ['usa', 'canada', 'mexico'],
    'South America': ['brazil', 'argentina'],
    Europe: ['uk', 'germany', 'france', 'italy', 'spain', 'russia', 'turkey'],
    Australia: ['australia', 'new zealand'],
    Asia: ['china', 'india', 'japan', 'south korea', 'saudi arabia', 'kazakhstan', 'iran', 'iraq', 'uae', 'qatar', 'pakistan'],
    Africa: ['south africa', 'egypt', 'kenya', 'nigeria']
  };

  const getContinentForCountry = () => {
    Country = Country.toLowerCase(); // Convert Country name to lowercase
    for (const [continent, countries] of Object.entries(continents)) {
      if (countries.includes(Country)) {
        return continent;
      }
    }
    return ''; // Return an empty string if no match is found
  };

  const handleContinent = async (setFieldValue) => {
    const continent = getContinentForCountry(Country);
    setSelectedContinent(continent);
    setFieldValue('continent', continent);
    console.log(continent);
    console.log(selectedContinent);
  };

  const handleSubmit = async (values) => {
    try {
      console.log('intial value', values);

      setLoading(true);
      const formData = new FormData();
      formData.append('countryImg', values.countryImg);
      const uploadedImg = await axios.post('/uploadCountryImg', formData);
      console.log(uploadedImg);
      values.countryImgPath = uploadedImg.data.path;
      console.log('img path edded', values);

      if (uploadedImg) {
        const createCountry = await axios.post('/CreateCountry', values);
        console.log(createCountry);
        if (createCountry) {
          toast.success('Country Created Successfully!!');

          setLoading(false);
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
      if (error.response.status == 403) {
        toast.error('Country was already uploaded!!');
      }
      if (error.response.status == 500) {
        toast.error('Some arror occurred!!');
      }
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Add Country
      </Typography>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                {/* <TextField fullWidth  variant="outlined"   /> */}
                <Field
                  name="countryId"
                  label="Country ID"
                  as={TextField}
                  value={values.countryId}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="countryName"
                  value={Country}
                  onChange={async (e) => {
                    setCountry(e.target.value);
                    // handleContinent();
                    setFieldValue('countryName', e.target.value);
                  }}
                  as={TextField}
                  label="Country Name"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleContinent(setFieldValue);
                  }}
                >
                  Get Continent
                </Button>
                <ErrorMessage name="countryName" component="div" className="error" style={{ color: 'red', marginTop: '20px' }} />
              </Grid>

              <Grid item xs={12} sm={6} style={{ marginTop: '15px' }}>
                <Field
                  name="continent"
                  as={TextField}
                  label="Select Continent"
                  fullWidth
                  value={selectedContinent} // Set the selectedContinent as the initial value
                />
                <ErrorMessage name="continent" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12} sm={6} style={{ marginTop: '24px' }}>
                <input
                  id="countryImg"
                  name="countryImg"
                  type="file"
                  onChange={(e) => {
                    setFieldValue('countryImg', e.currentTarget.files[0]);
                    setFieldValue('countryImgName', e.currentTarget.files[0].name);
                  }}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <FormLabel htmlFor="countryImg">
                  <Button variant="outlined" component="span" fullWidth style={{ textTransform: 'none' }}>
                    Upload Country Image
                  </Button>
                </FormLabel>
                <div>
                  {values.countryImgName && <p style={{ margin: '0', paddingTop: '8px' }}>Selected Image: {values.countryImgName}</p>}
                </div>
                <ErrorMessage name="countryImgName" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              style={{ marginTop: '1rem', marginLeft: '10px' }}
              disabled={loading} // Disable the button when loading is true
            >
              {loading ? 'Loading...' : 'Submit'}
            </Button>
          </Form>
        )}
      </Formik>
      <Toaster />
    </Container>
  );
};

export default CreateCountry;
