import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import {
    ExpansionPanelSummary,
    Typography,
} from "@material-ui/core";

import { useStepStyles } from "../../../../partials/style/OnboardingStyles";
import FinalReviewStep from "../steps/FinalReviewStep";

import * as onboardingDuck from "../../../../store/ducks/onboarding.duck";

function FinalReviewSection(props) {

    const classes = useStepStyles();

    const [expanded, setExpanded] = React.useState(false);
    const [loaded, setLoaded] = React.useState([]);

    const handleChange = panelName => (event, isExpanded) => {
        setExpanded(isExpanded ? panelName : false);
        if (!loaded.includes(panelName)) {
            setLoaded(loaded.concat([panelName]));
        }
    };

    return (
        <>
            <div className={classes.root}>
                <div className="kt-container kt-container--fluid" style={{ padding: "1em" }}>
                    <FinalReviewStep />
                </div>
            </div>
        </>
    );
}

function mapStateToProps(state) {
    return {
        onboarding: state.onboarding
    }
}

export default injectIntl(
    connect(
        mapStateToProps,
        { ...onboardingDuck.actions }
    )(FinalReviewSection)
);