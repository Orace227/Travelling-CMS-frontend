import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import 'tailwindcss/tailwind.css';

import axios from 'axios';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';

// ==============================|| APP ||============================== //

const token = Cookies.get('userCredentials');

const App = () => {
  const customization = useSelector((state) => state.customization);
  // axios.defaults.baseURL = 'http://localhost:7000';


  
  // axios.defaults.baseURL = 'https://travelling-cms-backend.onrender.com';
  axios.defaults.baseURL = 'https://admin.blueescapeholidays.com/api';
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenData = JSON.parse(decodeURIComponent(token));
        const hardcodedEmail = 'admin@admin.com';
        const hardcodedPassword = 'password';

        if (tokenData.email === hardcodedEmail && tokenData.password === hardcodedPassword) {
          // toast.success('You are logged in successfully!!');
          // Navigate('/dashboard');
        } else {
          toast.error('Invalid username or password');
          Navigate('/login');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        console.log('Token is set');
      }
    };

    if (token) {
      fetchData();
    } else {
      if (window.location.pathname !== '/login') {
        Navigate('/login');
      }
    }
  }, [token, Navigate]);

  return (
    <StyledEngineProvider injectFirst>
      <Toaster />
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <NavigationScroll>
          <Routes />
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
