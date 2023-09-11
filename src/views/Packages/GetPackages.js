import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import ShopProductCard from './PackageCard';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function GetPackages() {
  const [allPackages, setallPackages] = useState([]);

  const GetPackages = () => {
    const promise = new Promise((resolve, reject) => {
      axios
        .get('/getLivePackages')
        .then((LivePackages) => {
          return axios.get('/getDraftPackages').then((DraftPackages) => {
            const allPackages = [...LivePackages.data.allPackages, ...DraftPackages.data.allPackages];
            setallPackages(allPackages);
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

  return (
    <>
      <Grid container spacing={5}>
        {allPackages.map((Package) => (
          <Grid key={Package._id} item xs={12} md={4}>
            <ShopProductCard Package={Package} />
          </Grid>
        ))}
      </Grid>
      <Toaster />
    </>
  );
}
