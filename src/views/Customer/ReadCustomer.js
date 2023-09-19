import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Container, Typography, Grid, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function ReadCustomerData() {
  const [customerList, setCustomerList] = useState([]);
  let { clientId } = useParams();
  clientId = parseInt(clientId, 10);
  console.log(clientId);
  const getCustomer = () => {
    return axios
      .get(`/getClientsById?clientId=${clientId}`)
      .then((response) => {
        const oneClient = response.data.OneClient[0]; // Get the first client from the array
        console.log('customer', oneClient);
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
    getCustomer()
      .then(() => {
        toast.success('Customer fetched successfully!');
      })
      .catch(() => {
        toast.error('Failed to fetch customer!');
      })
      .finally(() => {
        toast.dismiss();
      });
  }, []);

  return (
    <>
      <Toaster />
      <Container maxWidth="md" style={{ padding: '17px' }}>
        <Typography variant="h4" align="center" style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '17px' }}>
          Customer Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" style={{ fontSize: '26px', fontWeight: 'bold', marginTop: '17px', marginBottom: '17px' }}>
              {customerList.firstName} {customerList.lastName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px' }}>
              <strong>Email:</strong> {customerList.email}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px', textAlign: 'justify' }}>
              <strong>Mobile:</strong> {customerList.mobile}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px', textAlign: 'justify' }}>
              <strong>Date of Birth:</strong> {customerList?.dateOfBirth}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px', textAlign: 'justify' }}>
              <strong>Passport Number:</strong> {customerList.passportNumber}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px', textAlign: 'justify' }}>
              <strong>Passport Expiry Date:</strong> {customerList.passportExpiryDate}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px', textAlign: 'justify' }}>
              <strong>Family Members:</strong> {customerList.familyMembers}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px', textAlign: 'justify' }}>
              <strong>Total Bookings:</strong> {customerList.totalBookings}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px', textAlign: 'justify' }}>
              <strong>Address:</strong> {customerList.address}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px', textAlign: 'justify' }}>
              <strong>City:</strong> {customerList.city}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px', textAlign: 'justify' }}>
              <strong>Country:</strong> {customerList.country}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px', textAlign: 'justify' }}>
              <strong>Postal Code:</strong> {customerList.postalCode}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider style={{ marginTop: '20px' }}>
              {' '}
              <Typography variant="body1" style={{ fontSize: '22px' }}>
                <strong>Company Details</strong>
              </Typography>
            </Divider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px', textAlign: 'justify' }}>
              <strong>Company Name:</strong> {customerList.companyName}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px', textAlign: 'justify' }}>
              <strong>company GST Email:</strong> {customerList.companyGSTEmail}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body1" style={{ fontSize: '17px', textAlign: 'justify' }}>
              <strong>company GST Number: </strong> {customerList.companyGSTNumber}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider style={{ marginTop: '20px' }}>
              <Typography variant="body1" style={{ fontSize: '22px' }}>
                <strong>Frequent Flyer Numbers</strong>
              </Typography>
            </Divider>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              {customerList?.frequentFlyerNumbers?.map((flyer, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Typography variant="body1" style={{ fontSize: '17px' }}>
                    {index + 1}. <strong>Type:</strong> {flyer?.type}
                  </Typography>
                  <Typography variant="body1" style={{ fontSize: '17px' }}>
                    <strong>Number:</strong> {flyer?.number}
                  </Typography>
                  <div style={{ margin: '10px' }}></div>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider style={{ marginTop: '20px' }}>
              <Typography variant="body1" style={{ fontSize: '22px' }}>
                <strong>Hotel Loyalty Numbers</strong>
              </Typography>
            </Divider>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              {customerList?.hotelLoyaltyNumbers?.map((loyaltyNumber, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Typography variant="body1" style={{ fontSize: '17px' }}>
                    {index + 1}. <strong>Type:</strong> {loyaltyNumber?.type}
                  </Typography>
                  <Typography variant="body1" style={{ fontSize: '17px' }}>
                    <strong>Number:</strong> {loyaltyNumber?.number}
                  </Typography>
                  <div style={{ margin: '10px' }}></div>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
