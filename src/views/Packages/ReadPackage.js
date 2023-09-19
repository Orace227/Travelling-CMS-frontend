import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Container, Typography, Grid, List, ListItem, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function ReadPackageData() {
  const [packageList, setPackageList] = useState([]);
  let { PackageId } = useParams();
  PackageId = parseInt(PackageId, 10);
  console.log(PackageId);
  const getPackages = () => {
    return axios
      .get(`/GetPackages?PackageId=${PackageId}`)
      .then((response) => {
        const packages = response.data.allPackages;
        console.log('packages', packages);
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
        toast.success('Packages fetched successfully!');
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
          <Grid container spacing={2} key={packageItem._id}>
            <Grid item xs={12}>
              <Typography variant="h4" style={{ fontSize: '26px', fontWeight: 'bold', marginTop: '16px', marginBottom: '16px' }}>
                Package Name: {packageItem.packageName}
              </Typography>
            </Grid>
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
                <strong>Is Live:</strong> {packageItem.isLive ? 'Yes' : 'No'}
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
            <Grid item xs={12}>
              <Divider style={{ marginTop: '20px' }}>
                {' '}
                <Typography variant="body1" style={{ fontSize: '22px' }}>
                  <strong>tour Details</strong>
                </Typography>
              </Divider>
            </Grid>

            <Grid item xs={12} sm={4}>
              <List>
                <ListItem>
                  <Typography variant="h4" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    Tour Overview
                  </Typography>
                </ListItem>
                {packageItem.packageBody.tourDetails.map((tourDetail) => (
                  <>
                    <ListItem key={tourDetail._id}>
                      <Typography variant="h4" style={{ fontSize: '16px', fontWeight: 'lighter', textAlign: 'justify' }}>
                        {`Day ${tourDetail.day}: ${tourDetail.title}`}
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Typography>{tourDetail.description}</Typography>
                    </ListItem>
                  </>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} sm={4}>
              <List>
                <ListItem>
                  <Typography variant="h4" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    Inclusions
                  </Typography>
                </ListItem>
                {packageItem.packageBody.inclusionsAndExclusions.inclusions.map((inclusion, index) => (
                  <ListItem key={index}>
                    <Typography variant="h4" style={{ fontSize: '16px', fontWeight: 'lighter', textAlign: 'justify' }}>
                      {index + 1}.{'  '}
                      {inclusion}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} sm={4}>
              <List>
                <ListItem>
                  <Typography variant="h4" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    Exclusions
                  </Typography>
                </ListItem>
                {packageItem.packageBody.inclusionsAndExclusions.exclusions.map((exclusion, index) => (
                  <ListItem key={index}>
                    <Typography variant="h4" style={{ fontSize: '16px', fontWeight: 'lighter', textAlign: 'justify' }}>
                      {index + 1}.{'  '}
                      {exclusion}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12}>
              <Divider style={{ marginTop: '20px' }}>
                {' '}
                <Typography variant="body1" style={{ fontSize: '22px' }}>
                  <strong>Terms and Conditions</strong>
                </Typography>
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <List>
                <ListItem>
                  <Typography variant="h4" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    terms
                  </Typography>
                </ListItem>
                {packageItem.packageBody.termsAndConditions.terms.map((term, index) => (
                  <ListItem key={index}>
                    <Typography variant="h4" style={{ fontSize: '16px', fontWeight: 'lighter', textAlign: 'justify' }}>
                      {index + 1}.{'  '}
                      {term}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} sm={6}>
              <List>
                <ListItem>
                  <Typography variant="h4" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    Conditions
                  </Typography>
                </ListItem>
                {packageItem.packageBody.termsAndConditions.conditions.map((conditions, index) => (
                  <ListItem key={index}>
                    <Typography variant="h4" style={{ fontSize: '16px', fontWeight: 'lighter', textAlign: 'justify' }}>
                      {index + 1}.{'  '}
                      {conditions}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        ))}
      </Container>
    </>
  );
}
