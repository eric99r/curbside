import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
// import { userActions } from '../_actions';

import { Formik } from "formik";

import { FormattedMessage, injectIntl } from "react-intl";
import * as users from "../../../store/ducks/users.duck";
import { getById, createUserAccount, update } from "../../../crud/users.crud";

import {
    Portlet,
    PortletBody,
    PortletHeader,
    PortletHeaderToolbar
} from "../../../partials/content/Portlet";
import {
    Checkbox,
    Button,
    FormControlLabel,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText
} from "@material-ui/core";

class UserForm extends React.Component {
    title = "Create New User Account";
    btnText = "Create User";
    constructor(props) {
        super(props);
        this.state = {
            user: {
                firstName: '',
                lastName: '',
                email_address: '',
                role: '',
                account: '',
                isActivated: true,
                submitted: false,
                edit: false
            }
        };
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        if (params.id) {
            this.title = "Edit User Account";
            this.btnText = "Update User";
            getById(parseInt(params.id)).then((data) => {
                this.setState({ user: data.data });
                this.setState({ user: { ...this.state.user, edit: true } });
            })
                .catch((error) => {
                    console.log(error);
                });
        }
    }
    roleTypes = [
        { name: "Admin", value: "1" },
        { name: "Customer", value: "2" }
      ]
    customerAccountTypes = [
        { name: "Southwest College", value: "1" },
        { name: "Brown University", value: "2" },
        { name: "Orange College", value: "3" },
        { name: "University of Texas", value: "4" }
    ]
    statusTypes = [
        { name: "Active", value: true },
        { name: "InActive", value: false }
      ]
      
    render() {
        const { intl } = this.props;
        const { isRequested } = this.state;
        const { match: { params } } = this.props;
        let disableField = params.id ? true : false;

        const { firstName, lastName, email_address, role, account, isActivated, submitted } = this.state.user;
        if (params.id && !this.state.user.edit) {
            return null
        }

        let btnMargin = "2px";
        let classes = {
            root: {
                width: '100%',
                //marginTop: theme.spacing(3),
                overflowX: 'auto',
            },
            table: {
                minWidth: 650
            },
            formControl: {
              margin: 0,
            },
        }
        let ddlStyle = {
            minWidth: '100%',
            margin: "16px 0 8px 0"
        }
        return (
            <Portlet>
                <PortletHeader
                    title={this.title}
                    toolbar={(
                        <PortletHeaderToolbar>
                        </PortletHeaderToolbar>
                    )
                    }
                />
                <PortletBody>
                    <Formik
                        initialValues={
                            {
                                firstName: firstName,
                                lastName: lastName,
                                email_address: email_address,
                                role: role,
                                account: account,
                                isActivated: isActivated
                            }
                        }
                        validate={values => {
                            const errors = {};

                            if (!values.email_address) {
                                errors.email_address = intl.formatMessage({
                                    id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                });
                            } else if (
                                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email_address)
                            ) {
                                errors.email_address = intl.formatMessage({
                                    id: "AUTH.VALIDATION.INVALID_FIELD"
                                });
                            }

                            if (!values.firstName) {
                                errors.firstName = intl.formatMessage({
                                    id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                });
                            }
                            if (!values.lastName) {
                                errors.lastName = intl.formatMessage({
                                    id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                });
                            }
                            if (!values.role) {
                                errors.role = intl.formatMessage({
                                    id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                });
                            }
                            if (!values.account) {
                                errors.account = intl.formatMessage({
                                    id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                });
                            }

                            return errors;
                        }}
                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            const { match: { params } } = this.props;
                            let userData = {
                                "firstName": values.firstName,
                                "lastName": values.lastName,
                                "email_address": values.email_address,
                                "Role": values.role,
                                "Account": values.account,
                                "isActivated": values.isActivated

                            }
                            if (params.id) {
                                userData.id = params.id;
                                update(userData).then((data) => {
                                    this.props.history.push('/users')
                                })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            } else {
                                userData.User_Password = "Password@123";
                                createUserAccount(userData).then((data) => {
                                    // return <Redirect to="/users" />;
                                    this.props.history.push('/users')
                                })
                                    .catch((error) => {
                                        console.log(error)
                                        setSubmitting(false);
                                        if(error.response.status === 409) {
                                            setStatus(
                                                intl.formatMessage(
                                                    { id: "AUTH.VALIDATION.ALREADY_USED" }
                                                )
                                            );
                                        }
                                    });
                            }
                        }}
                    >
                        {({
                            values,
                            status,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                            handleCheckBoxChange
                        }) => (
                                <form onSubmit={handleSubmit} className="kt-form">
                                    {status && (
                                        <div role="alert" className="alert alert-danger">
                                            <div className="alert-text">{status}</div>
                                        </div>
                                    )}
                                    <Row>
                                        <Col xl='6'>
                                            <div className="form-group mb-0">
                                                <TextField
                                                    margin="normal"
                                                    label="FirstName"
                                                    className="kt-width-full"
                                                    name="firstName"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.firstName}
                                                    helperText={touched.firstName && errors.firstName}
                                                    error={Boolean(touched.firstName && errors.firstName)}
                                                />
                                            </div>
                                        </Col>
                                        <Col xl='6'>
                                            <div className="form-group mb-0">
                                                <FormControl className={classes.formControl} error={Boolean(touched.role && errors.role)} style={ddlStyle}>
                                                    <InputLabel htmlFor="role-simple">Role</InputLabel>
                                                    <Select
                                                        value={values.role}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        autoWidth
                                                        name="role"
                                                    >
                                                    {this.roleTypes.map((st, index) => <MenuItem key={index} value={st.value}>{st.name}</MenuItem>)}
                                                    </Select>
                                                    <FormHelperText>{touched.role && errors.role}</FormHelperText>
                                                </FormControl>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xl='6'>
                                            <div className="form-group mb-0">
                                                <TextField
                                                    margin="normal"
                                                    label="LastName"
                                                    className="kt-width-full"
                                                    name="lastName"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.lastName}
                                                    helperText={touched.lastName && errors.lastName}
                                                    error={Boolean(touched.lastName && errors.lastName)}
                                                />
                                            </div>
                                        </Col>
                                        <Col xl='6'>
                                            <div className="form-group mb-0">
                                                <FormControl className={classes.formControl} error={Boolean(touched.account && errors.account)} style={ddlStyle} >
                                                    <InputLabel htmlFor="account-simple">Customer Account</InputLabel>
                                                    <Select
                                                        value={values.account}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        autoWidth
                                                        name="account"
                                                    >
                                                    {this.customerAccountTypes.map((st, index) => <MenuItem key={index} value={st.value}>{st.name}</MenuItem>)}
                                                    </Select>
                                                    <FormHelperText>{touched.account && errors.account}</FormHelperText>
                                                </FormControl>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xl='6'>
                                            <div className="form-group mb-0">
                                                <TextField
                                                    type="email"
                                                    label="Email Address"
                                                    margin="normal"
                                                    fullWidth={true}
                                                    name="email_address"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.email_address}
                                                    disabled={this.state.user.edit}
                                                    helperText={touched.email_address && errors.email_address}
                                                    error={Boolean(touched.email_address && errors.email_address)}
                                                />
                                            </div>
                                        </Col>
                                        <Col xl='6'>
                                            <div className="form-group mb-0">
                                                <FormControl className={classes.formControl} error={Boolean(touched.isActivated && errors.isActivated)} style={ddlStyle} >
                                                    <InputLabel htmlFor="account-simple">Status</InputLabel>
                                                    <Select
                                                        value={values.isActivated}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        autoWidth
                                                        name="isActivated"
                                                    >
                                                    {this.statusTypes.map((st, index) => <MenuItem key={index} value={st.value}>{st.name}</MenuItem>)}
                                                    </Select>
                                                    <FormHelperText>{touched.isActivated && errors.isActivated}</FormHelperText>
                                                </FormControl>
                                            </div>
                                        </Col>
                                    </Row>
                                    <br/>
                                    <Row>
                                        <Col>
                                            <div className="kt-login__actions">
                                                <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                                                    {this.btnText}
                                                </Button>
                                            &nbsp;&nbsp;&nbsp;<Link to="/users">
                                                    <Button variant="contained" color="danger">Cancel
                                                </Button>
                                                </Link>
                                            </div>
                                        </Col>
                                    </Row>
                                </form>
                            )}
                    </Formik>
                </PortletBody>
            </Portlet>
        );
    }
}

export default injectIntl(connect(null, users.actions)(UserForm));