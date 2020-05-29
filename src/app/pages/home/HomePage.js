import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Runner from "./Runner";
import Owner from "./Owner";
import Customer from "./Customer";
import StoreInfo from "./StoreInfo";
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
          /* Redirect from root URL to /customer. */
          <Redirect exact from="/" to="/customer" />
        }
        <Route path="/runner" component={Runner} />
        <Route path="/owner" component={Owner} />
        <Route path="/customer" component={Customer} />
        <Route path="/storeinfo" component={StoreInfo} />
        <Redirect to="/error/error-v1" />
      </Switch>
    </Suspense>
  );
}
