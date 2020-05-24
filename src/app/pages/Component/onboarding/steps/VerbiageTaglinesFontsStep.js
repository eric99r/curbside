import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Radio, RadioGroup,
    FormHelperText, FormControlLabel, FormControl, FormLabel,
    Button
} from '@material-ui/core';
import { Formik } from "formik";
import EditableList from "../../../../partials/content/EditableList";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import * as onboarding from '../../../../store/ducks/onboarding.duck';
import * as brand from '../../../../store/ducks/brand.duck';
import * as brandApi from '../../../../crud/brands.crud';
import { onboardingSections, onboardingStatus, getOnboardingStatus } from '../onboarding.constants';

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
        padding: theme.spacing(2),
        width: "100%"
    }
}));

function VerbiageTaglinesFontsStep(props) {

    const { intl, auth, brand, onboarding } = props;

    const classes = useStyles();

    const step = onboardingSections.BRANDING.steps.VERBIAGE_TAGLINES_AND_FONTS;

    const [state, setState] = useState({
        submitted: false,
        hasFetched: false,
        verbiage: [],
        taglines: [],
        fonts: [],
        pendingDelete: {
            verbiage: [],
            taglines: [],
            fonts: []
        },
        error: undefined
    });

    // Load data.
    useEffect(() => {
        if (!brand) {
            props.getBrandByOrganizationId(auth.userData.account);
        } else {
            setState({ ...state, verbiage: brand.verbiage, taglines: brand.taglines, fonts: brand.fonts, hasFetched: true, error: false });
        }
    }, []);

    useEffect(() => {
        if (brand) {
            setState({ ...state, verbiage: brand.verbiage, taglines: brand.taglines, fonts: brand.fonts, hasFetched: true, error: false });
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

        if (!values.hasVerbiage) {
            errors.hasVerbiage = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
            });
        } else if (values.hasVerbiage === "yes"
            && (!values.verbiage || values.verbiage.length === 0)) {
            errors.verbiage = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
            });
        }

        if (!values.hasTaglines) {
            errors.hasTaglines = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
            });
        } else if (values.hasTaglines === "yes"
            && (!values.taglines || values.taglines.length === 0)) {
            errors.taglines = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
            });
        }

        if (!values.hasFonts) {
            errors.hasFonts = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
            });
        } else if (values.hasFonts === "yes"
            && (!values.fonts || values.fonts.length === 0)) {
            errors.fonts = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
            });
        }

        return errors;
    }

    async function handleBrandUpdates(values, currentState) {
        currentState = currentState || state;
        // Update brand.
        const updatedBrand = {
            ...brand,
            hasVerbiage: values.hasVerbiage === "yes",
            hasTaglines: values.hasTaglines === "yes",
            hasFonts: values.hasFonts === "yes",
            verbiage: currentState.verbiage,
            taglines: currentState.taglines,
            fonts: currentState.fonts,
        };
        return await props.updateBrand(updatedBrand);
    }

    async function handleDeletesFor(forList, listData, currentState) {
        currentState = currentState || state;
        let promises = [];
        let listToDelete = listData;
        let action = null;
        let successState = currentState;
        if (forList === "verbiage") {
            action = brandApi.deleteVerbiage;
            successState = {
                ...successState,
                verbiage: successState.verbiage.filter(v => !listToDelete.some(li => li.id === v.id)),
                pendingDelete: { ...successState.pendingDelete, verbiage: [] }
            }
        } else if (forList === "taglines") {
            action = brandApi.deleteTagline;
            successState = {
                ...successState,
                taglines: successState.taglines.filter(t => !listToDelete.some(li => li.id === t.id)),
                pendingDelete: { ...successState.pendingDelete, taglines: [] }
            }
        } else if (forList === "fonts") {
            action = brandApi.deleteFont;
            successState = {
                ...successState,
                fonts: successState.fonts.filter(f => !listToDelete.some(li => li.id === f.id)),
                pendingDelete: { ...successState.pendingDelete, fonts: [] }
            }
        }

        for (let i = 0; i < listToDelete.length; i++) {
            promises.push(await action(listToDelete[i]));
        }
        await Promise.all(promises);

        return successState;
    }

    function handleSubmit(values, { setStatus, setSubmitting }) {
        setSubmitting(true);

        const verbiageToDelete = (values.hasVerbiage === "no" && brand.verbiage.length > 0) ? brand.verbiage : state.pendingDelete.verbiage;
        const taglinesToDelete = (values.hasTaglines === "no" && brand.taglines.length > 0) ? brand.taglines : state.pendingDelete.taglines;
        const fontsToDelete = (values.hasFonts === "no" && brand.fonts.length > 0) ? brand.fonts : state.pendingDelete.fonts;

        handleDeletesFor("verbiage", verbiageToDelete, state).then((stateAfterVerbiageDeletes) => {
            if (values.hasVerbiage === "no") {
                stateAfterVerbiageDeletes = { ...stateAfterVerbiageDeletes, verbiage: [] }
            }
            handleDeletesFor("taglines", taglinesToDelete, stateAfterVerbiageDeletes).then((stateAfterTaglineDeletes) => {
                if (values.hasTaglines === "no") {
                    stateAfterTaglineDeletes = { ...stateAfterTaglineDeletes, taglines: [] }
                }
                handleDeletesFor("fonts", fontsToDelete, stateAfterTaglineDeletes).then((stateAfterFontDeletes) => {
                    if (values.hasFonts === "no") {
                        stateAfterFontDeletes = { ...stateAfterFontDeletes, fonts: [] }
                    }
                    handleBrandUpdates(values, stateAfterFontDeletes).then(() => {
                        if (values.formAction === "submit") {
                            setState({ ...stateAfterFontDeletes, submitted: true, error: false });
                            props.setStepMessage(step.name, "");
                        } else if (values.formAction === "save") {
                            setState({ ...stateAfterFontDeletes, error: false });
                            props.setStepMessage(step.name, "Saved information successfully.");
                        }
                        setSubmitting(false);
                    }).catch(error => {
                        console.log("Failed to update brand.", error);
                        setState({ ...stateAfterFontDeletes, error: true });
                        props.setStepMessage(step.name, "Failed to update information.", "danger");
                    });
                }).catch(error => {
                    console.log("Failed to delete fonts.", error);
                    setState({ ...stateAfterTaglineDeletes, error: true });
                    props.setStepMessage(step.name, "Failed to update information.", "danger");
                });
            }).catch(error => {
                console.log("Failed to delete taglines.", error);
                setState({ ...stateAfterVerbiageDeletes, error: true });
                props.setStepMessage(step.name, "Failed to update information.", "danger");
            });
        }).catch(error => {
            console.log("Failed to delete verbiage.", error);
            setState({ ...state, error: true });
            props.setStepMessage(step.name, "Failed to update information.", "danger");
            setSubmitting(false);
        });
    }

    function completeStep() {
        props.completeStep(step.name);
        if (getOnboardingStatus(onboarding.statuses, onboardingSections.BRANDING.steps.SPORTS_TEAMS.name) === onboardingStatus.LOCKED) {
            props.setStepStatus(onboardingSections.BRANDING.steps.SPORTS_TEAMS.name, onboardingStatus.UNLOCKED);
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
        if (listName === "verbiage") {
            return state.verbiage.find(v => v.id === tableData.id);
        } else if (listName === "taglines") {
            return state.taglines.find(t => t.id === tableData.id);
        } else if (listName === "fonts") {
            return state.fonts.find(f => f.id === tableData.id);
        }
        return null;
    }

    function onListChange(listName, oldData, newData, action) {
        //console.log("List Name", listName, "oldData", oldData, "newData", newData, "action", action);
        if (listName === "verbiage") {
            const verbiage = getUpdatedList(state.verbiage, "verbiageText", oldData, newData, action);
            const verbiageToDelete = state.pendingDelete.verbiage;
            if (action === "delete" && oldData.id) {
                let mappedData = mapTableDataToBrandData("verbiage", oldData);
                if (mappedData) {
                    verbiageToDelete.push(mappedData);
                }
            }
            setState({ ...state, verbiage, pendingDelete: { ...state.pendingDelete, verbiage: verbiageToDelete } });
        } else if (listName === "taglines") {
            const taglines = getUpdatedList(state.taglines, "taglineText", oldData, newData, action);
            const taglinesToDelete = state.pendingDelete.taglines;
            if (action === "delete" && oldData.id) {
                let mappedData = mapTableDataToBrandData("taglines", oldData);
                if (mappedData) {
                    taglinesToDelete.push(mappedData);
                }
            }
            setState({ ...state, taglines, pendingDelete: { ...state.pendingDelete, taglines: taglinesToDelete } });
        } else if (listName === "fonts") {
            const fonts = getUpdatedList(state.fonts, "name", oldData, newData, action);
            const fontsToDelete = state.pendingDelete.fonts;
            if (action === "delete" && oldData.id) {
                let mappedData = mapTableDataToBrandData("fonts", oldData);
                if (mappedData) {
                    fontsToDelete.push(mappedData);
                }
            }
            setState({ ...state, fonts, pendingDelete: { ...state.pendingDelete, fonts: fontsToDelete } });
        }
    }

    function onVerbiageChange(oldData, newData, action) {
        onListChange("verbiage", oldData, newData, action);
    }

    function onTaglineChange(oldData, newData, action) {
        onListChange("taglines", oldData, newData, action);
    }

    function onFontsChange(oldData, newData, action) {
        onListChange("fonts", oldData, newData, action);
    }

    function onKeyDown(keyEvent) {
        if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
            keyEvent.preventDefault();
        }
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

        <div className="kt-section">
            <div className="kt-section__content">
                <div className={classes.root}>
                    {state.hasFetched && <Formik
                        initialValues={{
                            hasVerbiage: brand.hasVerbiage === true ? "yes" : (brand.hasVerbiage === false ? "no" : ""),
                            hasTaglines: brand.hasTaglines === true ? "yes" : (brand.hasTaglines === false ? "no" : ""),
                            hasFonts: brand.hasFonts === true ? "yes" : (brand.hasFonts === false ? "no" : ""),
                            verbiage: state.verbiage,
                            taglines: state.taglines,
                            fonts: state.fonts,
                            formAction: "submit"
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
                                        <div className="form-group mb-0">
                                            <FormControl component="fieldset" className={classes.formControl} error={Boolean(touched.hasVerbiage && errors.hasVerbiage)}>
                                                <FormLabel component="legend">Do you have licensed verbiage?</FormLabel>
                                                <RadioGroup
                                                    aria-label="Do you have licensed verbiage?"
                                                    name="hasVerbiage"
                                                    className={classes.group}
                                                    onChange={handleChange}
                                                    value={values.hasVerbiage}
                                                    row
                                                >
                                                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                                </RadioGroup>
                                                <FormHelperText>{touched.hasVerbiage && errors.hasVerbiage}</FormHelperText>
                                            </FormControl>
                                        </div>

                                        {
                                            values.hasVerbiage === "yes" &&
                                            <div className="form-group mb-0">
                                                <EditableList
                                                    validator={editableListValidator}
                                                    className={classes}
                                                    name="verbiage"
                                                    inputFieldLabel="Verbiage"
                                                    inputFieldPlaceholder="Enter verbiage"
                                                    items={state.verbiage.map(verbiage => { return { id: verbiage.id, name: verbiage.verbiageText } })}
                                                    onChange={onVerbiageChange}
                                                />
                                                <br />
                                            </div>
                                        }

                                        <div className="form-group mb-0">
                                            <FormControl component="fieldset" className={classes.formControl} error={Boolean(touched.hasTaglines && errors.hasTaglines)}>
                                                <FormLabel component="legend">Do you have official slogans or hashtags?</FormLabel>
                                                <RadioGroup
                                                    aria-label="Do you have official slogans or hashtags?"
                                                    name="hasTaglines"
                                                    className={classes.group}
                                                    onChange={handleChange}
                                                    value={values.hasTaglines}
                                                    row
                                                >
                                                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                                </RadioGroup>
                                                <FormHelperText>{touched.hasTaglines && errors.hasTaglines}</FormHelperText>
                                            </FormControl>
                                        </div>

                                        {
                                            values.hasTaglines === "yes" &&
                                            <div className="form-group mb-0">
                                                <EditableList
                                                    validator={editableListValidator}
                                                    className={classes}
                                                    name="taglines"
                                                    inputFieldLabel="Taglines"
                                                    inputFieldPlaceholder="Enter tagline"
                                                    items={state.taglines.map(tagline => { return { id: tagline.id, name: tagline.taglineText } })}
                                                    onChange={onTaglineChange}
                                                />
                                                <br />
                                            </div>
                                        }

                                        <div className="form-group mb-0">
                                            <FormControl component="fieldset" className={classes.formControl} error={Boolean(touched.hasFonts && errors.hasFonts)}>
                                                <FormLabel component="legend">Do you have approved fonts?</FormLabel>
                                                <RadioGroup
                                                    aria-label="Do you have approved fonts?"
                                                    name="hasFonts"
                                                    className={classes.group}
                                                    onChange={handleChange}
                                                    value={values.hasFonts}
                                                    row
                                                >
                                                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                                </RadioGroup>
                                                <FormHelperText>{touched.hasFonts && errors.hasFonts}</FormHelperText>
                                            </FormControl>
                                        </div>

                                        {
                                            values.hasFonts === "yes" &&
                                            <div className="form-group mb-0">
                                                <EditableList
                                                    validator={editableListValidator}
                                                    className={classes}
                                                    name="fonts"
                                                    inputFieldLabel="Font"
                                                    inputFieldPlaceholder="Enter font name"
                                                    items={state.fonts.map(font => { return { id: font.id, name: font.name } })}
                                                    onChange={onFontsChange}
                                                />
                                                <br />
                                            </div>
                                        }

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
        auth: state.auth.user,
        brand: state.brand.brand,
        onboarding: state.onboarding,
    }
}

export default injectIntl(
    connect(
        mapStateToProps,
        { ...onboarding.actions, ...brand.actions },
    )(VerbiageTaglinesFontsStep)
);