import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import PackagesCard from './PackagesCard';
import BookingCard from './BookingCard';

// import PopularCard from './PopularCard';
// import TotalOrderLineChartCard from './TotalOrderLineChartCard';
// import TotalIncomeDarkCard from './TotalIncomeDarkCard';
// import TotalIncomeLightCard from './TotalIncomeLightCard';
// import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import { Link } from 'react-router-dom';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12} className="mt-5">
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <PackagesCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <BookingCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            {/* <TotalOrderLineChartCard isLoading={isLoading} /> */}
            <Link to="/createCustomer">
              <button className="bg-[#5e35b1] w-full  rounded-lg text-white hover:bg-purple-600 p-3">Create a New Customer</button>
            </Link>
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <Link to="/createPackage">
              {/* <TotalOrderLineChartCard isLoading={isLoading} /> */}
              <button className="bg-[#5e35b1] w-full rounded-lg text-white hover:bg-purple-600 p-3">Create a New Package</button>
            </Link>
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <Link to="/createBooking">
              {/* <TotalOrderLineChartCard isLoading={isLoading} /> */}
              <button className="bg-[#5e35b1] w-full rounded-lg text-white hover:bg-purple-600 p-3">Create a New Booking</button>
            </Link>
          </Grid>
          {/* <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeDarkCard isLoading={isLoading} />
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeLightCard isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid> */}
        </Grid>
      </Grid>
      {/* <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid> */}
    </Grid>
  );
};

export default Dashboard;
