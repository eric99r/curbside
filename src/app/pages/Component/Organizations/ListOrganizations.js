import React, { useState, useEffect } from "react";
import {
    makeStyles
} from "@material-ui/core/styles";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Fab
} from "@material-ui/core";
import {
    Portlet,
    PortletBody,
    PortletHeader,
    PortletHeaderToolbar
} from "../../../partials/content/Portlet";
import AddIcon from "@material-ui/icons/Add";
import * as organization from "../../../store/ducks/organization.duck";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";

import { Link, useHistory } from 'react-router-dom';

import MaterialTable from 'material-table';

function TextToggleableConfirmModal(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <a onClick={handleShow}>
                {props.triggerDisplayText}
            </a>
            <Dialog
                open={show}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {props.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {props.body}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        {props.exitText || "Close"}
                    </Button>
                    <Button onClick={() => { props.onConfirm(); handleClose(); }} color="primary" autoFocus>
                        {props.confirmText || "Confirm"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

function ListOrganizations(props) {

    useEffect(() => {
        props.getAllOrganizations();
    }, []);

    const customers = props.organizations || [
        {
            id: 1,
            companyCode: "ABC",
            companyName: "ABC College",
            companyType: "College",
            programManager: "Chantil Guinn",
            salesperson: "John Doe",
            active: true,
            percentOnboardingComplete: 10
        },
        {
            id: 2,
            companyCode: "DGO",
            companyName: "David's Great Outdoors",
            companyType: "Corporate",
            programManager: "Chantil Guinn",
            salesperson: "John Doe",
            active: true,
            percentOnboardingComplete: 50
        }
    ]

    function createData(customer) {
        return {
            id: customer.id,
            companyCode: customer.company_Code,
            companyName: customer.company_Name,
            companyType: customer.companyTypeName,
            programManager: customer.pM_name,
            salesperson: customer.salesperson_Code,
            active: customer.isActivated,
            percentOnboardingComplete: customer.percentOnboardingComplete || 0,
            data: customer
        };
    }

    const rows = customers.map(createData);

    const useStyles = makeStyles(theme => ({
        root: {
            width: "100%"
            //marginTop: theme.spacing(1)
        },
        paper: {
            width: "100%",
            marginBottom: theme.spacing(2)
        },
        table: {
            minWidth: 750
        },
        tableWrapper: {
            overflowX: "auto"
        }
    }));

    const classes = useStyles();

    const materialTableColumns = [
        { field: "companyCode", title: "Company Code" },
        { field: "companyName", title: "Company Name" },
        { field: "companyType", title: "Company Type" },
        { field: "programManager", title: "Program Manager" },
        { field: "salesperson", title: "Salesperson" },
        {
            field: "active",
            title: "Status",
            render: row => (
                row.active ? "Active" : "Inactive"
            )
        },
        { field: "percentOnboardingComplete", type: "numeric", title: "Percent Complete" },
        {
            field: 'actions',
            title: 'Actions',
            render: row => (
                <>
                    <TextToggleableConfirmModal
                        triggerDisplayText={row.active ? "Deactivate" : "Activate"}
                        onConfirm={() => { props.toggleOrganizationActiveStatus(row.data) }}
                        title={(row.active ? "Deactivate " : "Activate ") + row.companyName + "?"}
                        body={
                            row.active
                                ? "Deactivating " + row.companyName + " will deactivate all customer users associated to " + row.companyName + ", revoking the customer's access to CSP and preventing the customer from completing the onboarding process."
                                : "Activating " + row.companyName + " will activate all customer users associated to " + row.companyName + ", reinstating the customer's access to CSP and allowing the customer to resume the onboarding process."
                        }
                    />, <Link to="#">Onboarding</Link>
                </>
            )
        }
    ];

    const history = useHistory();

    const [showActivationModal, setShowActivationModal] = useState(false);
    const [activationModalProps, setActivationModalProps] = useState({});

    function showConfirmToggleActivationModal(row) {
        setShowActivationModal(true);
        const modalProps = {
            onConfirm: () => { props.toggleOrganizationActiveStatus(row.data) },
            onExit: () => { setShowActivationModal(false) },
            title: (row.active ? "Deactivate " : "Activate ") + row.companyName + "?",
            body: row.active
                ? "Deactivating " + row.companyName + " will deactivate all customer users associated to " + row.companyName + ", revoking the customer's access to CSP and preventing the customer from completing the onboarding process."
                : "Activating " + row.companyName + " will activate all customer users associated to " + row.companyName + ", reinstating the customer's access to CSP and allowing the customer to resume the onboarding process."
        }
        setActivationModalProps(modalProps);
    }

    return (
        <>
            {/*
            {showActivationModal &&
                <ConfirmModal
                    {...activationModalProps}
                />
            }
            */}

            <Portlet>
                <PortletHeader
                    title="Customer Accounts"
                    toolbar={(
                        <PortletHeaderToolbar>
                            <Link to="/customer/create">
                                <Button variant="contained" color="primary">
                                    <i className="fa fa-plus-circle" aria-hidden="true"></i>&nbsp;&nbsp;New Customer Account
                                </Button>
                            </Link>
                        </PortletHeaderToolbar>
                    )}
                />
                <PortletBody>
                    <div className="kt-section">
                        <div className="kt-section__content">
                            <div className={classes.root}>
                                <MaterialTable
                                    title=""
                                    columns={materialTableColumns}
                                    data={rows}
                                    options={{
                                        actionsColumnIndex: -1,
                                        showTitle: false,
                                        search: true,
                                        searchFieldAlignment: "left"
                                    }}
                                /*
                                actions={[
                                    {
                                        icon: "add",
                                        tooltip: "Create new customer account",
                                        isFreeAction: true,
                                        onClick: (event) => { history.push("/customer/create") }
                                    },
                                    rowData => ({
                                        icon: rowData.active ? "business" : "domain_disabled",
                                        tooltip: rowData.active ? "Deactivate Account" : "Activate Account",
                                        onClick: (event, rowData) => { showConfirmToggleActivationModal(rowData) }
                                    }),
                                    {
                                        icon: "arrow_forward",
                                        tooltip: "Go to onboarding",
                                        onClick: (event, rowData) => { console.log("Going to onboarding page") }
                                    }
                                ]}
                                */
                                />
                            </div>
                        </div>
                    </div>
                </PortletBody>
            </Portlet>
        </>
    )
}

function mapStateToProps(state) {
    return { organizations: state.organization.organizations }
}

export default injectIntl(
    connect(
        mapStateToProps,
        organization.actions
    )(ListOrganizations)
);