import PropTypes from 'prop-types';
// import { useState } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import { IconPackages } from '@tabler/icons';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    zIndex: '1',

    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.secondary[800],
    borderRadius: '50%',
    top: -85,
    right: -95,
    [theme.breakpoints.down('sm')]: {
      top: -105,
      right: -140
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    zIndex: '1',

    width: 210,
    height: 210,
    background: theme.palette.secondary[800],
    borderRadius: '50%',
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70
    }
  }
}));

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const PackagesCard = ({ isLoading }) => {
  const theme = useTheme();
  const [packagesNo, setPackagesNo] = useState(0);

  const packages = async () => {
    const getLivePackages = await axios.get('/getLivePackages');
    // console.log(clients.data.allClients.length);
    const getDraftPackages = await axios.get('/getDraftPackages');

    let totalPackages = (await getLivePackages.data.allPackages.length) + (await getDraftPackages.data.allPackages.length);
    setPackagesNo(totalPackages);
  };

  useEffect(() => {
    packages();
  }, []);

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Link to="/Packages" style={{ textDecoration: 'none', color: 'white' }}>
            <Box sx={{ p: 2.25 }}>
              <Grid container direction="column">
                <Grid item>
                  <Grid container justifyContent="space-between">
                    <Grid item>
                      <Avatar
                        style={{ color: 'white' }}

                        variant="rounded"
                        sx={{
                          ...theme.typography.commonAvatar,
                          ...theme.typography.largeAvatar,
                          backgroundColor: theme.palette.secondary[800],
                          mt: 1
                        }}
                      >
                        <IconPackages />
                      </Avatar>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container alignItems="center">
                    <Grid item>
                      <Typography
                        sx={{ fontSize: '1.9rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}
                        style={{ zIndex: '10', position: 'relative' }}
                      >
                        Total Packages: {packagesNo}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Link>
        </CardWrapper>
      )}
    </>
  );
};

PackagesCard.propTypes = {
  isLoading: PropTypes.bool
};

export default PackagesCard;
