import PropTypes from 'prop-types';
// @mui
import { IconArrowUpRight } from '@tabler/icons';

import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import img from '../../assets/images/banner.jpg';
// import { width } from '@mui/system';
const StyledPackageCard = styled('img')({
  top: 0,
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  position: 'absolute'
  // borderTopRightRadius: '15px',
  // borderTopLeftRadius: '15px',
  // border: '3px solid blue'
});

// ----------------------------------------------------------------------

PackageCard.propTypes = {
  Package: PropTypes.object
};

export default function PackageCard({ Package }) {
  const { packageName, packageDesc } = Package;

  return (
    <Card sx={{ boxShadow: '10px 43px 100px -48px rgba(0,0,0,0.1)' }}>
      <Box sx={{ pt: '200px', position: 'relative' }}>
        {/* {status && (
          <Label
            variant="filled"
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase'
            }}
          >
            NEW
          </Label>
        )} */}
        <StyledPackageCard alt={packageName} src={img} />
      </Box>

      <Stack spacing={2} sx={{ pl: 2, pb: 2, pr: 2, pt: 3 }} alignItems="center">
        <Link color="inherit" underline="hover">
          <Typography
            variant="subtitle1"
            style={{
              fontSize: '30px',
              whiteSpace: 'nowrap', // Prevent text from wrapping
              overflow: 'hidden', // Hide overflowing text
              textOverflow: 'ellipsis', // Display ellipsis (...) for overflow
              maxWidth: '300px' // Set a fixed width for the container
            }}
          >
            {packageName || 'package NameNameNameName'}
          </Typography>
        </Link>
        <Link color="inherit" underline="hover">
          <Typography
            variant="subtitle2"
            style={{
              marginTop: '-20px',
              fontSize: '18px',
              whiteSpace: 'nowrap', // Prevent text from wrapping
              overflow: 'hidden', // Hide overflowing text
              textOverflow: 'ellipsis', // Display ellipsis (...) for overflow
              maxWidth: '400px' // Set a fixed width for the container
            }}
          >
            {packageDesc || 'package NameNameNameName'}
          </Typography>
        </Link>
      </Stack>
      <Stack spacing={2} sx={{ pl: 2, pb: 2, pr: 4, pt: 1 }} alignItems="flex-end">
        <Link color="inherit" underline="hover">
          <Typography variant="subtitl1" noWrap>
            <IconArrowUpRight size={20} style={{ position: 'relative', top: '4px' }} />
            {'7 Day Trip'}
          </Typography>
        </Link>
      </Stack>
    </Card>
  );
}
