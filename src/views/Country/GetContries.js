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
  Button,
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
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

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
    return filter(array, (_package) => _package.countryName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
const TABLE_HEAD = [
  { id: 'id', label: 'Country ID ', alignRight: false },
  { id: 'name', label: 'Country Name', alignRight: false },
  { id: 'continent', label: 'Continent Name', alignRight: false },
  { id: 'action', label: 'Action' }
];

const validationSchema = Yup.object().shape({
  countryName: Yup.string().required('Package name is required'),
  continent: Yup.string().required('Continent name is required')
});

export default function GetCountries() {
  // const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [USERLIST, setPackageDetails] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  // const [isGene, setIsGene] = useState(false);
  const [editedUserData, setEditedUserData] = useState([]);
  // const [loading, setLoading] = useState(false);

  const GetCountries = () => {
    const promise = new Promise((resolve, reject) => {
      axios
        .get('/GetCountries')
        .then((allCountries) => {
          console.log(allCountries);
          setPackageDetails(allCountries.data.allCountries);
          resolve(allCountries);
        })
        .catch((error) => {
          reject(error);
        });
    });

    toast.promise(promise, {
      loading: 'Fetching Countries...',
      success: 'Countries fetched successfully!',
      error: 'Failed to fetch Countries!'
    });
  };

  useEffect(() => {
    GetCountries();
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
      const newSelecteds = USERLIST.map((n) => n.countryId);
      setSelected(newSelecteds);
    } else {
      // If the checkbox is unchecked, clear the selection
      setSelected([]);
    }
  };
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

  const handleClick = (event, countryId) => {
    const selectedIndex = selected.indexOf(countryId);
    let newSelected = [];

    if (selectedIndex === -1) {
      // If the item is not selected, add it to the selection
      newSelected = [...selected, countryId];
    } else if (selectedIndex >= 0) {
      // If the item is selected, remove it from the selection
      newSelected = selected.filter((id) => id !== countryId);
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
      const Country = USERLIST.find((country) => country.countryId == row.countryId);
      console.log(Country);
      setEditedUserData(Country);
      setCountry(Country.countryName);
      setSelectedContinent(Country.continent);

      setOpenEditModal(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  const handleDeletePackage = async (row) => {
    try {
      const Country = USERLIST.find((country) => country.countryId == row.countryId);
      console.log(Country);
      const isDelete = window.confirm('Are you sure you want to delete customer having ID ' + Country.countryId);
      if (isDelete) {
        const deletedCustomer = await axios.post('/DeleteCountry', { countryId: Country.countryId });
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

  const handleEdit = async (values) => {
    try {
      console.log('values', values);
      const updatedPackage = await axios.post('/UpdateCountry', values);
      console.log(updatedPackage);
      console.log(editedUserData);
      if (updatedPackage) {
        toast.success('Country Updated Successfully!!');
        handleSaveChanges();
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating Country:', error);
      toast.error('Failed to Update Country. Please Try Again.');
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
            Countries
          </Typography>
          <Link to="/CreateCountry">
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Add Country
            </Button>
          </Link>
        </Stack>
        <Toaster />
        {openEditModal && (
          <Dialog open={openEditModal} onClose={handleCloseEditModal} maxWidth="xs" fullWidth>
            <DialogTitle>Edit Country</DialogTitle>
            <DialogContent>
              <Container>
                <Formik initialValues={editedUserData} validationSchema={validationSchema} onSubmit={handleEdit}>
                  {({ setFieldValue }) => (
                    <Form>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Field name="countryId" as={TextField} label="Country ID" fullWidth margin="normal" variant="outlined" disabled />
                          {/* <ErrorMessage name="countryName" component="div" className="error" style={{ color: 'red' }} /> */}
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
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            placeholder="Countries"
          />

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
                  {filteredUsers
                    .reverse()
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      // console.log(row);
                      const { countryId, countryName, continent } = row;
                      const selectedUser = selected.indexOf(countryId) !== -1;

                      return (
                        <>
                          <TableRow hover key={countryId} tabIndex={-1} role="checkbox" selected={selectedUser}>
                            <TableCell padding="checkbox">
                              <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, countryId)} />
                            </TableCell>

                            <TableCell align="left">{countryId}</TableCell>

                            <TableCell align="left">{countryName}</TableCell>
                            <TableCell align="left">{continent}</TableCell>

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
                  {USERLIST.length === 0 && (
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            No Countries
                          </Typography>
                          <Typography variant="body2">There are currently no Countries available.</Typography>
                        </Paper>
                      </TableCell>
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
