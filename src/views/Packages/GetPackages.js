import React from 'react';
// import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import ShopProductCard from './ProductCard';
import img from '../../assets/images/banner.jpg';
export default function GetPackages() {
  const products = [
    { id: 1, packageName: 'Advanture Package', cover: img },
    { id: 2, packageName: 'Advanture Package', cover: img },
    { id: 3, packageName: 'Advanture Package', cover: img },
    { id: 4, packageName: 'Advanture Package', cover: img },
    { id: 5, packageName: 'Advanture Package', cover: img },
    { id: 6, packageName: 'Advanture Package', cover: img },
    { id: 7, packageName: 'Advanture Package', cover: img },
    { id: 8, packageName: 'Advanture Package', cover: img },
    { id: 9, packageName: 'Advanture Package', cover: img },
    { id: 10, packageName: 'Advanture Package', cover: img },
    { id: 11, packageName: 'Advanture Package', cover: img },
    { id: 12, packageName: 'Advanture Package', cover: img }
  ];

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid key={product.id} item xs={12} sm={6} md={3}>
          <ShopProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
