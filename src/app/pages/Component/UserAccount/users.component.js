import React from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { injectIntl } from "react-intl";
import * as users from "../../../store/ducks/users.duck";
import { getAll, update } from "../../../crud/users.crud";
import MaterialTable from "material-table";
import {
    Button
} from "@material-ui/core";
import {
    Portlet,
    PortletBody,
    PortletHeader,
    PortletHeaderToolbar
} from "../../../partials/content/Portlet";

class Users extends React.Component {
    state = { users: null, status: null };

    componentDidMount() {
        getAll().then((data) => {
            this.setState({ users: data.data });
            this.props.getAll(data.data);
            // this.state.users = data.data;
        })
        .catch((error) => {
            console.log(error);
            // setSubmitting(false);
            // setStatus(
            //     this.intl.formatMessage(
            //         { id: "AUTH.VALIDATION.NOT_FOUND" }
            //     )
            // );
        });
    }
    handleCheckBoxChange(user, e) {
        const { name, checked } = e.target;
        let userData = {
            ...user,
            "isActivated": checked
        }
        update(userData)
            .then((data) => {
                this.setState({
                    ...this.state, users: this.state.users.map(user =>
                        user.id === data.data.id
                            ? data.data
                            : user
                    )
                });
                this.props.UpdateUser(data);
            })
            .catch((error) => {
                console.log(error);
                // setSubmitting(false);
                // setStatus(
                //     this.intl.formatMessage(
                //         { id: "AUTH.VALIDATION.NOT_FOUND" }
                //     )
                // );
            });
    }
    getRole(role) {
        if (role === 1) {
            return "Admin";
        }
        else if (role === 2) {
            return "Customer";
        }
        else if (role === 3) {
            return "Staff";
        }
        else {
            return "";
        }
    }
    getAccount(account) {
        if (account === 1) {
            return "Southwest College";
        }
        else if (account === 2) {
            return "Brown University";
        }
        else if (account === 3) {
            return "Orange College";
        }
        else if (account === 4) {
            return "University of Texas";
        }
        else {
            return "";
        }
    }
    
    getStatus(status) {
        if (status === true) {
            return "Active";
        }
        else if (status === false) {
            return "Inactive";
        }
        else {
            return "";
        }
    }

    render() {
        const { users, status } = this.state;
        if (!users) {
            return null;
        }
        if(status) {
            setTimeout(() => { this.setState({ status: null}) }, 30000);
        }
        return (
            <>
                {status ? (
                  <div role="alert" className="alert alert-danger">
                    <div className="alert-text">{status}</div>
                  </div>
                ) : ""
                }
                <Portlet>
                    <PortletHeader
                        title="CSP User Accounts"
                        toolbar={(
                            <PortletHeaderToolbar>
                                <Link to="/addUser">
                                    <Button variant="contained" color="primary">
                                        <i className="fa fa-plus-circle" aria-hidden="true"></i>&nbsp;&nbsp;Create New user
                                    </Button>
                                </Link>
                            </PortletHeaderToolbar>
                        )}
                    />
                    <PortletBody>
                        <MaterialTable
                            title=""
                            columns={[
                                { title: 'First Name', field: 'firstName' },
                                { title: 'Last Name', field: 'lastName' },
                                { title: 'Email Address', field: 'email_address', editable: 'never' },
                                {
                                    field: 'role',
                                    title: 'Role',
                                    render: rowData => this.getRole(parseInt(rowData.role)),
                                    lookup: { 1: 'Admin', 2: 'Customer' }
                                },
                                {
                                    field: 'account',
                                    title: 'Customer Account',
                                    render: rowData => this.getAccount(parseInt(rowData.account)),
                                    lookup: { 1: 'Southwest College', 2: 'Brown University', 3: 'Orange College', 4: 'University of Texas' },
                                },
                                {
                                    field: 'isActivated',
                                    title: 'Status',
                                    render: rowData => this.getStatus(rowData.isActivated),
                                    lookup: { true: 'Active', false: 'InActive' }
                                }
                            ]}
                            data={users}
                            options={{
                                sorting: true,
                                actionsColumnIndex: -1,
                                showTitle: false,
                                search: true,
                                searchFieldAlignment: "left"
                            }}
                            editable={{
                                onRowUpdate: (newData, oldData) =>
                                    new Promise((resolve, reject) => {
                                        let userData = {
                                            ...oldData,
                                            "firstName": newData.firstName,
                                            "lastName": newData.lastName,
                                            "email_address": oldData.email_address,
                                            "Role": newData.role,
                                            "Account": newData.account,
                                            "isActivated": newData.isActivated
                                        }
                                        if (newData.firstName === "" || newData.lastName === "") {
                                            if (newData.firstName === "" && newData.lastName === "") {
                                                let errorMsg = "First name and last name are required."
                                                this.setState({ status: errorMsg }, () => reject());
                                            } else if (newData.firstName === "") {
                                                let errorMsg = "First name is required."
                                                this.setState({ status: errorMsg }, () => reject());
                                            } else if (newData.lastName === "") {
                                                let errorMsg = "Last name is required."
                                                this.setState({ status: errorMsg }, () => reject());
                                            }
                                        } else {
                                            return update(userData).then((response) => {
                                                const data = this.state.users;
                                                const index = data.indexOf(oldData);
                                                // data[index] = newData;
                                                data[index] = response.data;
                                                this.setState({ users: data, status: null }, () => resolve())
                                            })
                                                .catch((error) => {
                                                    console.log(error);
                                                    let errorMsg = "Unable to edit user."
                                                    this.setState({ status: errorMsg }, () => reject());
                                                });
                                        }
                                    })
                            }}
                        />
                    </PortletBody>
                </Portlet>
            </>
        );
    }
}

export default injectIntl(connect(null, users.actions)(Users));