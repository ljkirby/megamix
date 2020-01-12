import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from '../Navigation';
import Home from '../Home';
import * as ROUTES from '../../constants/routes';

function App() {
  return (
    <Router>
        <Navigation />
        <Route 
            exact path={ ROUTES.HOME }
            render={() => <Home /> } 
        />
    </Router>
  );
}

export default App;
