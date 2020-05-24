import React, { lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

const ListOrganizations = lazy(() =>
    import("../Organizations/ListOrganizations")
);

const CreateOrganization = lazy(() =>
    import("../Organizations/CreateOrganization")
);

export default function CustomerPage() {
    console.log("Customer page");
    return (
        <Switch>
            <Route path="/customer/create" component={CreateOrganization} />
            <Route path="/customer" component={ListOrganizations} />
            <Redirect to="/error/error-v1" />
        </Switch>
    )
} 