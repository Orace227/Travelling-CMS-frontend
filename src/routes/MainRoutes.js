import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import CreateCustomer from 'views/Customer/CreateCustomer';
import CreateFamilyMembers from 'views/FamilyMembers/CreateFamilyMembers';
import GetPackages from 'views/Packages/GetPackages';
import CreatePackage from 'views/Packages/CreatePackage';
import Bookings from 'views/Booking/GetBookings';
import CreateBooking from 'views/Booking/CreateBooking';
import GetCountries from 'views/Country/GetContries';
import CreateCountry from 'views/Country/CreateCountry';
import ReadPackageData from 'views/Packages/ReadPackage';
// import GetFamilyMemers from 'views/FamilyMembers/GetFamilymembers';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const Customers = Loadable(lazy(() => import('views/Customer/Customers')));
const GetFamilyMembers = Loadable(lazy(() => import('views/FamilyMembers/GetFamilyMembers')));
// const UpdatePackage = Loadable(lazy(() => import('views/Packages/UpdatePackage')));

// sample page routing

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: '/customers',
      element: <Customers />
    },
    {
      path: '/createCustomer',
      element: <CreateCustomer />
    },
    {
      path: '/familyMembers',
      element: <GetFamilyMembers />
    },
    {
      path: '/CreatefamilyMembers',
      element: <CreateFamilyMembers />
    },
    {
      path: '/Packages',
      element: <GetPackages />
    },
    {
      path: '/createPackage',
      element: <CreatePackage />
    },
    {
      path: '/updatePackage/:PackageId',
      element: <ReadPackageData />
    },

    {
      path: '/Bookings',
      element: <Bookings />
    },
    {
      path: '/createBooking',
      element: <CreateBooking />
    },

    {
      path: '/Countries',
      element: <GetCountries />
    },
    {
      path: '/CreateCountry',
      element: <CreateCountry />
    }
  ]
};

export default MainRoutes;
