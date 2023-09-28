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
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
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
import { Link, useLocation } from 'react-router-dom';

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
    return filter(array, (_user) => _user.firstName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'relationship', label: 'relationship', alignRight: false },
  { id: 'Mobile', label: 'Mobile No', alignRight: false },
  { id: 'Email', label: 'Email', alignRight: false },
  { id: 'address', label: 'address', alignRight: false },
  { id: 'action', label: 'action' }
];

export default function GetFamilyMembers() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [USERLIST, setUserlist] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editUserData, setEditUserData] = useState([]);
  const [CLIENTID, setCLIENTID] = useState();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const fetchFamilyMembers = async () => {
    const promise = new Promise((resolve, reject) => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const queryParams = searchParams.get('clientId');
        setCLIENTID(queryParams);

        const url = `/getFamilyMembers?id=${queryParams}`;
        axios
          .get(url)
          .then((response) => {
            const familyMembersData = response.data.allFamilyMembers;
            setUserlist(familyMembersData);
            toast.success('Family members fetched successfully!');
            resolve(familyMembersData);
          })
          .catch((error) => {
            toast.error('Failed to fetch family members. Please try again later.');
            console.error('Error fetching family members:', error);
            reject(error);
          });
      } catch (error) {
        toast.error('Failed to fetch family members. Please try again later.');
        console.error('Error fetching family members:', error);
        reject(error);
      }
    });
    toast.promise(promise, {
      loading: 'Fetching family members...',
      success: 'Family members fetched successfully!',
      error: 'Failed to fetch family members!'
    });
  };

  useEffect(() => {
    fetchFamilyMembers();
    // console.log(USERLIST);
    // eslint-disable-next-line
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
      const newSelecteds = USERLIST.map((n) => n.clientId);
      setSelected(newSelecteds);
    } else {
      // If the checkbox is unchecked, clear the selection
      setSelected([]);
    }
  };

  const handleClick = (event, FamilyMemberId) => {
    const selectedIndex = selected.indexOf(FamilyMemberId);
    let newSelected = [];

    if (selectedIndex === -1) {
      // If the item is not selected, add it to the selection
      newSelected = [...selected, FamilyMemberId];
    } else if (selectedIndex >= 0) {
      // If the item is selected, remove it from the selection
      newSelected = selected.filter((id) => id !== FamilyMemberId);
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
      const user = USERLIST.find((user) => user.FamilyMemberId == row.FamilyMemberId);
      console.log(user);
      setEditUserData(user);
      setOpenEditModal(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  const handleDeleteCustomer = async (row) => {
    try {
      const user = USERLIST.find((user) => user.FamilyMemberId == row.FamilyMemberId);
      console.log(user);
      const isDelete = window.confirm('Are you sure you want to delete customer having name ' + user.firstName + user.lastName);
      if (isDelete) {
        const deletedCustomer = await axios.post('/DeleteFamilyMember', { clientId: user.clientId, FamilyMemberId: user.FamilyMemberId });
        if (deletedCustomer) {
          toast.success('Customer deleted successfully!!');
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

  // const handleSaveChanges = () => {
  //   handleCloseEditModal();
  // };
  const handleMobileKeyPress = (e) => {
    // Prevent non-numeric characters
    if (!/^\d+$/.test(e.key)) {
      e.preventDefault();
    }
  };
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    mobile: Yup.string()
      .required('Mobile number is required')
      .matches(/^[0-9]+$/, 'Mobile number must contain only digits'),
    dateOfBirth: Yup.date().nullable().required('Date of Birth is required'),
    relationship: Yup.string().required('Relationship is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    country: Yup.string().required('Country is required'),
    postalCode: Yup.string()
      .required('Postal Code is required')
      .matches(/^\d{5}$/, 'Postal Code must be a 5-digit number'),
    passportExpiryDate: Yup.date().nullable().required('Passport Expiry Date is required'),
    passportNumber: Yup.string().required('Passport Number is required'),
    foodPreferences: Yup.string()
  });

  // const getClientId = () => {
  //   const searchParams = new URLSearchParams(location.search);
  //   const queryParams = searchParams.get('clientId');
  //   return queryParams;
  // };
  // const initialValues = {
  //   clientId: getClientId(),
  //   FamilyMemberId: editUserData.FamilyMemberId,
  //   firstName: '',
  //   lastName: '',
  //   email: '',
  //   mobile: '',
  //   dateOfBirth: '',
  //   relationship: '',
  //   address: '',
  //   city: '',
  //   country: '',
  //   postalCode: '',
  //   passportNumber: '',
  //   passportExpiryDate: '',
  //   foodPreferences: ''
  // };

  const handleEdit = async (values) => {
    try {
      setLoading(true);
      console.log(values);
      const updatedCustomer = await axios.post('/updateFamilyMember', values);
      console.log(updatedCustomer);
      toast.success('Family Member updated successfully!!');
    } catch (error) {
      console.error('Error updating family member:', error);
      toast.error('Failed to update family member. Please try again.');
    } finally {
      setLoading(false);
      window.location.reload();
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
            Family Members
          </Typography>
          <Button
            component={Link}
            to={`/createFamilyMembers?clientId=${CLIENTID}`}
            variant="contained"
            style={{ textAlign: 'center' }}
            color="primary"
          >
            Add Family members
          </Button>
        </Stack>
        {openEditModal && (
          <Dialog open={openEditModal} onClose={handleCloseEditModal} maxWidth="lg" fullWidth>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogContent>
              <Container>
                <Typography variant="h4" gutterBottom>
                  Edit Family Member
                </Typography>
                <Formik initialValues={editUserData} validationSchema={validationSchema} onSubmit={handleEdit}>
                  {() => (
                    <Form>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="firstName"
                            as={TextField}
                            label="First Name"
                            type="text"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage name="firstName" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="lastName"
                            as={TextField}
                            label="Last Name"
                            type="text"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage name="lastName" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field name="email" as={TextField} label="Email" type="email" fullWidth margin="normal" variant="outlined" />
                          <ErrorMessage name="email" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="mobile"
                            as={TextField}
                            label="Mobile"
                            fullWidth
                            type="text"
                            margin="normal"
                            variant="outlined"
                            onKeyPress={handleMobileKeyPress}
                            inputProps={{
                              inputMode: 'numeric',
                              maxLength: 10 // Add maximum length attribute
                            }}
                            error={editUserData.mobile && editUserData.mobile.length != 10}
                            helperText={
                              editUserData.mobile && editUserData.mobile.length != 10 ? 'Mobile number must be exactly 10 characters' : ''
                            }
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
                          <Field
                            name="relationship"
                            as={TextField}
                            label="Relationship"
                            fullWidth
                            type="text"
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage name="relationship" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field name="city" as={TextField} label="City" type="text" fullWidth margin="normal" variant="outlined" />
                          <ErrorMessage name="city" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field name="address" as={TextField} type="text" label="Address" fullWidth margin="normal" variant="outlined" />
                          <ErrorMessage name="address" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field name="country" as={TextField} type="text" label="Country" fullWidth margin="normal" variant="outlined" />
                          <ErrorMessage name="country" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="postalCode"
                            as={TextField}
                            label="Postal Code"
                            type="text"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage name="postalCode" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="passportNumber"
                            as={TextField}
                            label="Passport Number"
                            type="text"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
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
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="foodPreferences"
                            as={TextField}
                            type="text"
                            label="Food Preferences"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage name="foodPreferences" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                      </Grid>

                      <Button type="submit" variant="contained" color="primary" size="large" style={{ marginTop: '1rem' }}>
                        {loading ? 'Loading...' : 'Submit'}
                      </Button>
                    </Form>
                  )}
                </Formik>
                <Toaster />
              </Container>
            </DialogContent>
          </Dialog>
        )}
        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            placeholder="FamilyMember"
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
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    // console.log(row);
                    const { FamilyMemberId, firstName, lastName, email, mobile, address, relationship } = row;
                    // console.log(row)
                    const selectedUser = selected.indexOf(FamilyMemberId) !== -1;

                    return (
                      <>
                        <TableRow hover key={FamilyMemberId} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, FamilyMemberId)} />
                          </TableCell>

                          <TableCell align="left">
                            <Typography noWrap>
                              {firstName} {lastName}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">{relationship}</TableCell>

                          <TableCell align="left">{mobile}</TableCell>

                          <TableCell align="left">{email}</TableCell>

                          <TableCell align="left">{address}</TableCell>

                          <TableCell align="left">
                            <IconButton size="large" color="inherit" onClick={() => handleOpenEditModal(row)}>
                              <Iconify icon={'eva:edit-fill'} />
                            </IconButton>

                            <IconButton
                              size="large"
                              color="inherit"
                              onClick={() => {
                                handleDeleteCustomer(row);
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
      <Toaster />
    </>
  );
}
