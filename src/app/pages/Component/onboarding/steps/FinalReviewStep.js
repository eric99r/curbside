import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormHelperText, FormControlLabel, FormControl, FormLabel,
  Button,
  Typography,
  CircularProgress
} from '@material-ui/core';
import { Formik, Field } from "formik";
//import Autocomplete from "react-autocomplete";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { onboardingSections, onboardingStatus, getOnboardingStatus } from '../onboarding.constants';

import ToolTipsTag from '../../../../partials/content/ToolTipsTag';

import * as onboardingDuck from '../../../../store/ducks/onboarding.duck';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  formControl: {
    margin: theme.spacing(1),
    display: "flex",
    minWidth: 120
  },
  textField: {
    minWidth: 240
  },
  paper: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    //width: "100%"
  },
  gridItem: {
    width: "100%"
  }
}));

function FinalReviewStep(props) {

  const step = onboardingSections.FINAL_REVIEW;
  const { intl, auth, onboarding } = props;

  const classes = useStyles();

  function completeStep() {
    props.completeStep(step.name);
  }

  return (
    <div className="kt-section">
      <div className="kt-section__content">
        <div className={classes.root}>
          <p>
            Please take a few moments to review the information you've provided. While you can continue to make edits to your onboarding information once submitted, changes to certain items may have an impact on the time required to finish setting up your store.
          </p>
          <p>
            Once complete, select Finish Onboarding to complete the onboarding process.
          </p>
          <div className="form-group" style={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                completeStep();
              }}
            >
              Complete Onboarding
            </Button>
          </div>
        </div>
      </div>
    </div>

  )

}

function mapStateToProps(state) {
  return {
    auth: state.auth.user,
    onboarding: state.onboarding
  }
}

export default injectIntl(
  connect(
    mapStateToProps,
    { ...onboardingDuck.actions }
  )(FinalReviewStep)
);