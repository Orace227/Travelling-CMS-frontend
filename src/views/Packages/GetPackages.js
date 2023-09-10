import React from 'react';
// import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import ShopProductCard from './PackageCard';
// import img from '../../assets/images/banner.jpg';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
export default function GetPackages() {
  const [allPackages, setallPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // const products = [
  //   { id: 1, packageName: 'Advanture Package', cover: img },
  //   { id: 2, packageName: 'Advanture Package', cover: img },
  //   { id: 3, packageName: 'Advanture Package', cover: img },
  //   { id: 4, packageName: 'Advanture Package', cover: img },
  //   { id: 5, packageName: 'Advanture Package', cover: img },
  //   { id: 6, packageName: 'Advanture Package', cover: img },
  //   { id: 7, packageName: 'Advanture Package', cover: img },
  //   { id: 8, packageName: 'Advanture Package', cover: img },
  //   { id: 9, packageName: 'Advanture Package', cover: img },
  //   { id: 10, packageName: 'Advanture Package', cover: img },
  //   { id: 11, packageName: 'Advanture Package', cover: img },
  //   { id: 12, packageName: 'Advanture Package', cover: img }
  // ];
  const GetPackages = async () => {
    setIsLoading(true);
    const LivePackages = await axios.get('/getLivePackages');
    const DraftPackages = await axios.get('/getDraftPackages');
    // console.log(LivePackages.data.allPackages);
    // console.log(DraftPackages.data.allPackages);
    // console.log(allPackages);
    const allPackages = [...LivePackages.data.allPackages, ...DraftPackages.data.allPackages];
    setallPackages(allPackages);
    console.log(allPackages);
    setIsLoading(false);
  };
  console.log(allPackages);

  useEffect(() => {
    GetPackages();
  }, []);
  return (
    <>
      {isLoading ? toast.success('Loading all Packages') : ''}
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
