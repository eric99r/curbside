import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Radio, RadioGroup,
    FormHelperText, FormControlLabel, FormControl, FormLabel,
    Button,
    Checkbox,
    TextField
} from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Formik } from "formik";
import MaterialTable, { MTableToolbar, MTableActions } from "material-table";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import * as brandApi from '../../../../crud/brands.crud';
import * as brandDuck from '../../../../store/ducks/brand.duck';
import * as onboardingDuck from '../../../../store/ducks/onboarding.duck';
import { onboardingSections, onboardingStatus, getOnboardingStatus } from '../onboarding.constants';
import ValidatedTableEditRow from '../../../../partials/content/ValidatedTableEditRow';

const useStyles = makeStyles(theme => ({
    root: {
        //display: 'flex',
        flexWrap: "wrap"
    },
    formControl: {
        margin: theme.spacing(1),
        display: "flex",
        minWidth: 120
    },
    textField: {
        maxWidth: 240
    },
    group: {

    }
}));

const tableThemeOverrides = createMuiTheme({
    overrides: {
        MuiToolbar: {
            regular: {
                height: "1em",
                minHeight: "1em",
                '@media(min-width:600px)': {
                    minHeight: "1em"
                },
                '@media(min-width: 0px)and(orientation: landscape)': {
                    minHeight: "1em"
                }
            }
        }
    }
});

function SportsTeamStep(props) {

    const { auth, brand, onboarding, intl } = props;
    const classes = useStyles();
    const addButtonIcon = React.useRef(null);

    const step = onboardingSections.BRANDING.steps.SPORTS_TEAMS;

    const defaultSportsTeams = [
        { name: 'Basketball', coEd: false, mens: false, womens: false },
        { name: 'Bowling', coEd: false, mens: false, womens: false },
        { name: 'Cross Country', coEd: false, mens: false, womens: false },
        { name: 'Fencing', coEd: false, mens: false, womens: false },
        { name: 'Field Hockey', coEd: false, mens: false, womens: false },
        { name: 'Football', coEd: false, mens: false, womens: false },
        { name: 'Golf', coEd: false, mens: false, womens: false },
        { name: 'Gymnastics', coEd: false, mens: false, womens: false },
        { name: 'Ice Hockey', coEd: false, mens: false, womens: false },
        { name: 'Lacrosse', coEd: false, mens: false, womens: false },
        { name: 'Rifle', coEd: false, mens: false, womens: false },
        { name: 'Rowing', coEd: false, mens: false, womens: false },
        { name: 'Skiing', coEd: false, mens: false, womens: false },
        { name: 'Soccer', coEd: false, mens: false, womens: false },
        { name: 'Softball', coEd: false, mens: false, womens: false },
        { name: 'Swimming & Diving', coEd: false, mens: false, womens: false },
        { name: 'Tennis', coEd: false, mens: false, womens: false },
        { name: 'Track & Field (Indoor)', coEd: false, mens: false, womens: false },
        { name: 'Track & Field (Outdoor)', coEd: false, mens: false, womens: false },
        { name: 'Volleyball (Indoor)', coEd: false, mens: false, womens: false },
        { name: 'Volleyball (Beach)', coEd: false, mens: false, womens: false },
        { name: 'Water Polo', coEd: false, mens: false, womens: false },
        { name: 'Wrestling', coEd: false, mens: false, womens: false }
    ]

    const [state, setState] = useState({
        sportsTeams: defaultSportsTeams,
        sportsTeamsPendingDelete: [],
        hasFetched: false,
        error: undefined
    });

    // Load data.
    useEffect(() => {
        if (!brand) {
            const initBrandData = {
                organizationId: auth.userData.account,
                hasBrandGuidelinesDocuments: false
            };
            brandApi.createBrand(initBrandData).then(data => {
                props.getBrandByOrganizationId(auth.userData.account);
            });
        } else {
            setState({
                ...state,
                hasFetched: true,
                error: false
            });
        }
    }, []);

    useEffect(() => {
        if (brand) {
            setState({
                ...state,
                sportsTeams: brand.sportsTeams && brand.sportsTeams.length > 0 ? brand.sportsTeams : state.sportsTeams,
                hasFetched: true,
                error: false
            });
        }
        /*
        let addButtonNode = document.getElementById("table-add-button");
        if (addButtonNode) {
            console.log(addButtonNode.parentNode.parentNode.id);
            //addButtonNode.parentNode.parentNode.style.display = "none";
            addButtonNode.parentNode.parentNode.hidden = true;
            console.log("Hiding parentNode", addButtonNode, addButtonNode.parentNode, addButtonNode.parentNode.parentNode);
        }
        */

        if (addButtonIcon.current) {
            addButtonIcon.current.parentNode.parentNode.parentNode.hidden = true;
            console.log("parent", addButtonIcon.current.parentNode.parentNode.parentNode);
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

        if (!values.hasMascot) {
            errors.hasMascot = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
            });
        }
        else if (values.hasMascot === "yes"
            && !values.mascotName) {
            errors.mascotName = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
            });
        }

        // If they have sports teams...
        if (values.hasNoSportsTeams === false) {
            // Must specify if they are in divisions/conferences.
            if (!values.isInDivisionsOrConferences) {
                errors.isInDivisionsOrConferences = intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD"
                });
            }
            // Must list divisions/conferences if they marked they are in them.
            else if (values.isInDivisionsOrConferences === "yes"
                && !values.divisionsAndConferences) {
                errors.divisionsAndConferences = intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD"
                });
            }
        }
        return errors;
    }

    async function handleBrandUpdates(values, currentState) {
        currentState = currentState || state;
        // Update brand.
        const updatedBrand = {
            ...brand,
            hasMascot: values.hasMascot === "yes",
            mascotName: values.mascotName,
            hasSportsTeams: !values.hasNoSportsTeams,
            isInDivisionsOrConferences: values.hasNoSportsTeams ? null : values.isInDivisionsOrConferences === "yes",
            divisionsAndConferences: values.hasNoSportsTeams ? null : values.divisionsAndConferences,
            sportsTeams: state.sportsTeams
        };
        return await props.updateBrand(updatedBrand);
    }

    async function handleDeletes() {
        let promises = [];
        let listToDelete = state.sportsTeamsPendingDelete;
        let action = brandApi.deleteSportsTeam;
        let successState = state;
        successState = {
            ...successState,
            sportsTeams: successState.sportsTeams.filter(v => !listToDelete.some(li => li.id === v.id)),
            sportsTeamsPendingDelete: []
        }

        for (let i = 0; i < listToDelete.length; i++) {
            promises.push(await action(listToDelete[i]));
        }
        await Promise.all(promises);

        return successState;
    }

    function handleSubmit(values, { setStatus, setSubmitting }) {

        if (values.formAction === "submit") {
            if (!values.hasNoSportsTeams) {
                // Make sure the user has checked at least one box for at least one sport.
                let defaultSportChecked = state.sportsTeams.some(team => defaultSportsTeams.some(dst => team.name === dst.name) && (team.coEd === true || team.mens === true || team.womens === true));
                if (!defaultSportChecked) {
                    setState({ ...state, error: true });
                    props.setStepMessage(step.name, "You have selected that you have sports teams. Please make a selection for at least one of the default sports teams.", "danger");
                    setSubmitting(false);
                    return;
                }

                // Make sure the user has checked at least one box for the custom sports.
                let customSports = state.sportsTeams.filter(team => !defaultSportsTeams.some(dst => team.name === dst.name));
                let allCustomSportsChecked = customSports.every(team => (team.coEd === true || team.mens === true || team.womens === true));
                if (!allCustomSportsChecked) {
                    setState({ ...state, error: true });
                    props.setStepMessage(step.name, "You must make at least one selection for all custom sports teams.", "danger");
                    setSubmitting(false);
                    return;
                }
            }
        }

        setSubmitting(true);
        handleDeletes().then(stateAfterDeletes => {
            handleBrandUpdates(values, stateAfterDeletes).then(() => {
                if (values.formAction === "submit") {
                    setState({ ...stateAfterDeletes, submitted: true, error: false });
                    props.setStepMessage(step.name, "");
                } else if (values.formAction === "save") {
                    setState({ ...stateAfterDeletes, error: false });
                    props.setStepMessage(step.name, "Saved information successfully.");
                }
                setSubmitting(false);
            }).catch(error => {
                console.log("Failed to update brand.", error);
                setState({ ...stateAfterDeletes, error: true });
                props.setStepMessage(step.name, "Failed to update information.", "danger");
                setSubmitting(false);
            });
        }).catch(error => {
            console.log("Failed to delete sports teams", error);
            setState({ ...state, error: true });
            props.setStepMessage(step.name, "Failed to update information.", "danger");
            setSubmitting(false);
        });

    }

    function completeStep() {
        props.completeStep(step.name);
        const nextStepStatus = getOnboardingStatus(onboarding.statuses, onboardingSections.BRANDING.steps.LOGOS_AND_APPROVED_COLORS.name);
        if (nextStepStatus === onboardingStatus.LOCKED) {
            props.setStepStatus(onboardingSections.BRANDING.steps.LOGOS_AND_APPROVED_COLORS.name, onboardingStatus.UNLOCKED);
        }
        else if (nextStepStatus === onboardingStatus.DISABLED) {
            // Complete section since this is the last step.
            props.completeStep(onboardingSections.BRANDING.name);
            // Unlock next section if it's not already.
            if (getOnboardingStatus(onboarding.statuses, onboardingSections.CATALOG_AND_PRODUCTS.name) === onboardingStatus.LOCKED) {
                props.setStepStatus(onboardingSections.CATALOG_AND_PRODUCTS.name, onboardingStatus.UNLOCKED);
                // Unlock first step of next section.
                props.setStepStatus(onboardingSections.CATALOG_AND_PRODUCTS.steps.SPONSORED_APPAREL_BRANDS.name, onboardingStatus.UNLOCKED);
            }
        }
    }

    const tableRowValidator = (newData, oldData, allData, mode) => {
        let errors = {};
        if (mode === "update" || mode === "add") {
            const index = allData.indexOf(oldData);
            if (!newData.name) {
                errors.name = "Name must not be empty.";
            }
            else if (allData.some((item, itemIndex) => item.name === newData.name && itemIndex !== index)) {
                errors.name = "Cannot have duplicates.";
            }
            else if (!(newData.coEd || newData.mens || newData.womens)) {
                errors.name = "At least one selection must be made for a custom sport.";
            }
        }
        return errors;
    }

    return (
        <div className="kt-section">
            <div className="kt-section__content">
                <div className={classes.root}>
                    {state.hasFetched && <Formik
                        initialValues={{
                            hasMascot: (brand && brand.hasMascot !== null) ? (brand.hasMascot ? "yes" : "no") : "",
                            mascotName: (brand && brand.hasMascot !== null) ? brand.mascotName : "",
                            hasNoSportsTeams: (brand && brand.hasSportsTeams !== null) ? (brand.hasSportsTeams ? false : true) : false,
                            isInDivisionsOrConferences: ((brand && brand.isInDivisionsOrConferences !== null) ? (brand.isInDivisionsOrConferences ? "yes" : "no") : ""),
                            divisionsAndConferences: (brand && brand.divisionsAndConferences !== null) ? brand.divisionsAndConferences : "",
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
                            setFieldValue,
                            setFieldError
                        }) => (
                                <div className={classes.root}>
                                    <form onSubmit={handleSubmit} noValidate autoComplete="off">
                                        <div className="form-group mb-0">
                                            <FormControl component="fieldset" className={classes.formControl} error={Boolean(touched.hasMascot && errors.hasMascot)}>
                                                <FormLabel component="legend">Do you have a mascot?</FormLabel>
                                                <RadioGroup
                                                    aria-label="Do you have a mascot?"
                                                    name="hasMascot"
                                                    className={classes.group}
                                                    onChange={handleChange}
                                                    value={values.hasMascot}
                                                    row
                                                >
                                                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                                </RadioGroup>
                                                <FormHelperText>{touched.hasMascot && errors.hasMascot}</FormHelperText>
                                            </FormControl>
                                        </div>

                                        {
                                            values.hasMascot === "yes" &&
                                            <div className="form-group mb-0">
                                                <FormControl className={classes.formControl} error={Boolean(touched.mascotName && errors.mascotName)}>
                                                    <TextField
                                                        label="Mascot Name"
                                                        name="mascotName"
                                                        className={classes.textField}
                                                        onChange={handleChange}
                                                        value={values.mascotName}
                                                    />
                                                    <FormHelperText>{touched.mascotName && errors.mascotName}</FormHelperText>
                                                </FormControl>
                                            </div>
                                        }

                                        <div className="form-group mb-0">
                                            <FormControl className={classes.formControl} error={Boolean(touched.hasNoSportsTeams && errors.hasNoSportsTeams)}>
                                                <p>Please provide the relevant details for all sports teams that apply:</p>
                                                <FormControlLabel
                                                    value="We do not have any sports teams."
                                                    control={
                                                        <Checkbox
                                                            color="primary"
                                                            name="hasNoSportsTeams"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            checked={values.hasNoSportsTeams}
                                                        />
                                                    }
                                                    label="We do not have any sports teams."
                                                />
                                                <FormHelperText>{touched.hasNoSportsTeams && errors.hasNoSportsTeams}</FormHelperText>
                                            </FormControl>
                                        </div>

                                        {
                                            !values.hasNoSportsTeams &&
                                            <div className="form-group mb-0">
                                                <FormControl component="fieldset" className={classes.formControl} error={Boolean(touched.isInDivisionsOrConferences && errors.isInDivisionsOrConferences)}>
                                                    <FormLabel component="legend">Do your teams compete in any divisions or conferences?</FormLabel>
                                                    <RadioGroup
                                                        aria-label="Do your teams compete in any divisions or conferences?"
                                                        name="isInDivisionsOrConferences"
                                                        className={classes.group}
                                                        onChange={handleChange}
                                                        value={values.isInDivisionsOrConferences}
                                                        row
                                                    >
                                                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                                        <FormControlLabel value="no" control={<Radio />} label="No" />
                                                    </RadioGroup>
                                                    <FormHelperText>{touched.isInDivisionsOrConferences && errors.isInDivisionsOrConferences}</FormHelperText>
                                                </FormControl>
                                            </div>
                                        }

                                        {
                                            !values.hasNoSportsTeams &&
                                            values.isInDivisionsOrConferences === "yes" &&
                                            <div className="form-group mb-0">
                                                <FormControl className={classes.formControl} error={Boolean(touched.divisionsAndConferences && errors.divisionsAndConferences)}>
                                                    <p>Please list all divisions and/or conferences separated by a comma.</p>
                                                    <TextField
                                                        label="Divisions & Conferences"
                                                        placeholder="Enter Divisions/Conferences"
                                                        name="divisionsAndConferences"
                                                        className={classes.textField}
                                                        onChange={handleChange}
                                                        value={values.divisionsAndConferences}
                                                    />
                                                    <FormHelperText>{touched.divisionsAndConferences && errors.divisionsAndConferences}</FormHelperText>
                                                </FormControl>
                                            </div>
                                        }

                                        {
                                            !values.hasNoSportsTeams &&
                                            <>
                                                <MaterialTable
                                                    components={{
                                                        EditRow: ValidatedTableEditRow(tableRowValidator, state.sportsTeams),
                                                        Toolbar: props => (
                                                            <MuiThemeProvider theme={tableThemeOverrides}>
                                                                <MTableToolbar {...props} />
                                                            </MuiThemeProvider>
                                                        ),
                                                        Actions: props => (
                                                            <MTableActions {...props} hidden style={{ visibility: "hidden", display: "none" }} />
                                                        )
                                                    }}
                                                    columns={
                                                        [
                                                            { title: 'Sports Team', field: 'name' },
                                                            {
                                                                title: 'Co-Ed', field: 'coEd', type: 'boolean',
                                                                render: rowData => (
                                                                    <Checkbox
                                                                        color="primary"
                                                                        name={rowData.name + "-coEd"}
                                                                        onBlur={handleBlur}
                                                                        onChange={handleChange} onChange={e => {
                                                                            setState({ ...state, sportsTeams: state.sportsTeams.map(t => t.name === rowData.name ? { ...t, coEd: e.target.checked } : t) })
                                                                        }}
                                                                        checked={rowData.coEd}
                                                                    />
                                                                )
                                                            },
                                                            {
                                                                title: 'Mens', field: 'mens', type: 'boolean',
                                                                render: rowData => (
                                                                    <Checkbox
                                                                        color="primary"
                                                                        name={rowData.name + "-mens"}
                                                                        onBlur={handleBlur}
                                                                        onChange={e => {
                                                                            setState({ ...state, sportsTeams: state.sportsTeams.map(t => t.name === rowData.name ? { ...t, mens: e.target.checked } : t) })
                                                                        }}
                                                                        checked={rowData.mens}
                                                                    />
                                                                )
                                                            },
                                                            {
                                                                title: 'Womens', field: 'womens', type: 'boolean',
                                                                render: rowData => (
                                                                    <Checkbox
                                                                        color="primary"
                                                                        name={rowData.name + "-womens"}
                                                                        onBlur={handleBlur}
                                                                        onChange={e => {
                                                                            setState({ ...state, sportsTeams: state.sportsTeams.map(t => t.name === rowData.name ? { ...t, womens: e.target.checked } : t) })
                                                                        }}
                                                                        checked={rowData.womens}
                                                                    />
                                                                )
                                                            }
                                                        ]
                                                    }
                                                    data={state.sportsTeams}
                                                    options={{
                                                        draggable: false,
                                                        header: true,
                                                        toolbar: true,
                                                        showTitle: false,
                                                        paging: false,
                                                        search: false,
                                                        emptyRowsWhenPaging: false,
                                                        sorting: false,
                                                        padding: "dense",
                                                        actionsColumnIndex: -1
                                                    }}
                                                    editable={{
                                                        isEditable: rowData => !defaultSportsTeams.some(team => team.name === rowData.name), // Only custom sports are editable.
                                                        isDeletable: rowData => !defaultSportsTeams.some(team => team.name === rowData.name), // Only custom sports are deletable
                                                        onRowAdd: newData =>
                                                            new Promise((resolve, reject) => {
                                                                if (!newData.name) {
                                                                    //setFieldError("Sport name must not be empty.");
                                                                    reject();
                                                                }
                                                                else if (state.sportsTeams.some(team => team.name === newData.name)) {
                                                                    //setFieldError("sportsTeams", "Cannot have duplicates.");
                                                                    reject();
                                                                }
                                                                else if (!(newData.coEd || newData.mens || newData.womens)) {
                                                                    //setFieldError("sportsTeams", "At least one selection must be made for a custom sport.");
                                                                    reject();
                                                                }
                                                                else {
                                                                    const newSport = {
                                                                        name: newData.name,
                                                                        coEd: newData.coEd === true,
                                                                        mens: newData.mens === true,
                                                                        womens: newData.womens === true
                                                                    }
                                                                    setState({ ...state, sportsTeams: state.sportsTeams.concat([newSport]) })
                                                                    resolve();
                                                                }
                                                            }),
                                                        onRowUpdate: (newData, oldData) =>
                                                            new Promise((resolve, reject) => {
                                                                const data = state.sportsTeams;
                                                                const index = data.indexOf(oldData);
                                                                data[index] = newData;
                                                                if (state.sportsTeams.some((item, itemIndex) => item.name === newData.name && itemIndex !== index)) {
                                                                    //setFieldError("sportsTeams", "Cannot have duplicates.");
                                                                    reject();
                                                                }
                                                                else if (!newData.name) {
                                                                    //setFieldError("sportsTeams", "Sport name must not be empty.");
                                                                    reject();
                                                                }
                                                                else {
                                                                    setState({ ...state, sportsTeams: data });
                                                                    resolve();
                                                                }
                                                            }),
                                                        onRowDelete: oldData =>
                                                            new Promise((resolve, reject) => {
                                                                let data = state.sportsTeams;
                                                                const index = data.indexOf(oldData);
                                                                data.splice(index, 1);
                                                                if (data[index].id) {
                                                                    setState({ ...state, sportsTeams: data, sportsTeamsPendingDelete: state.sportsTeamsPendingDelete.concat([oldData]) });
                                                                }
                                                                resolve();
                                                            })
                                                    }}
                                                    icons={{
                                                        Add: props => <div ref={addButtonIcon} style={{ height: "0", display: "none" }} id={"table-add-button"} />
                                                    }}
                                                />
                                                <FormHelperText>{state.sportsTeamsErrorMessage && state.sportsTeamsErrorMessage}</FormHelperText>                                            <FormHelperText>{state.sportsTeamsErrorMessage && errors.sportsTeams}</FormHelperText>
                                                <div className="form-group" style={{ textAlign: 'center' }}>
                                                    <Button
                                                        onClick={() => {
                                                            document.getElementById("table-add-button").parentNode.click();
                                                        }}
                                                    >
                                                        Add Custom Sport
                                                </Button>
                                                </div>
                                            </>
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
        onboarding: state.onboarding
    }
}

export default injectIntl(
    connect(
        mapStateToProps,
        { ...onboardingDuck.actions, ...brandDuck.actions },
    )(SportsTeamStep)
);