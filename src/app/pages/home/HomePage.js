import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
//import Builder from "./Builder";
import Dashboard from "./Dashboard";
//import DocsPage from "./docs/DocsPage";
import { LayoutSplashScreen } from "../../../_metronic";
import Users from '../Component/UserAccount/users.component';
import UserForm from '../Component/UserAccount/userform.component';
import OnboardingPage from './OnboardingPage';
import SecureRoute from '../../router/secure-route';
import { isAdmin, isCustomer } from '../../router/secure-guard';

// const GoogleMaterialPage = lazy(() =>
//   import("./google-material/GoogleMaterialPage")
// );
// const ReactBootstrapPage = lazy(() =>
//   import("./react-bootstrap/ReactBootstrapPage")
// );

const CustomerPage = lazy(() =>
    import("../Component/CustomerAccount/CustomerPage")
);

export default function HomePage(props) {
  // useEffect(() => {
  //   console.log('Home page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect
  
  const { role, userLastLocation } = props;

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          // <Redirect exact from="/" to="/dashboard" />
          role === 1 ? 
          <Redirect exact from="/" to="/users" />
          : <Redirect exact from="/" to="/onboarding" />
        }
        {/* <Route path="/customer" component={CustomerPage} />
        <Route path="/onboarding" component={OnboardingPage} /> */}
        {/* <Route path="/builder" component={Builder} /> */}
        {/* <Route path="/users" component={Users} />
        <Route path="/addUser" component={UserForm} />
        <Route path="/editUser/:id" component={UserForm} />
        <Route path="/dashboard" component={Dashboard} /> */}
        {/* <Route path="/OnBoarding" component={OnBoardingPage} /> */}
        
        {/* <Route path="/google-material" component={GoogleMaterialPage} /> */}
        {/* <Route path="/react-bootstrap" component={ReactBootstrapPage} /> */}
        {/* <Route path="/docs" component={DocsPage} /> */}

        <SecureRoute
            path="/customer"
            guard={isAdmin}
            component={CustomerPage}
        />
        <SecureRoute
            path="/onboarding"
            guard={isCustomer}
            component={OnboardingPage}
        />
        <SecureRoute
            path="/users"
            guard={isAdmin}
            component={Users}
        />
        <SecureRoute
            path="/addUser"
            guard={isAdmin}
            component={UserForm}
        />
        <SecureRoute
            path="/editUser/:id"
            guard={isAdmin}
            component={UserForm}
        />
        <SecureRoute
            path="/dashboard"
            guard={isAdmin}
            component={Dashboard}
        />
        <Redirect to="/error/error-v1" />
      </Switch>
    </Suspense>
  );
}
