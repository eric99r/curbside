import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Typography,
    Button,
    Paper,
    FormHelperText
} from '@material-ui/core';
import { Formik } from "formik";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";

import * as onboarding from '../../../../store/ducks/onboarding.duck';
import * as brand from '../../../../store/ducks/brand.duck';
import * as brandApi from '../../../../crud/brands.crud';
import { onboardingSections, onboardingStatus, getOnboardingStatus } from '../onboarding.constants';

import EditableList from "../../../../partials/content/EditableList";
import UploadLogosModal from "../../../../partials/content/UploadLogosModal";
import LogoList from "../../../../partials/content/LogoList";

const useStyles = makeStyles(theme => ({
    root: {
        //display: "flex",
        flexWrap: "wrap"
    },
    formControl: {
        margin: theme.spacing(1),
        display: "flex",
        minWidth: 120
    },
    group: {
        //margin: theme.spacing(1),
    },
    paper: {
        margin: theme.spacing(2),
        padding: theme.spacing(2)
    }
}));

function LogosAndApprovedColorsStep(props) {

    const { intl, auth, brand, organization, onboarding } = props;

    const classes = useStyles();

    const step = onboardingSections.BRANDING.steps.LOGOS_AND_APPROVED_COLORS;

    const [state, setState] = useState({
        submitted: false,
        hasFetched: false,
        approvedColors: [],
        logos: [],
        pendingDelete: {
            approvedColors: [],
            logos: []
        },
        error: undefined
    });

    const [showUploadLogoModal, setShowUploadLogoModal] = useState(false);

    // Load data.
    useEffect(() => {
        if (!brand) {
            props.getBrandByOrganizationId(auth.userData.account);
        } else {
            setState({
                ...state,
                logos: brand.logos || [],
                approvedColors: brand.approvedColors || [],
                hasFetched: true,
                error: false
            });
        }
    }, []);

    useEffect(() => {
        if (brand) {
            setState({
                ...state,
                logos: brand.logos || [],
                approvedColors: brand.approvedColors || [],
                hasFetched: true,
                error: false
            });
        }
    }, [brand]);

    useEffect(() => {
        // Submitted step with no errors--complete.
        if (state.submitted && brand && !brand.error) {
            setState({ ...state, submitted: false });
            completeStep();
        }
        // Submitted but errors occurred--reset.
        else if (state.submitted) {
            setState({ ...state, submitted: false });
        }
    }, [state]);

    function validate(values) {
        const errors = {};

        if (!values.approvedColors || values.approvedColors && values.approvedColors.length === 0) {
            errors.approvedColors = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
            });
        }

        if (state.logos.length === 0) {
            errors.logos = "You must upload at least one logo."
        }

        return errors;
    }

    async function uploadLogos(logos) {
        let promises = [];
        for (let i = 0; i < logos.length; i++) {
            if (logos[i].id) {
                if (logos[i].imageFile || brand.logos.some(l => l.id === logos[i].id && (l.logoType !== logos[i].logoType))) {
                    promises.push(await brandApi.updateLogo({ ...logos[i], companyCode: organization.company_Code }));
                }
            } else if (logos[i].imageFile) {
                promises.push(await brandApi.createLogo({ ...logos[i], brandId: brand.id, companyCode: organization.company_Code }));
            }
        }
        return await Promise.all(promises);
    }

    async function deleteLogos(logos) {
        let promises = [];
        for (let i = 0; i < logos.length; i++) {
            promises.push(await brandApi.deleteLogo(logos[i]));
        }
        return await Promise.all(promises);
    }

    async function handleBrandUpdates(currentState) {
        currentState = currentState || state;
        // Update brand.
        const updatedBrand = {
            ...brand,
            logos: currentState.logos,
            approvedColors: currentState.approvedColors
        };
        const result = await props.updateBrand(updatedBrand);
        return result;
    }

    async function deleteApprovedColors(approvedColors) {
        let promises = [];
        for (let i = 0; i < approvedColors.length; i++) {
            promises.push(await brandApi.deleteApprovedColor(approvedColors[i]));
        }
        return await Promise.all(promises);
    }

    function handleSubmit(values, { setStatus, setSubmitting }) {
        let nextState = { ...state, error: false };

        setSubmitting(true);
        deleteLogos(state.pendingDelete.logos).then(results => {
            let failedPendingDeletes = state.pendingDelete.logos;
            for (let i = 0; i < results.length; i++) {
                if (results[i].status === 200) {
                    failedPendingDeletes = failedPendingDeletes.filter(d => d.id !== state.pendingDelete.logos[i].id);
                }
                else {
                    nextState = {
                        ...nextState,
                        error: true
                    }
                }
            }
            nextState = {
                ...nextState,
                pendingDelete: { ...nextState.pendingDelete, logos: failedPendingDeletes }
            };
            if (nextState.error) {
                props.setStepMessage(step.name, "Failed to delete some files.", "danger");
                setSubmitting(false);
                setState(nextState);
                return;
            }


            deleteApprovedColors(state.pendingDelete.approvedColors).then(results => {
                let failedPendingDeletes = state.pendingDelete.logos;
                for (let i = 0; i < results.length; i++) {
                    if (results[i].status === 200) {
                        failedPendingDeletes = failedPendingDeletes.filter(d => d.id !== state.pendingDelete.approvedColors[i].id);
                    }
                    else {
                        nextState = {
                            ...nextState,
                            error: true
                        }
                    }
                }
                nextState = {
                    ...nextState,
                    pendingDelete: { ...nextState.pendingDelete, approvedColors: failedPendingDeletes }
                };
                if (nextState.error) {
                    props.setStepMessage(step.name, "Failed to delete some files.", "danger");
                    setSubmitting(false);
                    setState(nextState);
                    return;
                }


                uploadLogos(state.logos).then(results => {
                    for (let i = 0; i < results.length; i++) {
                        if (results[i].status === 200) {
                            nextState = {
                                ...nextState,
                                logos: nextState.logos.map(l => l.name === results[i].data.name ? results[i].data : l)
                            }
                        } else {
                            nextState = {
                                ...nextState,
                                error: true
                            }
                        }
                    }
                    if (nextState.error) {
                        props.setStepMessage(step.name, "Failed to upload some files.", "danger");
                        setSubmitting(false);
                        setState(nextState);
                        return;
                    }


                    handleBrandUpdates(nextState).then(result => {
                        if (values.formAction === "submit") {
                            setState({ ...nextState, submitted: true, error: false });
                            props.setStepMessage(step.name, "");
                        } else if (values.formAction === "save") {
                            setState({ ...nextState, error: false });
                            props.setStepMessage(step.name, "Saved information successfully.");
                        }
                        setSubmitting(false);
                    }).catch(error => {
                        nextState = { ...nextState, error: true }
                        props.setStepMessage(step.name, "Failed to update accepted colors.", "danger");
                        setSubmitting(false);
                        setState(nextState);
                    });
                }).catch(error => {
                    nextState = { ...nextState, error: true }
                    props.setStepMessage(step.name, "Failed to upload logos.", "danger");
                    setSubmitting(false);
                    setState(nextState);
                });
            }).catch(error => {
                nextState = { ...nextState, error: true }
                props.setStepMessage(step.name, "Failed to delete accepted colors.", "danger");
                setSubmitting(false);
                setState(nextState);
            });
        }).catch(error => {
            nextState = { ...nextState, error: true }
            props.setStepMessage(step.name, "Failed to delete files.", "danger");
            setSubmitting(false);
            setState(nextState);
        });
    }

    function completeStep() {
        // Complete step.
        props.completeStep(step.name);
        // Complete section since this is the last step.
        props.completeStep(onboardingSections.BRANDING.name);
        // Unlock next section if it's not already.
        if (getOnboardingStatus(onboarding.statuses, onboardingSections.CATALOG_AND_PRODUCTS.name) === onboardingStatus.LOCKED) {
            props.setStepStatus(onboardingSections.CATALOG_AND_PRODUCTS.name, onboardingStatus.UNLOCKED);
            // Unlock first step of next section.
            props.setStepStatus(onboardingSections.CATALOG_AND_PRODUCTS.steps.SPONSORED_APPAREL_BRANDS.name, onboardingStatus.UNLOCKED);
        }
    }

    function getUpdatedList(list, valueKeyName, oldData, newData, action) {
        if (action === "add") {
            return list.concat([{ [valueKeyName]: newData.name }]);
        }
        else if (action === "update") {
            return list.map(v => v[valueKeyName] === oldData.name ? { ...v, [valueKeyName]: newData.name } : v);
        }
        else if (action === "delete") {
            return list.filter(v => v[valueKeyName] !== oldData.name);
        }
        return list;
    }

    function mapTableDataToBrandData(listName, tableData) {
        if (listName === "approvedColors") {
            return state.approvedColors.find(c => c.id === tableData.id);
        }
        return null;
    }

    function onColorsChange(oldData, newData, action) {
        const approvedColors = getUpdatedList(state.approvedColors, "name", oldData, newData, action);
        const colorsToDelete = state.pendingDelete.approvedColors;
        if (action === "delete" && oldData.id) {
            let mappedData = mapTableDataToBrandData("approvedColors", oldData);
            if (mappedData) {
                colorsToDelete.push(mappedData);
            }
        }
        setState({ ...state, approvedColors, pendingDelete: { ...state.pendingDelete, approvedColors: colorsToDelete } });
    }

    function onLogosAdded(logos) {
        setState({ ...state, logos: state.logos.concat(logos) });
    }

    function handleLogoChanged(logo) {
        setState({ ...state, logos: state.logos.map(l => l.imageUrl === logo.imageUrl ? logo : l) });
    }

    function handleLogoDeleted(logo) {
        if (logo.id) {
            setState({
                ...state,
                logos: state.logos.filter(i => i.imageUrl !== logo.imageUrl),
                pendingDelete: { ...state.pendingDelete, logos: state.pendingDelete.logos.concat([logo]) }
            });
        }
        else {
            setState({
                ...state,
                logos: state.logos.filter(i => i.imageUrl != logo.imageUrl)
            });
        }
    }

    function onKeyDown(keyEvent) {
        if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
            keyEvent.preventDefault();
        }
    }

    function openUploadLogosModal() {
        setShowUploadLogoModal(true);
    }

    const editableListValidator = (newData, oldData, allData, mode) => {
        let errors = {};
        if (mode === "update") {
            const index = allData.indexOf(oldData);
            if (!newData.name) {
                errors.name = "Name must not be empty.";
            }
            else if (allData.some((item, itemIndex) => item.name === newData.name && itemIndex !== index)) {
                errors.name = "Cannot have duplicates.";
            }
        }
        return errors;
    }

    if (state.hasFetched && !brand) {
        return <p>Failed to load information.</p>
    }
    return (
        <>
            {
                showUploadLogoModal &&
                <UploadLogosModal
                    logos={state.logos}
                    onComplete={onLogosAdded}
                    onExit={() => { setShowUploadLogoModal(false); }}
                />
            }

            <div className="kt-section">
                <div className="kt-section__content">
                    <div className={classes.root}>
                        {state.hasFetched && <Formik
                            initialValues={{
                                approvedColors: state.approvedColors,
                                formAction: "save"
                            }}
                            validate={validate}
                            onSubmit={(values, { setStatus, setSubmitting }) => { handleSubmit(values, { setStatus, setSubmitting }); }}
                            onKeyDown={onKeyDown}
                            validateOnChange={false}
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
                                setFieldValue,
                                dirty
                            }) => (
                                    <div className={classes.root}>
                                        <form onSubmit={handleSubmit} noValidate autoComplete="off">
                                            <Paper className={classes.paper} variant="outlined" elevation={0}>
                                                <Typography variant="subtitle1">Your Logos</Typography>
                                                <div className="form-group mb-0">
                                                    <p>
                                                        All logos must be provided in a layered vector form (i.e. EPS, AI or Illustrator compatible). Having the native files helps us ensure we are hitting your colors on all pieces of our equipment and allows us to make any adjustments needed.
                                                    </p>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <Button
                                                            onClick={openUploadLogosModal}
                                                        >
                                                            Upload Logos
                                                        </Button>
                                                    </div>
                                                    {
                                                        state.logos.length > 0 &&
                                                        <>
                                                            <br />
                                                            <LogoList
                                                                logos={state.logos}
                                                                onChange={handleLogoChanged}
                                                                onRemove={handleLogoDeleted}
                                                            />
                                                        </>
                                                    }
                                                    {
                                                        errors.logos && <FormHelperText error>{errors.logos}</FormHelperText>
                                                    }
                                                </div>
                                            </Paper>

                                            <Paper className={classes.paper} variant="outlined" elevation={0}>
                                                <Typography variant="subtitle1">Your PMS Colors</Typography>
                                                <div className="form-group mb-0">
                                                    <p>
                                                        PMS stands for Pantone Matching System. Most colors contained in logos can be identified using a number in this system. Knowing the PMS number for each of the primary colors in your logos will help us to achieve an accurate color match.
                                                    </p>
                                                    <EditableList
                                                        validator={editableListValidator}
                                                        className={classes}
                                                        name="approvedColors"
                                                        inputFieldLabel="Color"
                                                        inputFieldPlaceholder="Enter PMS color"
                                                        items={state.approvedColors.map(approvedColor => { return { id: approvedColor.id, name: approvedColor.name } })}
                                                        onChange={onColorsChange}
                                                    />
                                                    <br />
                                                </div>
                                            </Paper>

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
        </>
    );
}

function mapStateToProps(state) {
    return {
        auth: state.auth.user,
        brand: state.brand.brand,
        organization: state.organization.organization,
        onboarding: state.onboarding,
    }
}

export default injectIntl(
    connect(
        mapStateToProps,
        { ...onboarding.actions, ...brand.actions },
    )(LogosAndApprovedColorsStep)
);