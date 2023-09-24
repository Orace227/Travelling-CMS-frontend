import React from 'react';
import {
  Container,
  Typography,
  TextField,
  FormLabel,
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton
} from '@mui/material';
import { Formik, Form, FieldArray, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
// import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import ClearIcon from '@mui/icons-material/Clear';
// import { convertToRaw } from 'draft-js';
// import draftToHtml from 'draftjs-to-html';
// import { EditorState } from 'draft-js';
// import draftToHtml from 'draftjs-to-html';

const tourDetailSchema = Yup.object().shape({
  day: Yup.number().required('Day is required').positive().integer(),
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required')
});

// Schema for the inclusions and exclusions arrays
const inclusionsAndExclusionsSchema = Yup.object().shape({
  inclusions: Yup.array().of(Yup.string().required('inclusion is required')),
  exclusions: Yup.array().of(Yup.string().required('exclusion is required'))
});

// Schema for the terms and conditions arrays
const termsAndConditionsSchema = Yup.object().shape({
  terms: Yup.array().of(Yup.string().required('term is required')),
  conditions: Yup.array().of(Yup.string().required('condition is required'))
});

// Schema for the entire packageBody object
const packageBodySchema = Yup.object().shape({
  tourDetails: Yup.array().of(tourDetailSchema), // Array of tour details
  inclusionsAndExclusions: inclusionsAndExclusionsSchema, // Object with inclusions and exclusions arrays
  termsAndConditions: termsAndConditionsSchema // Object with terms and conditions arrays
});
const validationSchema = Yup.object().shape({
  packageName: Yup.string().required('Package name is required'),
  packageDesc: Yup.string().required('Package Discription is required'),
  isLive: Yup.boolean().required('Live status is required'),
  packageType: Yup.string().required('Package type is required'),
  packageImg: Yup.mixed().required('Package image is required'),
  country: Yup.string().required('Country is required'),
  continent: Yup.string().required('Continent is required'),
  packageBody: packageBodySchema
});

const generateSixDigitNumber = () => {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const initialValues = {
  PackageId: generateSixDigitNumber(),
  packageName: '',
  packageDesc: '',
  isLive: false,
  packagePrice: '',
  packageType: '',
  packageImgName: '',
  packageImg: {}, // Use null for file uploads
  country: '',
  continent: '',
  packageBody: {
    tourDetails: [], // Initialize with an empty array
    inclusionsAndExclusions: {
      inclusions: [], // Initialize with an empty array
      exclusions: [] // Initialize with an empty array
    },
    termsAndConditions: {
      terms: [], // Initialize with an empty array
      conditions: [] // Initialize with an empty array
    }
  }
};

const CreatePackage = () => {
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);

  // const initialTour = {
  //   title: 'Initial Title',
  //   description: 'Initial Description'
  // };

  // const [tour, setTour] = useState({});
  // const [titleEditorState, setTitleEditorState] = useState([]);
  // const [descriptionEditorState, setDescriptionEditorState] = useState([]);

  const handlePriceKeyPress = (event) => {
    if (!/^\d+$/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleSubmit = async (values) => {
    try {
      // console.log(values);
      setLoading(true);
      const formData = new FormData();
      formData.append('bannerImage', values.packageImg);
      const uploadedImg = await axios.post('/upload', formData);
      console.log(uploadedImg);
      values.packageImgPath = uploadedImg.data.path;
      if (uploadedImg) {
        const createPackage = await axios.post('/createPackage', values);
        console.log(createPackage);
        if (createPackage) {
          toast.success('Package created successfully!!');
          setLoading(false);

          window.location.reload();
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
      if (error.response.status == 403) {
        toast.error('Package was already uploaded!!');
      }
      if (error.response.status == 500) {
        toast.error('Some arror occurred!!');
      }
      setLoading(false);
    }
  };
  const GetCountries = async () => {
    try {
      const Countries = await axios.get('/GetCountries');
      if (Countries) {
        console.log(Countries.data.allCountries);
        setCountries(Countries.data.allCountries);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    GetCountries();
  }, []);

  // const editorStyle = {
  //   minHeight: '80px',
  //   padding: '8px',
  //   border: '1px solid #ddd',
  //   borderRadius: '4px',
  //   backgroundColor: '#fff',
  //   boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
  //   fontSize: '14px',
  //   lineHeight: '1.4',
  //   color: '#333'
  // };
  // const toolbarOptions = {
  //   options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'history'],
  //   inline: {
  //     inDropdown: false,
  //     options: ['bold', 'italic', 'underline']
  //   },
  //   blockType: {
  //     inDropdown: true,
  //     options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']
  //   }
  // };
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Add Package
      </Typography>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Field name="packageName" as={TextField} label="Package Name" fullWidth margin="normal" variant="outlined" />
                <ErrorMessage name="packageName" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field name="packageDesc" as={TextField} label="Package Discription" fullWidth margin="normal" variant="outlined" />
                <ErrorMessage name="packageDesc" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="packagePrice"
                  as={TextField}
                  label="Package Price (Optional)"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  inputProps={{
                    inputMode: 'numeric',
                    maxLength: 10
                  }}
                  onKeyPress={handlePriceKeyPress}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel htmlFor="packageType">Select Package Type</InputLabel>
                  <Field name="packageType" as={Select} label="Select Package Type" fullWidth>
                    <MenuItem value="destination">destination</MenuItem>
                    <MenuItem value="Wellness Resorts">Wellness Resorts</MenuItem>
                    <MenuItem value="Sustainable paths">Sustainable paths</MenuItem>
                    <MenuItem value="Wildlife Drives">Wildlife Drives</MenuItem>
                    <MenuItem value="Cruise Vacations">Cruise Vacations</MenuItem>
                  </Field>
                </FormControl>
                <ErrorMessage name="packageType" component="div" className="error" style={{ color: 'red' }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel htmlFor="country">Select Country</InputLabel>
                  <Field as={Select} label="Select Country" name="country" variant="outlined">
                    {countries.map((option) => (
                      <MenuItem key={option.countryId} value={option.countryName}>
                        {option.countryName}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
                <ErrorMessage name="country" component="div" className="error" style={{ color: 'red' }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel htmlFor="continent">Select Continent</InputLabel>
                  <Field name="continent" as={Select} label="Select Continent" fullWidth>
                    <MenuItem value="Africa">Africa</MenuItem>
                    <MenuItem value="Asia">Asia</MenuItem>
                    <MenuItem value="Europe">Europe</MenuItem>
                    <MenuItem value="North America">North America</MenuItem>
                    <MenuItem value="South America">South America</MenuItem>
                    <MenuItem value="Australia">Australia</MenuItem>
                    {/* You can add more continents as needed */}
                  </Field>
                </FormControl>
                <ErrorMessage name="continent" component="div" className="error" style={{ color: 'red' }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel htmlFor="isLive">Make Live</InputLabel>
                  <Field name="isLive" as={Select} label="Make Live" fullWidth initialvalue="false">
                    <MenuItem value="true">Live</MenuItem>
                    <MenuItem value="false">Draft</MenuItem>
                    {/* You can add more continents as needed */}
                  </Field>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} style={{ marginTop: '24px' }}>
                <input
                  id="packageImg"
                  name="packageImg"
                  type="file"
                  onChange={(e) => {
                    setFieldValue('packageImg', e.currentTarget.files[0]);
                    setFieldValue('packageImgName', e.currentTarget.files[0].name);
                  }}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <FormLabel htmlFor="packageImg">
                  <Button variant="outlined" component="span" fullWidth style={{ textTransform: 'none' }}>
                    Upload Package Image
                  </Button>
                </FormLabel>
                <div>
                  {values.packageImgName && <p style={{ margin: '0', paddingTop: '8px' }}>Selected Image: {values.packageImgName}</p>}
                </div>
                <ErrorMessage name="packageImg" component="div" className="error" style={{ color: 'red' }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                  Tour Details
                </Typography>
                <FieldArray name="packageBody.tourDetails">
                  {({ push, remove }) => (
                    <div>
                      {values.packageBody.tourDetails.map((tour, index) => (
                        <div key={index}>
                          <Field
                            name={`packageBody.tourDetails[${index}].day`}
                            as={TextField}
                            label={`Day ${tour.day}`}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`packageBody.tourDetails[${index}].day`}
                            component="div"
                            className="error"
                            style={{ color: 'red' }}
                          />
                          <Typography variant="h5" gutterBottom>
                            <div style={{ position: 'relative', top: '30px' }}>add title</div>
                          </Typography>
                          <Typography variant="h5" style={{ display: 'flex', justifyContent: 'flex-end' }} gutterBottom>
                            <IconButton onClick={() => remove(index)} color="error" aria-label="delete">
                              <ClearIcon />
                            </IconButton>
                          </Typography>
                          <Field
                            name={`packageBody.tourDetails[${index}].title`}
                            as={TextField}
                            label={`title`}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          {/* <Editor
                            name={`packageBody.tourDetails[${index}].title`}
                            editorState={titleEditorState[index]}
                            toolbar={toolbarOptions}
                            onEditorStateChange={(newEditorState) => {
                              const newEditorStates = [...titleEditorState];
                              newEditorStates[index] = newEditorState;
                              setTitleEditorState(newEditorStates);

                              // Convert EditorState to HTML content
                              // const contentState = newEditorState.getCurrentContent();
                              // const contentStateAsRaw = convertToRaw(contentState);
                              // const contentStateAsHTML = draftToHtml(contentStateAsRaw);
                              // console.log(contentStateAsHTML)
                              // Set the field value
                              console.log(newEditorState.getCurrentContent());
                              setFieldValue(`packageBody.tourDetails[${index}].title`);

                              // Manually trigger field validation
                              // validateField(`packageBody.tourDetails[${index}].title`);
                            }}
                            toolbarHidden={false}
                            editorStyle={editorStyle}
                            wrapperStyle={{ height: '100px', marginTop: '10px', marginBottom: '90px' }}
                          /> */}
                          <ErrorMessage
                            name={`packageBody.tourDetails[${index}].title`}
                            component="div"
                            className="error"
                            style={{ color: 'red' }}
                          />
                          <div style={{ marginTop: '10px' }}></div>
                          <Typography variant="h5" gutterBottom>
                            <div>add Description</div>
                          </Typography>
                          <Field
                            name={`packageBody.tourDetails[${index}].description`}
                            as={TextField}
                            label={`description`}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          {/* <Editor
                            name={`packageBody.tourDetails[${index}].description`}
                            editorState={descriptionEditorState[index]}
                            toolbar={toolbarOptions}
                            onEditorStateChange={(newEditorState) => {
                              const newEditorStates = [...descriptionEditorState];
                              newEditorStates[index] = newEditorState;
                              setDescriptionEditorState(newEditorStates);
                            }}
                            toolbarHidden={false}
                            editorStyle={editorStyle}
                            wrapperStyle={{ height: '100px', marginTop: '10px', marginBottom: '90px' }}
                          /> */}
                          <ErrorMessage
                            name={`packageBody.tourDetails[${index}].description`}
                            component="div"
                            className="error"
                            style={{ color: 'red' }}
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outlined"
                        // style={{ marginTop: '0px' }}
                        onClick={() => push({ day: '', title: '', description: '' })}
                      >
                        Add Tour Detail
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h5" style={{ position: 'relative', top: '10px' }} gutterBottom>
                  Inclusions
                </Typography>
                <FieldArray name="packageBody.inclusionsAndExclusions.inclusions">
                  {({ push, remove }) => (
                    <>
                      <div>
                        {values.packageBody.inclusionsAndExclusions.inclusions.map((inclusion, index) => (
                          <div key={index}>
                            <Typography
                              variant="h6"
                              style={{ height: '30px', position: 'relative', top: '10px', display: 'flex', justifyContent: 'flex-end' }}
                              gutterBottom
                            >
                              <IconButton onClick={() => remove(index)} color="error" aria-label="delete">
                                <ClearIcon />
                              </IconButton>
                            </Typography>
                            <Field
                              name={`packageBody.inclusionsAndExclusions.inclusions[${index}]`}
                              as={TextField}
                              label={`Inclusion ${index + 1}`}
                              fullWidth
                              margin="normal"
                              variant="outlined"
                            />
                            <ErrorMessage
                              name={`packageBody.inclusionsAndExclusions.inclusions[${index}]`}
                              component="div"
                              className="error"
                              style={{ color: 'red' }}
                            />
                          </div>
                        ))}
                        <Button type="button" variant="outlined" style={{ marginTop: '10px' }} onClick={() => push('')}>
                          Add Inclusion
                        </Button>
                      </div>
                    </>
                  )}
                </FieldArray>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                  Exclusion
                </Typography>
                <FieldArray name="packageBody.inclusionsAndExclusions.exclusions">
                  {({ push, remove }) => (
                    <div>
                      {values.packageBody.inclusionsAndExclusions.exclusions.map((inclusion, index) => (
                        <div key={index}>
                          <Typography
                            variant="h6"
                            style={{ height: '30px', position: 'relative', top: '10px', display: 'flex', justifyContent: 'flex-end' }}
                            gutterBottom
                          >
                            <IconButton onClick={() => remove(index)} color="error" aria-label="delete">
                              <ClearIcon />
                            </IconButton>
                          </Typography>
                          <Field
                            name={`packageBody.inclusionsAndExclusions.exclusions[${index}]`}
                            as={TextField}
                            label={`exclusion ${index + 1}`}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`packageBody.inclusionsAndExclusions.exclusions[${index}]`}
                            component="div"
                            className="error"
                            style={{ color: 'red' }}
                          />
                        </div>
                      ))}
                      <Button type="button" variant="outlined" style={{ marginTop: '10px' }} onClick={() => push('')}>
                        Add Exclusion
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                  Terms
                </Typography>
                <FieldArray name="packageBody.termsAndConditions.terms">
                  {({ push, remove }) => (
                    <div>
                      {values.packageBody.termsAndConditions.terms.map((term, index) => (
                        <div key={index}>
                          <Typography
                            variant="h6"
                            style={{ height: '30px', position: 'relative', top: '10px', display: 'flex', justifyContent: 'flex-end' }}
                            gutterBottom
                          >
                            <IconButton onClick={() => remove(index)} color="error" aria-label="delete">
                              <ClearIcon />
                            </IconButton>
                          </Typography>
                          <Field
                            name={`packageBody.termsAndConditions.terms[${index}]`}
                            as={TextField}
                            label={`Term ${index + 1}`}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`packageBody.termsAndConditions.terms[${index}]`}
                            component="div"
                            className="error"
                            style={{ color: 'red' }}
                          />
                        </div>
                      ))}
                      <Button type="button" variant="outlined" style={{ marginTop: '10px' }} onClick={() => push('')}>
                        Add Terms
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                  conditions
                </Typography>
                <FieldArray name="packageBody.termsAndConditions.conditions">
                  {({ push, remove }) => (
                    <div>
                      {values.packageBody.termsAndConditions.conditions.map((condition, index) => (
                        <div key={index}>
                          <Typography
                            variant="h6"
                            style={{ height: '30px', position: 'relative', top: '10px', display: 'flex', justifyContent: 'flex-end' }}
                            gutterBottom
                          >
                            <IconButton onClick={() => remove(index)} color="error" aria-label="delete">
                              <ClearIcon />
                            </IconButton>
                          </Typography>
                          <Field
                            name={`packageBody.termsAndConditions.conditions[${index}]`}
                            as={TextField}
                            label={`condition ${index + 1}`}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`packageBody.termsAndConditions.conditions[${index}]`}
                            component="div"
                            className="error"
                            style={{ color: 'red' }}
                          />
                        </div>
                      ))}
                      <Button type="button" variant="outlined" style={{ marginTop: '10px' }} onClick={() => push('')}>
                        Add Condition
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              // onSubmit={handleSave}
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

export default CreatePackage;
