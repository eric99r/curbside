import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Radio, RadioGroup,
    FormHelperText, FormControlLabel, FormControl, FormLabel,
    Button,
    Checkbox,
    TextField,
    Grid
} from '@material-ui/core';
import { Formik } from "formik";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import FormikDropzone from '../../../../partials/content/FormikDropzone';
import StatusBubble from "../../../../partials/content/StatusBubble";
import * as contactInfoApi from '../../../../crud/contact_info.crud';
import * as filesApi from '../../../../crud/files.crud';
import * as onboarding from '../../../../store/ducks/onboarding.duck';
import { onboardingSections, onboardingStatus } from '../onboarding.constants';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import ToolTipsTag from '../../../../partials/content/ToolTipsTag';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: "wrap"
    },
    formControl: {
        margin: theme.spacing(1),
        display: "flex",
        minWidth: 120
    },
    group: {
        margin: theme.spacing(1),
    },
    paper: {
        margin: theme.spacing(2),
        padding: theme.spacing(2),
        width: "100%"
    }
}));

function ContactInfoStep(props) {

    const { intl } = props;
    const classes = useStyles();

    const step = onboardingSections.ACCESS_AND_CONTENT.steps.ContactInfo;

    const [state, setState] = useState({
        hasFetched: false,
        contactInfoData: undefined,
        error: undefined
    });

    useEffect(() => {

    }, [state]);

    useEffect(() => {
        let contactInfoData = undefined;
        contactInfoApi.getContactInfoByOrganizationId(props.organization.id)
            .then(response => {
                if (response.status === 200) {
                    contactInfoData = response.data[0];
                    setState({ ...state, hasFetched: true, contactInfoData });
                }
            }).catch(error => {
                console.log("ContactInfo Get Error", error);
            });
    }, []);

    function validate(values) {
        const errors = {};
        const Emailpattern = new RegExp('!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i');
        // const Phonepattern = new RegExp(('^[0-9]{3}-[0-9]{3}-[0-9]{4}$') | ('^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$')); 
        const Phonepattern = new RegExp('^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$');

        if (values.contactName === "") {
            errors.contactName = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
            });
        }

        if (!values.contactEmail) {
            errors.contactEmail = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
            });
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.contactEmail)
        ) {
            errors.contactEmail = intl.formatMessage({
                id: "AUTH.VALIDATION.INVALID_FIELD"
            });
        }
        
        if (!values.contactNumber) {
            errors.contactNumber = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
            });
        } else if (
            // !/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/i.test(values.contactNumber)
            !Phonepattern.test(values.contactNumber)
        ) {
            errors.contactNumber = intl.formatMessage({
                id: "GENERAL.VALIDATION.INVALID_PHONE"
            });
        }

        return errors;
    }

    async function CreateOrUpdateContactInfoAsync(contactInfoData, currentState) {
        currentState = currentState || state;

        if (!currentState.contactInfoData) {
            return await contactInfoApi.createContactInfo(contactInfoData)
        }
        else {
            contactInfoData = {
                ...contactInfoData,
                id: state.contactInfoData.id
            };
            return await contactInfoApi.updateContactInfo(contactInfoData);
        }
    }

    function handleSubmit(values, { setStatus, setSubmitting }) {
        setSubmitting(true);
        setStatus("");
        let formattedContactNumber = values.contactNumber.replace(/\s/g,'');
        formattedContactNumber = formattedContactNumber.replace(/-/g, "");
        let contactInfoData = {
            organizationId: props.organization.id,
            contactName: values.contactName,
            contactEmail: values.contactEmail,
            contactNumber: formattedContactNumber
        };

        CreateOrUpdateContactInfoAsync(contactInfoData)
            .then(response => {
                if (response.status === 200) {
                    if (values.formAction === "submit") {
                        setStatus("");
                        completeStep();
                    }
                    else if (values.formAction === "save") {
                        setStatus("Saved information successfully.");
                    }
                    setSubmitting(false);

                    setState({ ...state, contactInfoData: response.data, error: false });
                }
            }).catch(error => {
                console.log("ContactInfo Create/Update Error", error);
                setStatus("Failed to save information.");
                setSubmitting(false);
                setState({ error: true });
            });
    }

    function completeStep() {
        props.completeStep(step.name);  //Complete current step i.e Contact info
        props.completeStep(onboardingSections.ACCESS_AND_CONTENT.name);     //Complete Parent step i.e Access and Content
        props.setStepStatus(onboardingSections.FINAL_REVIEW.name, onboardingStatus.UNLOCKED);    //Unlocked next step i.e Final review
    }

    function getFormattedContactNumber(contactnumber) {
        let cleaned = contactnumber.replace(/\s/g,'');
        cleaned = cleaned.replace(/-/g, "");
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
        if (match) {
            return match[1] + ' ' + match[2] + '-' + match[3]
        }
        return null
    }
    
    return (
        <div className="kt-section">
            <div className="kt-section__content">
                <div className={classes.root}>
                    {state.hasFetched && <Formik
                        initialValues={{
                            contactName: state.contactInfoData ? state.contactInfoData.contactName : "",
                            contactEmail: state.contactInfoData ? state.contactInfoData.contactEmail : "",
                            contactNumber: state.contactInfoData ? getFormattedContactNumber(state.contactInfoData.contactNumber) : "",
                            formAction: "submit"
                        }}
                        validate={validate}
                        onSubmit={(values, { setStatus, setSubmitting }) => { handleSubmit(values, { setStatus, setSubmitting }); }}
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
                            setFieldValue
                        }) => (
                                <div className={classes.root}>
                                    <form onSubmit={handleSubmit} noValidate autoComplete="off">
                                        <p>
                                            In addition to the contact information for our customer service team, 
                                            we will include the contact information for your college representative on the FAQ page for your store. 
                                            Please provide the name and contact information for the individual you would like to serve as your college representative.
                                        </p>
                                        <div className="form-group mb-0">
                                            <Grid container>
                                                <Grid item md={4}>
                                                    <TextField
                                                        className={classes.textField}
                                                        label="Contact Name"
                                                        name="contactName"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.contactName}
                                                        helperText={touched.contactName && errors.contactName}
                                                        error={Boolean(touched.contactName && errors.contactName)}
                                                        />
                                                </Grid>
                                                <Grid item md={4}>
                                                    <TextField
                                                        className={classes.textField}
                                                        label="Contact Email"
                                                        name="contactEmail"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.contactEmail}
                                                        helperText={touched.contactEmail && errors.contactEmail}
                                                        error={Boolean(touched.contactEmail && errors.contactEmail)}
                                                        />
                                                </Grid>
                                                <Grid item md={4}>
                                                    <TextField
                                                        className={classes.textField}
                                                        label="Contact Phone Number"
                                                        name="contactNumber"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.contactNumber}
                                                        helperText={touched.contactNumber && errors.contactNumber}
                                                        error={Boolean(touched.contactNumber && errors.contactNumber)}
                                                        />
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <br/>
                                        <StatusBubble
                                            status={status}
                                            error={state.error}
                                        />
                                        <br/><br/>

                                        <div className="form-group" style={{ textAlign: 'center' }}>
                                            <Button
                                                disabled={!touched || isSubmitting}
                                                onClick={() => {
                                                    setFieldValue("formAction", "save", false);
                                                    handleSubmit();
                                                }}
                                            >
                                                Save Progress
                                            </Button>
                                            <Button
                                                variant="contained"
                                                disabled={isSubmitting}
                                                color="primary"
                                                onClick={() => {
                                                    setFieldValue("formAction", "submit", false);
                                                    handleSubmit();
                                                }}
                                            >
                                                Save & Proceed
                                            </Button>
                                        </div>

                                    </form>
                                </div>
                            )}
                    </Formik>
                    }
                </div>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        onboarding: state.onboarding,
        organization: state.organization.organization
    }
}

export default injectIntl(
    connect(
        mapStateToProps,
        onboarding.actions,
    )(ContactInfoStep)
);