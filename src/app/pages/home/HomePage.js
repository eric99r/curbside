import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Builder from "./Builder";
import Dashboard from "./Dashboard";
import Runner from "./Runner";
import Owner from "./Owner";
import Customer from "./Customer";
import { LayoutSplashScreen } from "../../../_metronic";



export default function HomePage() {
  // useEffect(() => {
  //   console.log('Home page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/dashboard" />
        }
        <Route path="/builder" component={Builder} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/runner" component={Runner} />
        <Route path="/owner" component={Owner} />
        <Route path="/customer" component={Customer} />
        <Redirect to="/error/error-v1" />
      </Switch>
    </Suspense>
  );
}
