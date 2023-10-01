import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Container, Typography, Grid, List, ListItem, Divider, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function ReadPackageData() {
  const [packageList, setPackageList] = useState([]);
  let { PackageId } = useParams();
  PackageId = parseInt(PackageId, 10);

  const getPackages = () => {
    return axios
      .get(`/GetPackages?PackageId=${PackageId}`)
      .then((response) => {
        const packages = response.data.allPackages;
        if (packages) {
          setPackageList(packages);
        } else {
          throw new Error('No packages found');
        }
      })
      .catch((error) => {
        console.error('Error fetching packages', error);
        throw error;
      });
  };

  useEffect(() => {
    getPackages()
      .then(() => {
        toast.success('Packages Fetched Successfully!');
      })
      .catch(() => {
        toast.error('Failed to fetch packages!');
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
          Package Details
        </Typography>
        {packageList.map((packageItem) => (
          <Paper elevation={3} key={packageItem._id} style={{ padding: '16px', marginBottom: '16px' }}>
            <Typography variant="h4" style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '16px' }}>
              Package Name: {packageItem.packageName}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" style={{ fontSize: '18px' }}>
                  <strong>Description:</strong> {packageItem.packageDesc}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" style={{ fontSize: '18px', textAlign: 'justify' }}>
                  <strong>Price:</strong> {packageItem.packagePrice}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" style={{ fontSize: '18px', textAlign: 'justify' }}>
                  <strong>Type:</strong> {packageItem.packageType}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" style={{ fontSize: '18px', textAlign: 'justify' }}>
                  <strong>Live:</strong> {packageItem.isLive ? 'Yes' : 'No'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" style={{ fontSize: '18px', textAlign: 'justify' }}>
                  <strong>Country:</strong> {packageItem.country}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" style={{ fontSize: '18px', textAlign: 'justify' }}>
                  <strong>Continent:</strong> {packageItem.continent}
                </Typography>
              </Grid>
            </Grid>
            <Divider style={{ marginTop: '20px' }} />
            <Typography variant="body1" style={{ fontSize: '22px', marginTop: '20px', fontWeight: 'bold' }}>
              <strong>Tour Details</strong>
            </Typography>
            <List>
              {packageItem.packageBody.tourDetails.map((tourDetail) => (
                <ListItem key={tourDetail._id}>
                  <Typography variant="body1" style={{ fontSize: '16px', textAlign: 'justify' }}>
                    {`Day ${tourDetail.day}: ${tourDetail.title}`}
                  </Typography>
                  <Typography variant="body1" style={{ fontSize: '16px', textAlign: 'justify' }}>
                    {tourDetail.description}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <Divider style={{ marginTop: '20px' }} />
            <Typography variant="body1" style={{ fontSize: '22px', marginTop: '20px', fontWeight: 'bold' }}>
              <strong>Inclusions</strong>
            </Typography>
            <List>
              {packageItem.packageBody.inclusionsAndExclusions.inclusions.map((inclusion, index) => (
                <ListItem key={index}>
                  <Typography variant="body1" style={{ fontSize: '16px', textAlign: 'justify' }}>
                    {index + 1}.{'  '}
                    {inclusion}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <Divider style={{ marginTop: '20px' }} />
            <Typography variant="body1" style={{ fontSize: '22px', marginTop: '20px', fontWeight: 'bold' }}>
              <strong>Exclusions</strong>
            </Typography>
            <List>
              {packageItem.packageBody.inclusionsAndExclusions.exclusions.map((exclusion, index) => (
                <ListItem key={index}>
                  <Typography variant="body1" style={{ fontSize: '16px', textAlign: 'justify' }}>
                    {index + 1}.{'  '}
                    {exclusion}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <Divider style={{ marginTop: '20px' }} />
            <Typography variant="body1" style={{ fontSize: '22px', marginTop: '20px', fontWeight: 'bold' }}>
              <strong>Terms and Conditions</strong>
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  Terms
                </Typography>
                <List>
                  {packageItem.packageBody.termsAndConditions.terms.map((term, index) => (
                    <ListItem key={index}>
                      <Typography variant="body1" style={{ fontSize: '16px', textAlign: 'justify' }}>
                        {index + 1}.{'  '}
                        {term}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  Conditions
                </Typography>
                <List>
                  {packageItem.packageBody.termsAndConditions.conditions.map((conditions, index) => (
                    <ListItem key={index}>
                      <Typography variant="body1" style={{ fontSize: '16px', textAlign: 'justify' }}>
                        {index + 1}.{'  '}
                        {conditions}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Container>
    </>
  );
}
