import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Container, Typography, Grid, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function ReadInquryData() {
  const [inquiry, setInquiry] = useState([]);
  let { inquiryId } = useParams();

  const getInquiryDetails = () => {
    console.log('getInquiryID', inquiryId);
    return axios
      .get(`/ReadInquiry?inquiryId=${inquiryId}`)
      .then((response) => {
        const fetchedInquiry = response.data.Inquiry;
        if (fetchedInquiry) {
          console.log(fetchedInquiry);
          setInquiry(fetchedInquiry);
        } else {
          throw new Error('No Inquiry found');
        }
      })
      .catch((error) => {
        console.error('Error fetching Inquiry', error);
        throw error;
      });
  };

  useEffect(() => {
    getInquiryDetails()
      .then(() => {
        toast.success('Inquiry fetched successfully!');
      })
      .catch(() => {
        toast.error('Failed to fetch Inquiry!');
      })
      .finally(() => {
        toast.dismiss();
      });
  }, []);

  return (
    <>
      <Toaster />
      <Container maxWidth="md" style={{ padding: '16px' }}>
        <Typography variant="h4" align="center" style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '16px' }}>
          Inquiry Details
        </Typography>
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
          <Typography variant="h4" style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '16px' }}>
            Full Name: {inquiry[0]?.fullName}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" style={{ fontSize: '18px' }}>
                <strong>Package ID:</strong> {inquiry[0]?.packageId}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" style={{ fontSize: '18px' }}>
                <strong>Mobile:</strong> {inquiry[0]?.mobile}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" style={{ fontSize: '18px', textAlign: 'justify' }}>
                <strong>Email:</strong> {inquiry[0]?.email}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" style={{ fontSize: '18px' }}>
                <strong>Hotel Preference:</strong> {inquiry[0]?.hotelPreference || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" style={{ fontSize: '18px' }}>
                <strong>Likely Travel Date:</strong> {new Date(inquiry[0]?.likelyTravelDate).toLocaleDateString() || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" style={{ fontSize: '18px' }}>
                <strong>Number of Adults:</strong> {inquiry[0]?.numberOfAdults || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" style={{ fontSize: '18px' }}>
                <strong>Number of Children:</strong> {inquiry[0]?.numberOfChildren || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" style={{ fontSize: '18px' }}>
                <strong>Number of Infants:</strong> {inquiry[0]?.numberOfInfants || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" style={{ fontSize: '18px' }}>
                <strong>Budget:</strong> {inquiry[0]?.budget || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" style={{ fontSize: '18px' }}>
                <strong>Message:</strong> {inquiry[0]?.message || 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
}
