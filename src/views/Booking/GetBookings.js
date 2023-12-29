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
  Button
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import { useEffect } from 'react';
import React from 'react';
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

// function applySortFilter(array, comparator, query) {
//   // Filter the array based on the query
//   let filteredArray = array;
//   if (query && query.bookingId) {
//     filteredArray = filteredArray.filter((_user) => _user.bookingId == query.bookingId);
//   }

//   // Sort the filtered array
//   const stabilizedThis = filteredArray.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });

//   // Return the sorted and filtered result
//   return stabilizedThis.map((el) => el[0]);
// }

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
  { id: 'bookingId', label: 'Booking ID', alignRight: false },
  { id: 'clientName', label: 'Client Name', alignRight: false },
  { id: 'packageId', label: 'Package ID', alignRight: false },
  { id: 'startDate', label: 'Trip Start Date', alignRight: false },
  { id: 'endDate', label: 'Trip End Date', alignRight: false },
  { id: 'pdf', label: 'PDF', alignRight: false },
  { id: 'action', label: 'Action' }
];

export default function Bookings() {
  // const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [USERLIST, setUserlist] = useState([]);
  // const [openEditModal, setOpenEditModal] = useState(false);

  const fetchCustomers = () => {
    const promise = new Promise((resolve, reject) => {
      axios
        .get('/getBookings')
        .then((bookingResponse) => {
          const bookingData = bookingResponse.data.allBookings;

          axios.get('/getClients').then((clientResponse) => {
            const clientData = clientResponse.data.allClients;

            // Create a map for efficient lookup by clientId
            const clientMap = {};
            clientData.forEach((client) => {
              clientMap[client.clientId] = client;
            });

            // Iterate through bookingData and add firstName from clientData
            const enrichedBookingData = bookingData.map((booking) => {
              const client = clientMap[booking.clientId];
              if (client) {
                booking.firstName = client.firstName;
                booking.lastName = client.lastName;
              }
              return booking;
            });

            // Now, enrichedBookingData contains bookings with firstName from clientData
            setUserlist(enrichedBookingData);
            toast.success('Bookings Fetched Successfully!!');
            resolve(enrichedBookingData);
          });
        })
        .catch((error) => {
          toast.error('Failed to fetch Bookings. Please try again later.');
          console.error('Error fetching Bookings:', error);
          reject(error);
        });
    });

    toast.promise(promise, {
      loading: 'Fetching Bookings...',
      success: 'Bookings fetched successfully!',
      error: 'Failed to fetch Bookings!!'
    });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      // If the checkbox is checked, select all items
      const newSelecteds = USERLIST.map((n) => n.bookingId);
      setSelected(newSelecteds);
    } else {
      // If the checkbox is unchecked, clear the selection
      setSelected([]);
    }
  };

  const handleClick = (event, bookingId) => {
    const selectedIndex = selected.indexOf(bookingId);
    let newSelected = [];

    if (selectedIndex === -1) {
      // If the item is not selected, add it to the selection
      newSelected = [...selected, bookingId];
    } else if (selectedIndex >= 0) {
      // If the item is selected, remove it from the selection
      newSelected = selected.filter((id) => id !== bookingId);
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

  const handleFilterById = (event) => {
    setPage(0);
    setFilterName(event.target.value.toLowerCase());
  };

  // const handleOpenEditModal = (row) => {
  //   try {
  //     console.log(row);
  //     const user = USERLIST.find((user) => user.clientId == row.clientId);
  //     console.log(user);
  //     setOpenEditModal(true);
  //   } catch (error) {
  //     console.error('Error fetching user data:', error);
  //   }
  // };

  const handleDeleteCustomer = async (row) => {
    try {
      const booking = USERLIST.find((user) => user.bookingId == row.bookingId);
      console.log(booking);
      const isDelete = window.confirm('Are you sure you want to delete customer having name ' + booking.firstName + booking.lastName);
      if (isDelete) {
        const deletedCustomer = await axios.post('/deleteBooking', { clientId: booking.clientId, bookingId: booking.bookingId });
        if (deletedCustomer) {
          toast.success('Booking Seleted Successfully!!');
          window.location.reload();
          console.log(editedUserData);
        }
      }
      window.location.reload();
    } catch (err) {
      console.log({ error: err });
    }
  };
  // // Function to close the edit modal
  // const handleCloseEditModal = () => {
  //   setOpenEditModal(false);
  // };

  const downloadPdf = async (pdfUrl, fileName) => {
    try {
      console.log(pdfUrl);
      const response = await fetch(pdfUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch PDF');
      }
      console.log(response);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      return 'PDF downloaded successfully';
    } catch (error) {
      throw new Error(`Error downloading PDF: ${error.message}`);
    }
  };
  const handleGeneratePdf = async (row) => {
    // const pdfUrl = `http://localhost:7000/BookedPdfGenerate?clientId=${row.clientId}&packageId=${row.packageId}&bookingId=${row.bookingId}`;
    const pdfUrl = `https://admin.blueescapeholidays.com/api/BookedPdfGenerate?clientId=${row.clientId}&packageId=${row.packageId}&bookingId=${row.bookingId}`;

    console.log(row);
    const fileName = `${`${row.firstName}${row.lastName}`}.pdf`;

    // Show a "pending" toast message
    const pendingToastId = toast('Downloading PDF...', {
      autoClose: false // Keep it open until the download is complete
    });

    try {
      const result = await downloadPdf(pdfUrl, fileName);
      console.log(result);
      // Hide the "pending" toast when the download is complete
      toast.dismiss(pendingToastId);
      // Show a "success" toast
      toast.success('PDF Downloaded Successfully');
    } catch (error) {
      // Hide the "pending" toast in case of an error
      toast.dismiss(pendingToastId);
      // Show an "error" toast
      toast.error(`Error downloading PDF: ${error.message}`);
      console.error(error);
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
            Booking History
          </Typography>
          <Link to="/createBooking">
            <Button variant="contained" className="bg-blue-500 hover:bg-blue-400" startIcon={<Iconify icon="eva:plus-fill" />}>
              Add Booking
            </Button>
          </Link>
        </Stack>
        <Toaster />

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterById} />

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
                      const { firstName, lastName, bookingId, clientId, packageId, startDate, endDate } = row;
                      const selectedUser = selected.indexOf(bookingId) !== -1;

                      return (
                        <>
                          <TableRow hover key={bookingId} tabIndex={-1} role="checkbox" selected={selectedUser}>
                            <TableCell padding="checkbox">
                              <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, bookingId)} />
                            </TableCell>

                            <TableCell align="left">{bookingId}</TableCell>

                            <TableCell align="left">
                              <Link to={`/GetBooking/${bookingId}/${clientId}`} style={{ textDecoration: 'none', color: 'black' }}>
                                {firstName} {lastName}
                              </Link>
                            </TableCell>
                            <TableCell align="left">{packageId}</TableCell>

                            <TableCell align="left">{startDate?.split('T')[0]}</TableCell>

                            <TableCell align="left">{endDate?.split('T')[0]}</TableCell>
                            {/* <TableCell align="left">{pdf}</TableCell> */}
                            <TableCell align="left">
                              {' '}
                              <Button
                                variant="contained"
                                className="bg-blue-500 hover:bg-blue-400"
                                color="primary"
                                onClick={() => {
                                  handleGeneratePdf(row);
                                }}
                              >
                                Generate PDF
                              </Button>
                            </TableCell>
                            <TableCell align="left">
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
                  {USERLIST.length === 0 && (
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            No Booking
                          </Typography>
                          <Typography variant="body2">There are currently no Booking available.</Typography>
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
