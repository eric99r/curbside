import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import CustomerSchedule from "./CustomerSchedule";
import CustomerWaiting from "./CustomerWaiting";
import CustomerArrival from "./CustomerArrival";
import StoreInfo from "./StoreInfo";
import OrderQueue from "./OrderQueue";
import OrderPrepared from "./OrderPrepared";
import OrderRunning from "./OrderRunning";
import OrderCompleted from "./OrderCompleted";
import OrderDetails from "./OrderDetails";
import OrderSearch from "./OrderSearch";
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
          <Redirect exact from="/" to="/customerSchedule" />
        }
        <Route path="/customerArrival" component={CustomerArrival} />
        <Route path="/customerWaiting" component={CustomerWaiting} />
        <Route path="/customerSchedule" component={CustomerSchedule} />
        <Route path="/storeinfo" component={StoreInfo} />
        <Route path="/orderQueue" component={OrderQueue} />
        <Route path="/orderPrepared" component={OrderPrepared} />
        <Route path="/orderRunning" component={OrderRunning} />
        <Route path="/orderCompleted" component={OrderCompleted} />
        <Route path="/orderDetails" component={OrderDetails} />
        <Route path="/orderSearch" component={OrderSearch} />
        <Redirect to="/error/error-v1" />
      </Switch>
    </Suspense>
  );
}
