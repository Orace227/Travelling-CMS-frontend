import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Container, Typography, Grid, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function ReadBookingData() {
  const [Booking, setBookingList] = useState([]);
  const [customerList, setCustomerList] = useState([]);

  let { bookingId, clientId } = useParams();
  bookingId = parseInt(bookingId, 10);

  const getBooknig = () => {
    return axios
      .get(`/getBookingsById?bookingId=${bookingId}`)
      .then((response) => {
        const allBookings = response.data.allBookings;
        console.log('all bookings', allBookings);
        if (allBookings) {
          setBookingList(allBookings);
        } else {
          throw new Error('No Booking found');
        }
      })
      .catch((error) => {
        console.error('Error fetching Booking', error);
        throw error;
      });
  };

  const getCustomer = () => {
    return axios
      .get(`/getClientsById?clientId=${clientId}`)
      .then((response) => {
        const oneClient = response.data.OneClient[0];
        if (oneClient) {
          setCustomerList(oneClient);
        } else {
          throw new Error('No customer found');
        }
      })
      .catch((error) => {
        console.error('Error fetching customer', error);
        throw error;
      });
  };

  useEffect(() => {
    getBooknig()
      .then(() => {
        toast.success('Booking was Fetched Successfully!');
      })
      .catch(() => {
        toast.error('Failed to fetch Booking!');
      })
      .finally(() => {
        toast.dismiss();
      });
    getCustomer();
  }, []);

  const extractDate = (datetimeString) => {
    if (datetimeString) {
      const parts = datetimeString.split('T');
      if (parts.length > 0) {
        return parts[0];
      }
    }
    return '';
  };

  //   const renderBookingDetails = (booking) => {
  //     if (!booking) {
  //       return null;
  //     }
  //     console.log('working');
  //     return (

  //     );
  //   };

  return (
    <>
      <Toaster />
      <Container maxWidth="md" style={{ padding: '17px' }}>
        <Typography variant="h4" align="center" style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '17px' }}>
          Booking Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" style={{ fontSize: '26px', fontWeight: 'bold', marginTop: '17px', marginBottom: '17px' }}>
              {customerList.firstName} {customerList.lastName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Email Address:</strong> {customerList.email}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Mobile No. :</strong> {customerList.mobile}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Date of Birth:</strong> {extractDate(customerList?.dateOfBirth)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Passport Number:</strong> {customerList.passportNumber}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Passport Expiry Date:</strong> {extractDate(customerList.passportExpiryDate)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Family Members:</strong> {customerList.familyMembers}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Total Bookings:</strong> {customerList.totalBookings}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Address:</strong> {customerList.address}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>City:</strong> {customerList.city}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Country:</strong> {customerList.country}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>PostalCode:</strong> {customerList.postalCode}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <Divider style={{ marginTop: '20px', marginBottom: '20px' }}>
                <Typography variant="body1" style={{ fontSize: '22px' }}>
                  <strong>Booking Details</strong>
                </Typography>
              </Divider>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" style={{ fontSize: '17px' }}>
                  <strong>Booking ID:</strong> {Booking[0]?.bookingId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" style={{ fontSize: '17px' }}>
                  <strong>Package ID:</strong> {Booking[0]?.packageId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" style={{ fontSize: '17px' }}>
                  <strong>Client ID:</strong> {Booking[0]?.clientId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" style={{ fontSize: '17px' }}>
                  <strong>Start Date:</strong> {extractDate(Booking[0]?.startDate)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" style={{ fontSize: '17px' }}>
                  <strong>End Date:</strong> {extractDate(Booking[0]?.endDate)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" style={{ fontSize: '17px' }}>
                  <strong>Modified Package Price:</strong> {Booking[0]?.modifiedPackagePrice}
                </Typography>
              </Grid>

              {Booking[0]?.bookingDetails.map((detail, index) => (
                <>
                  <Grid item xs={12}>
                    <Divider style={{ marginTop: '20px', marginBottom: '20px' }}>
                      <Typography variant="body1" style={{ fontSize: '22px' }}>
                        <strong>Booking {index + 1}</strong>
                      </Typography>
                    </Divider>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <Typography variant="body1" style={{ fontSize: '17px' }}>
                      <strong>Booking Type:</strong> {detail.bookingType}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={6}>
                    <Typography variant="body1" style={{ fontSize: '17px' }}>
                      <strong>Booking Name:</strong> {detail.bookingName}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={6}>
                    <Typography variant="body1" style={{ fontSize: '17px' }}>
                      <strong>Price: </strong> {detail.price}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={6}>
                    <Typography variant="body1" style={{ fontSize: '17px' }}>
                      <strong>Vandor: </strong> {detail.vandor}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={6}>
                    <Typography variant="body1" style={{ fontSize: '17px' }}>
                      <strong>Booking Document Link: </strong>
                      <a
                        // href={`http://localhost:7000/${detail.docImgPath}`}
                        // href={`https://travelling-cms-backend.onrender.com/${detail.docImgPath}`}
                        href={`https://admin.blueescapeholidays.com/api/${detail.docImgPath}`}
                        style={{ textDecoration: 'none', color: 'black' }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        OPEN
                      </a>
                    </Typography>
                  </Grid>
                </>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
