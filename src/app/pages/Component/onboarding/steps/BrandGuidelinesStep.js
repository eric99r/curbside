import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Radio, RadioGroup,
    FormHelperText, FormControlLabel, FormControl, FormLabel,
    Button,
    Checkbox,
    TextField
} from '@material-ui/core';
import { Formik } from "formik";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import FormikDropzone from '../../../../partials/content/FormikDropzone';
import * as brandApi from '../../../../crud/brands.crud';
import * as filesApi from '../../../../crud/files.crud';
import * as onboarding from '../../../../store/ducks/onboarding.duck';
import { onboardingSections, onboardingStatus, getOnboardingStatus } from '../onboarding.constants';
import GetAppIcon from '@material-ui/icons/GetApp';

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

function BrandGuidelinesStep(props) {

    const { intl, onboarding } = props;
    const classes = useStyles();

    const step = onboardingSections.BRANDING.steps.BRAND_GUIDELINES;

    const [state, setState] = useState({
        hasFetched: false,
        uploadedDocuments: [],
        pendingUploadDocuments: [],
        pendingDeleteDocuments: [],
        brandData: undefined,
        error: undefined
    });

    useEffect(() => {

    }, [state]);

    useEffect(() => {
        let uploadedDocuments = [];
        let brandData = undefined;
        brandApi.getBrandByOrganizationId(props.organization.id)
            .then(response => {
                if (response.status === 200) {
                    brandData = response.data[0];
                    if (brandData && brandData.hasBrandGuidelinesDocuments) {
                        filesApi.getFiles(props.organization.company_Code, "brand-guidelines")
                            .then(response => {
                                if (response.status === 200) {
                                    uploadedDocuments = response.data;
                                    setState({ ...state, hasFetched: true, brandData, uploadedDocuments });
                                }
                            }).catch(error => {
                                console.log("Files Get Error", error);
                            });
                    }
                    else {
                        // Skip fetching files since there are none.
                        setState({ ...state, hasFetched: true, brandData, uploadedDocuments });
                    }
                }
            }).catch(error => {
                console.log("Brand Get Error", error);
            });
    }, []);

    function validate(values) {
        const errors = {};

        // Required to upload at least one document if checkbox specifying user has no documents is not checked.
        if (!values.hasNoDocuments && Array.isArray(values.documents) && values.documents.length === 0) {
            errors.documents = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
            });
        }

        // Required to specify whether or not brand changes are anticipated.
        if (!values.isAnticipatingBrandChanges) {
            errors.isAnticipatingBrandChanges = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
            });
        }

        // Required to give brief explanation of brand changes if the user specified they were anticipated.
        if (values.isAnticipatingBrandChanges === "yes" && (!values.brandChanges || values.brandChanges.trim() === "")) {
            errors.brandChanges = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
            });
        }

        return errors;
    }

    function handleOnDrop(files) {
        let newPendingUploadDocuments = state.pendingUploadDocuments.concat(files);
        setState(
            {
                ...state,
                pendingUploadDocuments: newPendingUploadDocuments
            }
        );
    }

    function handleOnDropRejected(files) {
        let newPendingUploadDocuments = state.pendingUploadDocuments;
        newPendingUploadDocuments.filter(doc => !files.some(f => f.name == doc.name));
        setState({ ...state, pendingUploadDocuments: newPendingUploadDocuments });
    }

    function getFileNameWithoutExtraExtension(file) {
        // Check if file name has two extensions... and chop off the last one.
        let extensionDotIndex = file.name.indexOf(".");
        if (extensionDotIndex > 0) {
            let nextExtensionDotIndex = file.name.indexOf(".", extensionDotIndex + 1);
            let fileType = file.type;
            const slashIndex = fileType.indexOf("/");
            if (slashIndex > 0) {
                fileType = fileType.substring(slashIndex + 1, fileType.length);
            }
            if (nextExtensionDotIndex > 0 && file.name.endsWith(fileType)) {
                const newName = file.name.substring(0, file.name.length - fileType.length - 1);
                return new File([file], newName, { type: file.type });
            }
        }
        return file
    }

    function handleOnDelete(fileToDelete) {
        fileToDelete = getFileNameWithoutExtraExtension(fileToDelete);
        // If the file has been flagged for upload but has not been uploaded, don't upload it.
        const newPendingUploadDocuments = state.pendingUploadDocuments.filter(f => f.name !== fileToDelete.name);
        // Only add to list to delete if it is already uploaded and is not already flagged for deletion.
        const newPendingDeleteDocuments = state.pendingDeleteDocuments.every(f => f.name !== fileToDelete.name)
            && state.uploadedDocuments.some(f => f.name === fileToDelete.name)
            ? state.pendingDeleteDocuments.concat([fileToDelete])
            : state.pendingDeleteDocuments;
        setState(
            {
                ...state,
                pendingDeleteDocuments: newPendingDeleteDocuments,
                pendingUploadDocuments: newPendingUploadDocuments
            }
        );
    }

    function handleFileDelete(file) {
        file = getFileNameWithoutExtraExtension(file);
        // Look up file in uploadedDocuments. If the file is uploaded, send delete request.
        const matches = state.uploadedDocuments.filter(f => f.name === file.name);
        if (matches.length > 0) {
            filesApi._deleteFile(matches[0].uri)
                .then(response => {
                    if (response.status === 200) {
                        // Remove deleted file from uploadedDocuments state.
                        setState({ ...state, uploadedDocuments: state.uploadedDocuments.filter(f => f.name !== file.name), pendingDeleteDocuments: [] });
                    }
                }).catch(error => {
                    console.log("File Delete Error", error);
                });
        }
    }

    async function handleDeleteFiles(files, currentState) {
        currentState = currentState || state;

        if (currentState.pendingDeleteDocuments.length === 0) {
            return currentState;
        }

        let promises = [];
        for (let i = 0; i < files.length; i++) {
            const matches = state.uploadedDocuments.filter(f => f.name === files[i].name);
            if (matches.length > 0) {
                promises.push(await filesApi._deleteFile(matches[0].uri));
            }
        }
        await Promise.all(promises);

        let newState = state;
        for (let i = 0; i < promises.length; i++) {
            if (promises[i].status === 200) {
                // Remove deleted file from uploadedDocuments state.
                newState = { ...newState, uploadedDocuments: newState.uploadedDocuments.filter(f => f.name !== files[i].name) };
            }
            else {
                console.log("Delete File Failed", promises[i]);
            }
        }
        return { ...newState, pendingDeleteDocuments: [] };
    }

    async function handleUploadFiles(files, { setStatus, setSubmitting }, currentState) {
        currentState = currentState || state;

        if (currentState.pendingUploadDocuments.length === 0) {
            return currentState;
        }

        let response = await filesApi.uploadFiles(files, props.organization.company_Code, step.name)

        if (response.status === 200) {
            const newUploadedDocumentsState = currentState.uploadedDocuments.concat(response.data.filter(f => !currentState.uploadedDocuments.some(fs => fs.name === f.name)));
            currentState = { ...currentState, uploadedDocuments: newUploadedDocumentsState, pendingUploadDocuments: [] };
            return currentState;
        }
        else {
            console.log("Upload Pending Files Error", response);
            props.setStepMessage(step.name, "Failed to upload new documents.");
            setSubmitting(false);
            return { ...currentState, error: true }
        }
    }

    async function CreateOrUpdateBrandAsync(brandData, currentState) {
        currentState = currentState || state;
        // Upload Brand information.
        if (!currentState.brandData) {
            return await brandApi.createBrand(brandData)
        }
        else {
            brandData = {
                ...brandData,
                id: state.brandData.id
            };
            return await brandApi.updateBrand(brandData);
        }
    }

    function handleSubmit(values, { setStatus, setSubmitting }) {
        setSubmitting(true);
        props.setStepMessage(step.name, "");

        handleDeleteFiles(state.pendingDeleteDocuments, state)
            .then(stateAfterDelete => {
                handleUploadFiles(stateAfterDelete.pendingUploadDocuments, { setStatus, setSubmitting }, stateAfterDelete)
                    .then(stateAfterUpload => {
                        // Handle brand creation/update.
                        // Add HasBrandGuidelinesDocuments property.
                        let newBrandData = {
                            ...stateAfterUpload.brandData,
                            organizationId: props.organization.id,
                            anticipatedBrandChanges: values.isAnticipatingBrandChanges === "yes" ? values.brandChanges : "",
                            hasBrandGuidelinesDocuments: stateAfterUpload.uploadedDocuments.length > 0 // If we just uploaded successfully, we know we have documents.
                        }
                        CreateOrUpdateBrandAsync(newBrandData, stateAfterUpload)
                            .then(response => {
                                if (response.status === 200) {
                                    if (values.formAction === "submit") {
                                        props.setStepMessage(step.name, "");
                                        completeStep();
                                    }
                                    else if (values.formAction === "save") {
                                        props.setStepMessage(step.name, "Saved information successfully.");
                                    }
                                    setSubmitting(false);

                                    if (!stateAfterUpload.brandData) {
                                        // Was create.
                                        setState({ ...stateAfterUpload, brandData: response.data, error: false });
                                    }
                                    else {
                                        // Was update.
                                        setState({ ...stateAfterUpload, brandData: Object.assign(stateAfterUpload.brandData, newBrandData), error: false });
                                    }
                                }
                            }).catch(error => {
                                console.log("Brand Create/Update Error", error);
                                props.setStepMessage(step.name, "Failed to save information.", "danger");
                                setSubmitting(false);
                                setState({ ...stateAfterUpload, error: true });
                            });
                    }).catch(error => {
                        console.log("Upload Error", error);
                        props.setStepMessage(step.name, "Failed to save information.", "danger");
                        setSubmitting(false);
                        setState({ ...stateAfterDelete, error: true });
                    });
            }).catch(error => {
                console.log("Delete Error", error);
                props.setStepMessage(step.name, "Failed to save information.", "danger");
                setSubmitting(false);
                setState({ ...state, error: true });
            });
    }

    function completeStep() {
        props.completeStep(step.name);
        const nextStepStatus = getOnboardingStatus(onboarding.statuses, onboardingSections.BRANDING.steps.VERBIAGE_TAGLINES_AND_FONTS.name);
        if (nextStepStatus !== onboardingStatus.COMPLETE) {
            props.setStepStatus(onboardingSections.BRANDING.steps.VERBIAGE_TAGLINES_AND_FONTS.name, onboardingStatus.UNLOCKED);
        }
    }

    function downloadFile(fileUri, fileName) {
        filesApi.downloadFile(fileUri).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers["content-type"] }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
        }).catch(error => {
            console.log("Download File Error", error);
        });
    }

    return (
        <div className="kt-section">
            <div className="kt-section__content">
                <div className={classes.root}>
                    {state.hasFetched && <Formik
                        initialValues={{
                            hasNoDocuments: state.brandData ? state.uploadedDocuments.length === 0 : false,
                            documents: state.uploadedDocuments,
                            isAnticipatingBrandChanges: (state.brandData ? ((state.brandData.anticipatedBrandChanges) ? "yes" : "no") : ""),
                            brandChanges: state.brandData ? state.brandData.anticipatedBrandChanges : "",
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
                                        <div className="form-group mb-0">
                                            <FormControl className={classes.formControl} error={Boolean(touched.hasNoDocuments && errors.hasNoDocuments)}>
                                                <p>If available, please upload any documents relevant to your brand guidelines.  We will use these as a reference to help us ensure your entire store product line is 100% cohesive with your brand standards.</p>
                                                <FormControlLabel
                                                    value="I do not have any documents to upload."
                                                    control={
                                                        <Checkbox
                                                            disabled={Boolean(Array.isArray(values.documents) && values.documents.length > 0)}
                                                            color="primary"
                                                            name="hasNoDocuments"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            checked={values.hasNoDocuments}
                                                        />
                                                    }
                                                    label="I do not have any documents to upload."
                                                />
                                                <FormHelperText>{touched.hasNoDocuments && errors.hasNoDocuments}</FormHelperText>
                                            </FormControl>
                                        </div>

                                        {
                                            !values.hasNoDocuments &&
                                            (
                                                <>
                                                    <div className="form-group mb-0">
                                                        <FormControl className={classes.formControl} error={Boolean(touched.documents && errors.documents)}>
                                                            <FormikDropzone
                                                                name="documents"
                                                                filesLimit={25}
                                                                acceptedFiles={[
                                                                    'application/pdf',
                                                                    'application/msword', /* .doc */
                                                                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' /* .docx */
                                                                ]}
                                                                showFileNames
                                                                dropzoneText={"Drag and drop files here or click to browse"}
                                                                previewText=""
                                                                initialFiles={state.uploadedDocuments.filter(file => !state.pendingDeleteDocuments.some(fileToDelete => file.name === fileToDelete.name)).map(item => item.uri)}
                                                                //onChange={(files) => { console.log(files); }}
                                                                onDrop={handleOnDrop}
                                                                onDropRejected={handleOnDropRejected}
                                                                onDelete={handleOnDelete}
                                                            />
                                                            <FormHelperText>{touched.documents && errors.documents}</FormHelperText>
                                                        </FormControl>
                                                    </div>
                                                    <br />
                                                    <div>
                                                        {
                                                            state.uploadedDocuments.map((file, index) => (
                                                                <Button
                                                                    key={"document-" + index}
                                                                    onClick={() => { downloadFile(file.uri, file.name); }}
                                                                >
                                                                    <GetAppIcon />
                                                                    {file.name}
                                                                </Button>
                                                            ))
                                                        }
                                                    </div>
                                                    <br />
                                                </>
                                            )
                                        }

                                        <div className="form-group mb-0">
                                            <FormControl component="fieldset" className={classes.formControl} error={Boolean(touched.isAnticipatingBrandChanges && errors.isAnticipatingBrandChanges)}>
                                                <FormLabel component="legend">Are you anticipating any brand updates or changes within the next year?</FormLabel>
                                                <RadioGroup
                                                    aria-label="Are you anticipating any brand updates or changes within the next year?"
                                                    name="isAnticipatingBrandChanges"
                                                    className={classes.group}
                                                    onChange={handleChange}
                                                    value={values.isAnticipatingBrandChanges}
                                                    row
                                                >
                                                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                                </RadioGroup>
                                                <FormHelperText>{touched.isAnticipatingBrandChanges && errors.isAnticipatingBrandChanges}</FormHelperText>
                                            </FormControl>
                                        </div>

                                        {
                                            values.isAnticipatingBrandChanges === "yes" &&
                                            <div className="form-group mb-0">
                                                <FormControl className={classes.formControl} error={Boolean(touched.brandChanges && errors.brandChanges)}>
                                                    <p>Please briefly describe the anticipated updates to your brand.  This may change how we setup your store and will help us prepare in advance of the update.</p>
                                                    <TextField
                                                        name="brandChanges"
                                                        multiline
                                                        rows="4"
                                                        onChange={handleChange}
                                                        value={values.brandChanges}
                                                    />
                                                    <FormHelperText>{touched.brandChanges && errors.brandChanges}</FormHelperText>
                                                </FormControl>
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
        onboarding: state.onboarding,
        organization: state.organization.organization
    }
}

export default injectIntl(
    connect(
        mapStateToProps,
        onboarding.actions,
    )(BrandGuidelinesStep)
);