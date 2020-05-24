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
import StatusBubble from "../../../../partials/content/StatusBubble";
import * as marketingImageApi from '../../../../crud/marketing_images.crud';
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

function MarketingImagesGuidelinesStep(props) {

    const { intl } = props;
    const classes = useStyles();

    const step = onboardingSections.ACCESS_AND_CONTENT.steps.MARKETINGIMAGES;

    const [state, setState] = useState({
        hasFetched: false,
        uploadedDocuments: [],
        pendingUploadDocuments: [],
        pendingDeleteDocuments: [],
        marketingImageData: undefined,
        error: undefined
    });

    useEffect(() => {

    }, [state]);

    useEffect(() => {
        let uploadedDocuments = [];
        let marketingImageData = undefined;
        marketingImageApi.getMarketingImageByOrganizationId(props.organization.id)
            .then(response => {
                if (response.status === 200) {
                    marketingImageData = response.data[0];
                    if (marketingImageData && marketingImageData.hasMarketingImageGuidelinesDocuments) {
                        filesApi.getFiles(props.organization.company_Code, "marketingImages")
                            .then(response => {
                                if (response.status === 200) {
                                    uploadedDocuments = response.data;
                                    setState({ ...state, hasFetched: true, marketingImageData, uploadedDocuments });
                                }
                            }).catch(error => {
                                console.log("Files Get Error", error);
                            });
                    }
                    else {
                        // Skip fetching files since there are none.
                        setState({ ...state, hasFetched: true, marketingImageData, uploadedDocuments });
                    }
                }
            }).catch(error => {
                console.log("MarketingImage Get Error", error);
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
            setStatus("Failed to upload new documents.");
            setSubmitting(false);
            return { ...currentState, error: true }
        }
    }

    async function CreateOrUpdateMarketingImageAsync(marketingImageData, currentState) {
        currentState = currentState || state;

        if (!currentState.marketingImageData) {
            return await marketingImageApi.createMarketingImage(marketingImageData)
        }
        else {
            marketingImageData = {
                ...marketingImageData,
                id: state.marketingImageData.id
            };
            return await marketingImageApi.updateMarketingImage(marketingImageData);
        }
    }

    function handleSubmit(values, { setStatus, setSubmitting }) {
        setSubmitting(true);
        setStatus("");

        handleDeleteFiles(state.pendingDeleteDocuments, state)
            .then(stateAfterDelete => {
                handleUploadFiles(stateAfterDelete.pendingUploadDocuments, { setStatus, setSubmitting }, stateAfterDelete)
                    .then(stateAfterUpload => {
                        let newMarketingImageData = {
                            ...stateAfterUpload.marketingImageData,
                            organizationId: props.organization.id,
                            hasMarketingImageGuidelinesDocuments: stateAfterUpload.uploadedDocuments.length > 0 // If we just uploaded successfully, we know we have documents.
                        }
                        CreateOrUpdateMarketingImageAsync(newMarketingImageData, stateAfterUpload)
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

                                    if (!stateAfterUpload.marketingImageData) {
                                        // Was create.
                                        setState({ ...stateAfterUpload, marketingImageData: response.data, error: false });
                                    }
                                    else {
                                        // Was update.
                                        setState({ ...stateAfterUpload, marketingImageData: Object.assign(stateAfterUpload.marketingImageData, newMarketingImageData), error: false });
                                    }
                                }
                            }).catch(error => {
                                console.log("MarketingImage Create/Update Error", error);
                                setStatus("Failed to save information.");
                                setSubmitting(false);
                                setState({ ...stateAfterUpload, error: true });
                            });
                    }).catch(error => {
                        console.log("Upload Error", error);
                        setStatus("Failed to save information.");
                        setSubmitting(false);
                        setState({ ...stateAfterDelete, error: true });
                    });
            }).catch(error => {
                console.log("Delete Error", error);
                setStatus("Failed to save information.");
                setSubmitting(false);
                setState({ ...state, error: true });
            });
    }

    function completeStep() {
        props.completeStep(step.name);
        props.setStepStatus(onboardingSections.ACCESS_AND_CONTENT.steps.ContactInfo.name, onboardingStatus.UNLOCKED);
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
                            hasNoDocuments: state.marketingImageData ? state.uploadedDocuments.length === 0 : false,
                            documents: state.uploadedDocuments,
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
                                                <p>Please provide any marketing graphics or images that represet your company.  We will work with you to determine the best way to use these graphics for your store as well as for your product line.</p>
                                                <span>
                                                    <FormControlLabel
                                                        value="I do not have any marketing images to upload."
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
                                                        label="I do not have any marketing images to upload."
                                                    />
                                                    <ToolTipsTag iconname="InfoIcon"
                                                        tooltiptext={intl.formatMessage({id:"ACCESSANDCONTENT.MARKETINGIMAGE.HASNODOCUMENTHELP"})} />
                                                </span>
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
                                                                    'image/*'
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
                                                                <>
                                                                    <Button
                                                                        key={"document-" + index}
                                                                        onClick={() => { downloadFile(file.uri, file.name); }}
                                                                    >
                                                                        <GetAppIcon />
                                                                        {file.name}
                                                                    </Button>
                                                                    <Button
                                                                        key={"document-" + index}
                                                                        onClick={() => { handleFileDelete(file); }}
                                                                    >
                                                                        <DeleteOutlineOutlinedIcon />
                                                                    </Button>
                                                                </>
                                                            ))
                                                        }
                                                    </div>
                                                    <br />
                                                </>
                                            )
                                        }

                                        <StatusBubble
                                            status={status}
                                            error={state.error}
                                        />

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
    )(MarketingImagesGuidelinesStep)
);