import React from 'react';
import Customer from './app/pages/Customer'
import Owner from './app/pages/Owner'
import Runner from './app/pages/Runner'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        This is the home page with a bar at the top
        <ul>
          <li>
            <Link to="/customer">Customer</Link>
          </li>
          <li>
            <Link to="/runner">Runner</Link>
          </li>  
          <li>
            <Link to="/owner">Owner</Link>
          </li>
        </ul>

        <hr />

        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/">
          </Route>
          <Route path="/customer">
            <Customer />
          </Route>
          <Route path="/owner">
            <Owner />
          </Route> 
          <Route path="/runner">
            <Runner />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}


export default App;
