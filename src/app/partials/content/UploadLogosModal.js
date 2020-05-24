import React, { useEffect, useState } from 'react';
import {
    FormControl, FormHelperText,
    GridList,
    Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

import { defaultLogoType } from '../../pages/Component/onboarding/brand.constants';
import { DropzoneArea } from 'material-ui-dropzone';
import ImagePreviews from './ImagePreviews';
import LogoTypeList from './LogoTypeList';
import ConfirmModal from './ConfirmModal';
import ToolTipsTag from './ToolTipsTag';

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
    },
    gridList: {
        width: "100%",
        height: 350,
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    }
}));

const defaultLogoData = {
    imageFile: undefined,
    imageUrl: "",
    logoType: defaultLogoType.value,
}

export default function UploadLogosModal(props) {
    const [state, setState] = useState({
        step: undefined,
        stepNumber: 1,
        logos: [],
        loading: true,
        move: 0
    });
    const [showExitModal, setShowExitModal] = useState(false);

    const { onExit, onComplete } = props;

    function getStepProps() {
        return {
            step: state.step,
            stepNumber: state.stepNumber,
            numSteps: steps.length,
            logos: state.logos,
            onComplete: handleStepComplete,
            onCancel: handleStepCancel,
            showExitModal,
            setShowExitModal
        }
    }

    const steps = [
        {
            title: "Upload Logos",
            render: () => (
                <UploadLogosModal_UploadLogosStep
                    {...getStepProps()}
                />
            )
        },
        {
            title: "Logo Types",
            render: () => (
                <UploadLogosModal_SetLogoTypesStep
                    {...getStepProps()}
                />
            )
        }
    ]

    useEffect(() => {
        setState({ ...state, step: steps[state.stepNumber - 1], loading: false });
    }, []);

    useEffect(() => {
        if (state.stepNumber === 0) {
            handleClose();
        } else {
            setState({ ...state, step: steps[state.stepNumber - 1], loading: false });
        }
    }, [state.stepNumber]);

    useEffect(() => {
        if (state.move > 0) {
            nextStep();
        }
        else if (state.move < 0) {
            prevStep();
        }
    }, [state.move]);

    function handleClose() {
        onExit();
    }

    function handleComplete() {
        onComplete(state.logos);
        onExit();
    }

    function prevStep() {
        setState({ ...state, stepNumber: state.stepNumber - 1, move: 0, loading: true });
    }

    function nextStep() {
        if (state.stepNumber < steps.length) {
            setState({ ...state, stepNumber: state.stepNumber + 1, move: 0, loading: true });
        }
        else {
            handleComplete();
        }
    }

    function handleStepComplete(logos) {
        setState({ ...state, logos: logos, move: 1 });
    }

    function handleStepCancel(logos) {
        setState({ ...state, logos: logos || state.logos, move: -1 });
    }

    return (
        <>
            {!state.loading &&
                <Dialog
                    fullWidth
                    maxWidth="md"
                    open={true}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {`Step ${state.stepNumber} - ${state.step.title}`}
                        <CloseIcon onClick={() => { setShowExitModal(true) }} style={{ cursor: 'pointer', float: 'right' }} />
                    </DialogTitle>
                    <DialogContent>
                        {
                            state.stepNumber === 1 &&
                            <UploadLogosModal_UploadLogosStep
                                step={state.step}
                                stepNumber={state.stepNumber}
                                numSteps={steps.length}
                                logos={state.logos}
                                onComplete={handleStepComplete}
                                onCancel={handleStepCancel}
                                showExitModal={showExitModal}
                                setShowExitModal={setShowExitModal}
                            />
                        }
                        {
                            state.stepNumber === 2 &&
                            <UploadLogosModal_SetLogoTypesStep
                                step={state.step}
                                stepNumber={state.stepNumber}
                                numSteps={steps.length}
                                logos={state.logos}
                                onComplete={handleStepComplete}
                                onCancel={handleStepCancel}
                                showExitModal={showExitModal}
                                setShowExitModal={setShowExitModal}
                            />
                        }

                        {/*state.step.render()*/}
                    </DialogContent>
                </Dialog>
            }
        </>
    );
}

function UploadLogosModal_UploadLogosStep(props) {

    const classes = useStyles();
    const { step, logos, onComplete, stepNumber, numSteps, onCancel, showExitModal, setShowExitModal } = props;

    const [state, setState] = useState({
        logos: logos || []
    });
    const [error, setError] = useState("");

    function handleDrop(images) {
        // Put images in correct format and add them to state.
        const newLogos = images.map(image => { return { ...defaultLogoData, name: image.name, imageFile: image, imageUrl: URL.createObjectURL(image) } });
        setState({ ...state, logos: state.logos.concat(newLogos) });
    }

    function handleDropRejected(images) {
        let errorMessage = (images.length > 1 ? "The files " : "The file");
        images.forEach((image, index) => { errorMessage = errorMessage + `'${image.name}'${index < images.length - 1 ? ", " : " "}`; });
        errorMessage = errorMessage + (images.length > 1 ? "are not valid files." : "is not a valid file.");
        setError(errorMessage);
    }

    function handleSubmit() {
        if (state.logos.length > 0) {
            onComplete(state.logos);
        } else {
            setError("You must upload at least one logo to continue.");
        }
    }

    return (
        <>
            {showExitModal &&
                <ConfirmModal
                    onConfirm={onCancel}
                    onExit={() => setShowExitModal(false)}
                    title={"Exit " + step.title + "?"}
                    body="If you exit now, your logos will not be saved.  Are you sure you want to exit?"
                />
            }
            <div className="form-group mb-0">
                <FormControl className={classes.formControl} error={false}>
                    <p>
                        Uploading logos is a two-step process. Step 1 is uploading your logos. Remember, all logos must be provided in a layered vector form (i.e. EPS, AI or Illustrator compatible).Once all your logos have been uploaded, proceed to Step 2 of the process where we'll ask you for some additional information about eachof the logos you've provided.
                        </p>
                    <DropzoneArea
                        showAlerts={false}
                        filesLimit={100}
                        acceptedFiles={[
                            '.eps',
                        ]}
                        showFileNames={false}
                        showPreviewsInDropzone={false}
                        initialFiles={state.logos.map(logo => logo.imageUrl)}
                        dropzoneText={"Drag and drop files here or click to browse"}
                        previewText=""
                        onDrop={handleDrop}
                        onDropRejected={handleDropRejected}
                        onDelete={() => { }}
                    />
                    <ImagePreviews
                        images={state.logos.map(logo => logo.imageFile)}
                        onRemove={(removedImages) => { setState({ ...state, logos: state.logos.filter(logo => !removedImages.some(i => i.name === logo.name)) }) }}
                    />
                </FormControl>
            </div>
            {
                error && <FormHelperText error>{error}</FormHelperText>
            }
            <DialogActions>
                {
                    stepNumber > 1 &&
                    <Button
                        onClick={onCancel}
                    >
                        {`Back to Step ${stepNumber - 1}`}
                    </Button>
                }
                <Button
                    onClick={handleSubmit}
                    color="primary"
                >
                    {stepNumber < numSteps ? `Proceed to Step ${stepNumber + 1}` : "Finish"}
                </Button>
            </DialogActions>
        </>
    );

}

function UploadLogosModal_SetLogoTypesStep(props) {

    const classes = useStyles();
    const { step, logos, onComplete, stepNumber, numSteps, onCancel, showExitModal, setShowExitModal } = props;

    const [state, setState] = useState({
        logos: logos
    });

    useEffect(() => {
        setState({ ...state, logos: logos });
    }, [logos]);

    function handleSubmit() {
        onComplete(state.logos);
    }

    function handleChange(logos) {
        setState({ ...state, logos: logos });
    }

    return (
        <>
            {showExitModal &&
                <ConfirmModal
                    onConfirm={handleSubmit}
                    onExit={() => setShowExitModal(false)}
                    title={"Exit " + step.title + "?"}
                    body="If you exit now, your logos will be saved with the current type selections. Are you sure you want to exit?"
                />
            }
            <p>
                We use logo types to help us determine the best ways to use your logo. For each logo, select a logo type of primary, secondary or submark/icon. If your logos are not typed or you are not sure what type to select for a logo, select none.
                <ToolTipsTag iconname="home" tooltiptext="Primary Logo: This logo type is to be used the most for your product line and utilized on the design of the website. The logo is the main graphic that represents your business.<br/>Secondary Logo: This logo type is to be the alternate logo of the primary logo where we need to use a more compact version of the logo. For example, a secondary logo is often either a simplified version of the primary logo or another version that may be in a square composition.<br/>Submark/Icon Logo: This logo type is a simplified,compact mark of the logo. The sub-mark logo is a graphical shape, drawing or icon that represents your business." />
            </p>

            <GridList className={classes.gridList} cellHeight={160}>
                <LogoTypeList
                    logos={state.logos}
                    onChange={(logos) => handleChange(logos)}
                />
            </GridList>
            <DialogActions>
                {
                    stepNumber > 1 &&
                    <Button onClick={() => onCancel(state.logos)}>
                        {`Back to Step ${stepNumber - 1}`}
                    </Button>
                }
                <Button onClick={handleSubmit} color="primary">
                    {stepNumber < numSteps ? `Proceed to Step ${stepNumber + 1}` : "Finish"}
                </Button>
            </DialogActions>
        </>
    );

}
