import React, { useState } from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import { Grid, InputLabel, FormControl, MenuItem, Select, Checkbox, FormControlLabel, TextField, FormHelperText, Paper } from "@material-ui/core";
import * as organization from "../../../store/ducks/organization.duck";
import { createOrganization } from "../../../crud/organization.crud";

import { makeStyles } from "@material-ui/core/styles";

function CreateOrganization(props) {
  const { intl } = props;

  const [complete, setComplete] = useState(false);

  const handleFormCompletion = () => setComplete(true);

  function handleSubmit(values, { setStatus, setSubmitting }) {
    setSubmitting(true);
    createOrganization({
      companyName: values.companyName,
      companyType: values.companyType,
      storeType: values.storeType,
      programManager: values.programManager,
      salesperson: values.salesperson,
      salespersonGetsCommission: values.areCommissionsPaid,
      contactEmail: values.contactsEmail,
      contactFirstName: values.contactsFirstName,
      contactLastName: values.contactsLastName
    }).then((data) => {
      if (data.status === 200) {
        props.setOrganization(data.data);
        setStatus(
          intl.formatMessage(
            { id: "ORGANIZATION.CREATE.SUCCESS" },
            { name: values.companyName }
          )
        );
        handleFormCompletion();
      }
    }).catch((error) => {
      setSubmitting(false);
      if (Math.floor((error.response.status / 100)) === 4) {
        setStatus(
          error.response.data
        );
      }
      else {
        setStatus(
          intl.formatMessage({
            id: "GENERAL.API.ERROR"
          })
        );
      }
    });
  }

  const useStyles = makeStyles(theme => ({
    root: {
      display: "flex",
      flexWrap: "wrap"
    },
    formControl: {
      margin: theme.spacing(1, 0),
      display: "flex",
      minWidth: 120
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    },
    paper: {
      //width: "100%",
      margin: theme.spacing(2),
      padding: theme.spacing(2)
    }
  }));

  const classes = useStyles();

  const companyTypes = [
    { name: "College" },
    { name: "Corporate" },
    { name: "Fraternity" },
    { name: "Sorority" }
  ]

  const storeTypes = [
    { name: "Single-Company", value: "SingleCompany" },
    { name: "Multi-Company", value: "MultiCompany" }
  ]

  const salespeople = [
    { name: "John Doe" }
  ]

  const programManagers = [
    { name: "Chantil Guinn" },
    { name: "Brian Shellbach" }
  ]

  return (
    <div className="kt-section">
      <div className="kt-section__content">
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <h3>
              <FormattedMessage id="ORGANIZATION.CREATE.TITLE" />
            </h3>
            {complete && <Redirect to="/customer" />}
            <Formik
              initialValues={{
                companyName: "",
                companyType: "",
                storeType: "",
                programManager: "",
                salesperson: "",
                areCommissionsPaid: false,
                contactsFirstName: "",
                contactsLastName: "",
                contactsEmail: ""
              }}
              validate={values => {
                const errors = {};

                if (!values.contactsEmail) {
                  errors.contactsEmail = intl.formatMessage({
                    id: "GENERAL.VALIDATION.REQUIRED_FIELD"
                  });
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.contactsEmail)
                ) {
                  errors.contactsEmail = intl.formatMessage({
                    id: "GENERAL.VALIDATION.INVALID_FIELD"
                  });
                }

                if (!values.companyName) {
                  errors.companyName = intl.formatMessage({
                    id: "GENERAL.VALIDATION.REQUIRED_FIELD"
                  });
                }

                if (!values.contactsFirstName) {
                  errors.contactsFirstName = intl.formatMessage({
                    id: "GENERAL.VALIDATION.REQUIRED_FIELD"
                  });
                }

                if (!values.contactsLastName) {
                  errors.contactsLastName = intl.formatMessage({
                    id: "GENERAL.VALIDATION.REQUIRED_FIELD"
                  });
                }

                if (!values.companyType) {
                  errors.companyType = intl.formatMessage({
                    id: "GENERAL.VALIDATION.REQUIRED_FIELD"
                  });
                }

                if (!values.storeType) {
                  errors.storeType = intl.formatMessage({
                    id: "GENERAL.VALIDATION.REQUIRED_FIELD"
                  });
                }

                if (!values.programManager) {
                  errors.programManager = intl.formatMessage({
                    id: "GENERAL.VALIDATION.REQUIRED_FIELD"
                  });
                }

                if (!values.salesperson) {
                  errors.salesperson = intl.formatMessage({
                    id: "GENERAL.VALIDATION.REQUIRED_FIELD"
                  });
                }

                return errors;
              }}
              onSubmit={handleSubmit.bind(this)}
            >
              {({
                values,
                status,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting
              }) => (
                  <form onSubmit={handleSubmit} noValidate autoComplete="off">
                    {status && (
                      <div role="alert" className="alert alert-danger">
                        <div className="alert-text">{status}</div>
                      </div>
                    )}

                    <Grid container>
                      <Grid item xs={7}>
                        <Paper variant="outlined" className={classes.paper}>
                          <h4>Basic Customer Information</h4>

                          <div className="form-group mb-0">
                            <TextField
                              margin="normal"
                              label="Company Name"
                              className="kt-width-full"
                              name="companyName"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.companyName}
                              helperText={touched.companyName && errors.companyName}
                              error={Boolean(touched.companyName && errors.companyName)}
                            />
                          </div>

                          <div className="form-group mb-0">
                            <FormControl className={classes.formControl} error={Boolean(touched.companyType && errors.companyType)}>
                              <InputLabel htmlFor="companyType">Company Type</InputLabel>
                              <Select
                                label="Company Type"
                                name="companyType"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.companyType}
                              >
                                {companyTypes.map((ct, index) => <MenuItem key={index} value={ct.value || ct.name}>{ct.name}</MenuItem>)}
                              </Select>
                              <FormHelperText>{touched.companyType && errors.companyType}</FormHelperText>
                            </FormControl>
                          </div>

                          <div className="form-group mb-0">
                            <FormControl className={classes.formControl} error={Boolean(touched.storeType && errors.storeType)}>
                              <InputLabel htmlFor="storeType">Store Type</InputLabel>
                              <Select
                                label="Store Type"
                                name="storeType"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.storeType}
                                error={Boolean(touched.storeType && errors.storeType)}
                              >
                                {storeTypes.map((st, index) => <MenuItem key={index} value={st.value || st.name}>{st.name}</MenuItem>)}
                              </Select>
                              <FormHelperText>{touched.storeType && errors.storeType}</FormHelperText>
                            </FormControl>
                          </div>
                        </Paper>
                      </Grid>
                      <Grid item xs={5}>
                        <Paper variant="outlined" className={classes.paper}>
                          <h4>Program Manager</h4>

                          <div className="form-group mb-0">
                            <FormControl className={classes.formControl} error={Boolean(touched.programManager && errors.programManager)}>
                              <InputLabel htmlFor="programManager">Program Manager</InputLabel>
                              <Select
                                label="Program Manager"
                                name="programManager"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.programManager}
                                error={Boolean(touched.programManager && errors.programManager)}
                              >
                                {programManagers.map((pm, index) => <MenuItem key={index} value={pm.value || pm.name}>{pm.name}</MenuItem>)}
                              </Select>
                              <FormHelperText>{touched.programManager && errors.programManager}</FormHelperText>
                            </FormControl>
                          </div>
                        </Paper>

                        <Paper variant="outlined" className={classes.paper}>
                          <h4>Sales Information</h4>

                          <div className="form-group mb-0">
                            <FormControl className={classes.formControl} error={Boolean(touched.salesperson && errors.salesperson)}>
                              <InputLabel htmlFor="salesperson">Salesperson</InputLabel>
                              <Select
                                label="Salesperson"
                                name="salesperson"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.salesperson}
                                error={Boolean(touched.salesperson && errors.salesperson)}
                              >
                                {salespeople.map((sp, index) => <MenuItem key={index} value={sp.value || sp.name}>{sp.name}</MenuItem>)}
                              </Select>
                              <FormHelperText>{touched.salesperson && errors.salesperson}</FormHelperText>
                            </FormControl>
                          </div>

                          <div className="form-group mb-0">
                            <FormControl className={classes.formControl} error={Boolean(touched.areCommissionsPaid && errors.areCommissionsPaid)}>
                              <FormControlLabel
                                value="Commissions paid?"
                                control={<Checkbox
                                  color="primary"
                                  name="areCommissionsPaid"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  checked={values.areCommissionsPaid}
                                />}
                                label="Commissions paid?"
                              />
                              <FormHelperText>{touched.areCommissionsPaid && errors.areCommissionsPaid}</FormHelperText>
                            </FormControl>
                          </div>
                        </Paper>
                      </Grid>
                      <Grid item xs={12}>
                        <Paper variant="outlined" className={classes.paper}>
                          <h4>Customer Onboarding Contact</h4>
                          <p>A CSP User Account will be created for this contact automatically when the Customer Account is created.</p>

                          <div className="form-group mb-0">
                            <TextField
                              margin="normal"
                              label="First Name"
                              className="kt-width-full"
                              name="contactsFirstName"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.contactsFirstName}
                              helperText={touched.contactsFirstName && errors.contactsFirstName}
                              error={Boolean(touched.contactsFirstName && errors.contactsFirstName)}
                            />
                          </div>

                          <div className="form-group mb-0">
                            <TextField
                              margin="normal"
                              label="Last Name"
                              className="kt-width-full"
                              name="contactsLastName"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.contactsLastName}
                              helperText={touched.contactsLastName && errors.contactsLastName}
                              error={Boolean(touched.contactsLastName && errors.contactsLastName)}
                            />
                          </div>

                          <div className="form-group mb-0">
                            <TextField
                              label="Email"
                              margin="normal"
                              className="kt-width-full"
                              name="contactsEmail"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.contactsEmail}
                              helperText={touched.contactsEmail && errors.contactsEmail}
                              error={Boolean(touched.contactsEmail && errors.contactsEmail)}
                            />
                          </div>
                        </Paper>
                      </Grid>
                    </Grid>

                    <div className="kt-login__actions">
                      <Link to="/customer">
                        <button type="button" className="btn btn-secondary btn-elevate kt-login__btn-secondary">
                          Back
                  </button>
                      </Link>

                      <button
                        disabled={complete || isSubmitting}
                        className="btn btn-primary btn-elevate kt-login__btn-primary"
                      >
                        Submit
                </button>
                    </div>

                  </form>
                )}
            </Formik>
          </Paper>
        </div>
      </div>
    </div>
  );
}

export default injectIntl(
  connect(
    null,
    organization.actions
  )(CreateOrganization)
);
