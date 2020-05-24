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
import * as brandApi from '../../../../crud/brands.crud';
import * as filesApi from '../../../../crud/files.crud';
import * as onboarding from '../../../../store/ducks/onboarding.duck';
import { onboardingSections, onboardingStatus } from '../onboarding.constants';
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

function ProductAndCatalogGuidelineStep(props) {

    const { intl } = props;
    const classes = useStyles();

    const step = onboardingSections.CATALOG_AND_PRODUCTS.steps.CATALOG_AND_PRODUCTS;

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

    return (
        <div className="kt-section">
            <div className="kt-section__content">
                <div className={classes.root}>
                  
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
    )(ProductAndCatalogGuidelineStep)
);