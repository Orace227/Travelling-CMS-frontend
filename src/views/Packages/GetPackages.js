// import React, { useEffect, useState } from 'react';
// import { Grid } from '@mui/material';
// import ShopProductCard from './PackageCard';
// import axios from 'axios';
// import toast, { Toaster } from 'react-hot-toast';

// export default function GetPackages() {
//   const [allPackages, setallPackages] = useState([]);

//   const GetPackages = () => {
//     const promise = new Promise((resolve, reject) => {
//       axios
//         .get('/getLivePackages')
//         .then((LivePackages) => {
//           return axios.get('/getDraftPackages').then((DraftPackages) => {
//             const allPackages = [...LivePackages.data.allPackages, ...DraftPackages.data.allPackages];
//             setallPackages(allPackages);
//             resolve(allPackages);
//           });
//         })
//         .catch((error) => {
//           reject(error);
//         });
//     });

//     toast.promise(promise, {
//       loading: 'Fetching packages...',
//       success: 'Packages fetched successfully!',
//       error: 'Failed to fetch packages!'
//     });
//   };

//   useEffect(() => {
//     GetPackages();
//   }, []);

//   return (
//     <>
//       <Grid container spacing={5}>
//         {allPackages.map((Package) => (
//           <Grid key={Package._id} item xs={12} md={4}>
//             <ShopProductCard Package={Package} />
//           </Grid>
//         ))}
//       </Grid>
//       <Toaster />
//     </>
//   );
// }
import { useState } from 'react';
import { filter } from 'lodash';
import {
  Card,
  Table,
  Stack,
  Paper,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  FormLabel,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  // DialogActions,
  TextField,
  Grid
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import { useEffect } from 'react';
import React from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
// import { Link } from 'react-router-dom';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_package) => _package.packageName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
const TABLE_HEAD = [
  { id: 'id', label: 'Package ID ', alignRight: false },
  { id: 'name', label: 'Package Name', alignRight: false },
  { id: 'PackagePirce', label: 'Package Price', alignRight: false },
  { id: 'PackageType', label: 'Package Type', alignRight: false },
  { id: 'Status', label: 'Status', alignRight: false },
  { id: 'PDF', label: 'PDF', alignRight: false },
  { id: 'action', label: 'action' }
];

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
  // packageImg: Yup.mixed().required('Package image is required'),
  country: Yup.string().required('Country is required'),
  continent: Yup.string().required('Continent is required'),
  packageBody: packageBodySchema
});

export default function Customers() {
  // const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [USERLIST, setPackageDetails] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [isGene, setIsGene] = useState(false);
  const [editedUserData, setEditedUserData] = useState([]);
  // const [loading, setLoading] = useState(false);

  const GetPackages = () => {
    const promise = new Promise((resolve, reject) => {
      axios
        .get('/getLivePackages')
        .then((LivePackages) => {
          return axios.get('/getDraftPackages').then((DraftPackages) => {
            const allPackages = [...LivePackages.data.allPackages, ...DraftPackages.data.allPackages];
            setPackageDetails(allPackages);
            resolve(allPackages);
          });
        })
        .catch((error) => {
          reject(error);
        });
    });

    toast.promise(promise, {
      loading: 'Fetching packages...',
      success: 'Packages fetched successfully!',
      error: 'Failed to fetch packages!'
    });
  };

  useEffect(() => {
    GetPackages();
  }, []);

  // const handleCloseMenu = () => {
  //   setOpen(null);
  // };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      // If the checkbox is checked, select all items
      const newSelecteds = USERLIST.map((n) => n.PackageId);
      setSelected(newSelecteds);
    } else {
      // If the checkbox is unchecked, clear the selection
      setSelected([]);
    }
  };

  const handleClick = (event, PackageId) => {
    const selectedIndex = selected.indexOf(PackageId);
    let newSelected = [];

    if (selectedIndex === -1) {
      // If the item is not selected, add it to the selection
      newSelected = [...selected, PackageId];
    } else if (selectedIndex >= 0) {
      // If the item is selected, remove it from the selection
      newSelected = selected.filter((id) => id !== PackageId);
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleOpenEditModal = (row) => {
    try {
      console.log(row);
      const Package = USERLIST.find((Package) => Package.PackageId == row.PackageId);
      console.log(Package);
      setEditedUserData(Package);
      setOpenEditModal(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  const handleDeletePackage = async (row) => {
    try {
      const Package = USERLIST.find((Package) => Package.PackageId == row.PackageId);
      console.log(Package);
      const isDelete = window.confirm('Are you sure you want to delete customer having ID ' + Package.PackageId);
      if (isDelete) {
        const deletedCustomer = await axios.post('/deletePackage', { id: Package.PackageId });
        if (deletedCustomer) {
          toast.success('Package deleted successfully!!');
        }
      }
      window.location.reload();
    } catch (err) {
      console.log({ error: err });
    }
  };
  // Function to close the edit modal
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleSaveChanges = () => {
    handleCloseEditModal();
  };
  const handlePriceKeyPress = (e) => {
    // Prevent non-numeric characters
    if (!/^\d+$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleEdit = async (values) => {
    try {
      console.log(values);
      const updatedPackage = await axios.post('/updatePackage', values);
      console.log(updatedPackage);
      console.log(editedUserData);
      if (updatedPackage) {
        toast.success('Customer updated successfully!!');
        handleSaveChanges();
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating package:', error);
      toast.error('Failed to update customer. Please try again.');
    }
  };
  const handleGeneratePdf = async (row) => {
    try {
      // console.log(row.PackageId);
      setIsGene(true);
      if (row) {
        const pdf = await axios.get(`/generate-pdf/${row.PackageId}`);
        if (pdf) {
          setTimeout(() => {
            setIsGene(false);
          }, 1000);
        }
      }
    } catch (err) {
      console.log({ error: err });
      setIsGene(false);
    }
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h1" gutterBottom>
            Packages
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Add Customer
          </Button> */}
        </Stack>
        <Toaster />
        {openEditModal && (
          <Dialog open={openEditModal} onClose={handleCloseEditModal} maxWidth="xs" fullWidth>
            <DialogTitle>Edit Package</DialogTitle>
            <DialogContent>
              <Container>
                <Formik initialValues={editedUserData} validationSchema={validationSchema} onSubmit={handleEdit}>
                  {({ values, setFieldValue }) => (
                    <Form>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Field name="packageName" as={TextField} label="Package Name" fullWidth margin="normal" variant="outlined" />
                          <ErrorMessage name="packageName" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="packageDesc"
                            as={TextField}
                            label="Package Discription"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
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
                              inputMode: 'numeric'
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
                        <Grid item xs={12} sm={6}>
                          <Field name="country" as={TextField} label="Country" type="text" fullWidth margin="normal" variant="outlined" />
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
                            {values.packageImgName && (
                              <p style={{ margin: '0', paddingTop: '8px' }}>Selected Image: {values.packageImgName}</p>
                            )}
                          </div>
                          {/* <ErrorMessage name="packageImg" component="div" className="error" style={{ color: 'red' }} /> */}
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
                                    <Field
                                      name={`packageBody.tourDetails[${index}].title`}
                                      as={TextField}
                                      label="Title"
                                      fullWidth
                                      margin="normal"
                                      variant="outlined"
                                    />
                                    <ErrorMessage
                                      name={`packageBody.tourDetails[${index}].title`}
                                      component="div"
                                      className="error"
                                      style={{ color: 'red' }}
                                    />
                                    <Field
                                      name={`packageBody.tourDetails[${index}].description`}
                                      as={TextField}
                                      label="Description"
                                      fullWidth
                                      margin="normal"
                                      variant="outlined"
                                    />
                                    <ErrorMessage
                                      name={`packageBody.tourDetails[${index}].description`}
                                      component="div"
                                      className="error"
                                      style={{ color: 'red' }}
                                    />
                                    <Button type="button" variant="outlined" color="secondary" onClick={() => remove(index)}>
                                      Remove Tour Detail
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outlined"
                                  style={{ marginTop: '10px' }}
                                  onClick={() => push({ day: '', title: '', description: '' })}
                                >
                                  Add Tour Detail
                                </Button>
                              </div>
                            )}
                          </FieldArray>
                        </Grid>

                        <Grid item xs={12}>
                          <Typography variant="h5" gutterBottom>
                            Inclusions
                          </Typography>
                          <FieldArray name="packageBody.inclusionsAndExclusions.inclusions">
                            {({ push, remove }) => (
                              <div>
                                {values.packageBody.inclusionsAndExclusions.inclusions.map((inclusion, index) => (
                                  <div key={index}>
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
                                    <Button type="button" variant="outlined" color="secondary" onClick={() => remove(index)}>
                                      Remove Inclusion
                                    </Button>
                                  </div>
                                ))}
                                <Button type="button" variant="outlined" style={{ marginTop: '10px' }} onClick={() => push('')}>
                                  Add Inclusion
                                </Button>
                              </div>
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
                                    <Button type="button" variant="outlined" color="secondary" onClick={() => remove(index)}>
                                      Remove Exclusion
                                    </Button>
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
                                    <Button type="button" variant="outlined" color="secondary" onClick={() => remove(index)}>
                                      Remove Terms
                                    </Button>
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
                                    <Button type="button" variant="outlined" color="secondary" onClick={() => remove(index)}>
                                      Remove Condition
                                    </Button>
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
                        style={{ marginTop: '1rem' }}
                        // disabled={loading} // Disable the button when loading is true
                      >
                        {/* {loading ? 'Loading...' : 'Submit'} */}
                        Save
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Container>
            </DialogContent>
          </Dialog>
        )}
        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} placeholder="Packages" />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    // console.log(row);
                    const { PackageId, packageName, packageType, isLive, packagePrice } = row;
                    const selectedUser = selected.indexOf(PackageId) !== -1;

                    return (
                      <>
                        <TableRow hover key={PackageId} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, PackageId)} />
                          </TableCell>

                          <TableCell align="left">{PackageId}</TableCell>

                          <TableCell align="left">{packageName}</TableCell>

                          <TableCell align="left">{packagePrice ? packagePrice : '--'}</TableCell>
                          <TableCell align="left">{packageType}</TableCell>

                          <TableCell align="left">{isLive ? 'Live' : 'Draft'}</TableCell>
                          <TableCell align="left">
                            {' '}
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                handleGeneratePdf(row);
                              }}
                            >
                              {isGene ? 'Generating PDF...' : 'Generate PDF'}
                            </Button>
                          </TableCell>

                          <TableCell align="left">
                            <IconButton size="large" color="inherit" onClick={() => handleOpenEditModal(row)}>
                              <Iconify icon={'eva:edit-fill'} />
                            </IconButton>

                            <IconButton
                              size="large"
                              color="inherit"
                              onClick={() => {
                                handleDeletePackage(row);
                              }}
                            >
                              <Iconify icon={'eva:trash-2-outline'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
