import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../../assets/images/logo.jpg';
// material-ui
import { ButtonBase } from '@mui/material';

// project imports
import config from 'config';
import { MENU_OPEN } from 'store/actions';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();
  return (
    <ButtonBase disableRipple onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })} component={Link} to={config.defaultPath}>
      {/* <Logo /> */}
      <img src={logo} alt={'logo'} width={'90px'} height={'75px'} style={{ marginTop: '-10px', marginLeft: '50px' }} />
    </ButtonBase>
  );
};

export default LogoSection;
