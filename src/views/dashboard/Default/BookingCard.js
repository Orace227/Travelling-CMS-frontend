import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import { IconTicket } from '@tabler/icons';
import { useEffect, useState } from 'react';
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

const Bookingcard = ({ isLoading }) => {
  const theme = useTheme();
  const [bookingsNo, setBookingNo] = useState(0);

  const Booking = async () => {
    const Booking = await axios.get('/getBookings');
    // console.log(clients.data.allClients.length);
    setBookingNo(Booking.data.allBookings.length);
  };

  useEffect(() => {
    Booking();
  }, []);

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Link to="/Bookings" style={{ textDecoration: 'none', color: 'white' }}>
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
                        <IconTicket />
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
                        Total Bookings: {bookingsNo}
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

Bookingcard.propTypes = {
  isLoading: PropTypes.bool
};

export default Bookingcard;
