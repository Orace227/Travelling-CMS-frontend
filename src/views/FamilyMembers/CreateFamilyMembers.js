import React from 'react';
// ... (import statements for dependencies)

import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const FamilyMemberForm = ({ index, remove }) => (
  <div key={index}>
    <Typography variant="h5" gutterBottom>
      Family Member {index + 1}
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Field name={`familyMembers[${index}].firstName`} as={TextField} label="First Name" fullWidth margin="normal" variant="outlined" />
        <ErrorMessage name={`familyMembers[${index}].firstName`} component="div" className="error" style={{ color: 'red' }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Field name={`familyMembers[${index}].lastName`} as={TextField} label="Last Name" fullWidth margin="normal" variant="outlined" />
        <ErrorMessage name={`familyMembers[${index}].lastName`} component="div" className="error" style={{ color: 'red' }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Field name={`familyMembers[${index}].email`} as={TextField} label="Email" fullWidth margin="normal" variant="outlined" />
        <ErrorMessage name={`familyMembers[${index}].email`} component="div" className="error" style={{ color: 'red' }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Field name={`familyMembers[${index}].mobile`} as={TextField} label="Mobile" fullWidth margin="normal" variant="outlined" />
        <ErrorMessage name={`familyMembers[${index}].mobile`} component="div" className="error" style={{ color: 'red' }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Field
          name={`familyMembers[${index}].dateOfBirth`}
          as={TextField}
          label="date Of Birth"
          fullWidth
          margin="normal"
          variant="outlined"
          type="date"
          InputLabelProps={{
            shrink: true
          }}
        />
        <ErrorMessage name={`familyMembers[${index}].dateOfBirth`} component="div" className="error" style={{ color: 'red' }} />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Field
          name={`familyMembers[${index}].relationship`}
          as={TextField}
          label="relationship"
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <ErrorMessage name={`familyMembers[${index}].relationship`} component="div" className="error" style={{ color: 'red' }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Field name={`familyMembers[${index}].city`} as={TextField} label="city" fullWidth margin="normal" variant="outlined" />
        <ErrorMessage name={`familyMembers[${index}].city`} component="div" className="error" style={{ color: 'red' }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Field name={`familyMembers[${index}].address`} as={TextField} label="address" fullWidth margin="normal" variant="outlined" />
        <ErrorMessage name={`familyMembers[${index}].address`} component="div" className="error" style={{ color: 'red' }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Field name={`familyMembers[${index}].country`} as={TextField} label="country" fullWidth margin="normal" variant="outlined" />
        <ErrorMessage name={`familyMembers[${index}].country`} component="div" className="error" style={{ color: 'red' }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Field
          name={`familyMembers[${index}].postalCode`}
          as={TextField}
          label="postal Code"
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <ErrorMessage name={`familyMembers[${index}].postalCode`} component="div" className="error" style={{ color: 'red' }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Field
          name={`familyMembers[${index}].passportNumber`}
          as={TextField}
          label="passport Number"
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <ErrorMessage name={`familyMembers[${index}].passportNumber`} component="div" className="error" style={{ color: 'red' }} />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Field
          name={`familyMembers[${index}].foodPreferences`}
          as={TextField}
          label="food Preferences"
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <ErrorMessage name={`familyMembers[${index}].foodPreferences`} component="div" className="error" style={{ color: 'red' }} />
      </Grid>
    </Grid>
    <Grid item xs={12}>
      <FieldArray name={`familyMembers[${index}].frequentFlyerNumbers`}>
        {({ push, remove: removeFFNumber, form }) => (
          <div>
            <Typography variant="h6" gutterBottom>
              Frequent Flyer Numbers
            </Typography>
            {form.values.familyMembers[index].frequentFlyerNumbers.map((_, ffIndex) => (
              <div key={ffIndex}>
                <Field
                  name={`familyMembers[${index}].frequentFlyerNumbers[${ffIndex}].type`}
                  as={TextField}
                  label="Frequent Flyer Type"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <ErrorMessage
                  name={`familyMembers[${index}].frequentFlyerNumbers[${ffIndex}].type`}
                  component="div"
                  className="error"
                  style={{ color: 'red' }}
                />
                <Field
                  name={`familyMembers[${index}].frequentFlyerNumbers[${ffIndex}].number`}
                  as={TextField}
                  label="Frequent Flyer Number"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <ErrorMessage
                  name={`familyMembers[${index}].frequentFlyerNumbers[${ffIndex}].number`}
                  component="div"
                  className="error"
                  style={{ color: 'red' }}
                />
                <Button type="button" variant="outlined" color="secondary" onClick={() => removeFFNumber(ffIndex)}>
                  Remove Frequent Flyer Number
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outlined"
              style={{ margin: '10px 0px' }}
              onClick={() =>
                push({
                  type: '',
                  number: ''
                })
              }
            >
              Add Frequent Flyer Number
            </Button>
          </div>
        )}
      </FieldArray>
    </Grid>

    {/* Add more fields for family members as needed */}
    {index == 1 && (
      <Button type="button" variant="outlined" color="secondary" onClick={() => remove(index)}>
        Remove Family Member
      </Button>
    )}
  </div>
);

const CreateFamilyMembers  = () => {
  const location = useLocation();

  const  getClientId = ()=> {
    const searchParams = new URLSearchParams(location.search);
    const queryParams = searchParams.get('clientId');
    return queryParams;
  }

  function generateSixDigitNumber() {
    const min = 100000; // Smallest 6-digit number
    const max = 999999; // Largest 6-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const handleSubmit = async (values) => {
   
    for (let i = 0; i < values.familyMembers.length; i++) {

      values.familyMembers[i].FamilyMemberId =  generateSixDigitNumber();
    }
    console.log(values.familyMembers);
    const FamilyMembersArr = await values.familyMembers;
    console.log(FamilyMembersArr);
    const createFamilyMembers = await axios.post("/createFamilyMembers",{FamilyMembersArr})
    if (createFamilyMembers){
    toast.success("Family members added successfully!!")
    window.location.href = `/familyMembers?clientId=${FamilyMembersArr.clientId}`;
    window.location.reload()
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Family Members Information
      </Typography>

      <Formik
        initialValues={{
          familyMembers: [
            {
              clientId: getClientId(),
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
              foodPreferences: '',
              frequentFlyerNumbers: []
            }
          ]
        }}
        onSubmit={handleSubmit}
      >
        {({ values, initialValues }) => (
          <Form>
            <FieldArray name="familyMembers">
              {({ push, remove }) => (
                <div>
                  {values.familyMembers.map((_, index) => (
                    <FamilyMemberForm key={index} index={index} remove={remove} />
                  ))}
                  <Button
                    type="button"
                    variant="outlined"
                    style={{ marginTop: '10px' }}
                    onClick={() => push(...initialValues.familyMembers)}
                  >
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
      <Toaster/>
    </Container>
  );
};

export default CreateFamilyMembers;