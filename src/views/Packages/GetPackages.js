import React from 'react';
// import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import ShopProductCard from './PackageCard';
// import img from '../../assets/images/banner.jpg';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
export default function GetPackages() {
  const [allPackages, setallPackages] = useState([]);
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
    const LivePackages = await axios.get('/getLivePackages');
    const DraftPackages = await axios.get('/getDraftPackages');
    // console.log(LivePackages.data.allPackages);
    // console.log(DraftPackages.data.allPackages);
    // console.log(allPackages);
    const allPackages = [...LivePackages.data.allPackages, ...DraftPackages.data.allPackages];
    setallPackages(allPackages);
    console.log(allPackages);
  };
  console.log(allPackages);

  useEffect(() => {
    GetPackages();
  }, []);
  return (
    <Grid container spacing={5}>
      {allPackages.map((Package) => (
        <Grid key={Package._id} item xs={12} md={4}>
          <ShopProductCard Package={Package} />
        </Grid>
      ))}
    </Grid>
  );
}
