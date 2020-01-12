import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';
import { AccountCircle, AccountCircleOutlinedIcon } from '@material-ui/icons';

import * as ROUTES from '../../constants/routes';

const Navigation = () => (
  <div className="navBar" >
    <ul>
      <li>
        <Link to={ROUTES.HOME}>Home</Link>
      </li>
      <li>
        <Link to={ROUTES.USERS}>Invite Users</Link>
      </li>
      <li id="account">
        <Link to={ROUTES.ACCOUNT} id="accountIcon">
          <AccountCircle />
        </Link>
      </li>
    </ul>
  </div>
);

export default Navigation;
