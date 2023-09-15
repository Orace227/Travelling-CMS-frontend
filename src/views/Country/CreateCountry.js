import React from 'react';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useState } from 'react';

const validationSchema = Yup.object().shape({
  countryId: Yup.number().required('Package ID is required'),
  countryName: Yup.string().required('Package name is required')
});

const generateSixDigitNumber = () => {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const initialValues = {
  countryId: generateSixDigitNumber(),
  countryName: ''
};

const CreateCountry = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      console.log(values);
      setLoading(true);

      const createCountry = await axios.post('/CreateCountry', values);
      console.log(createCountry);
      if (createCountry) {
        toast.success('Country created successfully!!');

        setLoading(false);
        window.location.reload();
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
        {({ values }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                {/* <TextField fullWidth  variant="outlined"   /> */}
                <Field
                  name="countryId"
                  label="COuntry ID"
                  as={TextField}
                  value={values.countryId}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field name="countryName" as={TextField} label="Country Name" fullWidth margin="normal" variant="outlined" />
                <ErrorMessage name="countryName" component="div" className="error" style={{ color: 'red' }} />
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
