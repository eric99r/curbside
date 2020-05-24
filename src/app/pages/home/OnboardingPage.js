import React, { useState, useEffect } from "react";

import * as organizationDuck from "../../store/ducks/organization.duck";
import * as onboardingDuck from "../../store/ducks/onboarding.duck";

import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import {
    CircularProgress, LinearProgress, Grid
} from "@material-ui/core";

import { useStepStyles } from "../../partials/style/OnboardingStyles";
import { OnboardingSectionExpansionPanel } from "../../partials/layout/ExpansionPanels";
import StatusBubble from "../../partials/content/StatusBubble";

import OrganizationSection from "../Component/onboarding/sections/OrganizationSection";
import BrandingSection from "../Component/onboarding/sections/BrandingSection";
import ProductAndCatalogSection from "../Component/onboarding/sections/ProductAndCatalogSection";
import AccessAndContentSection from "../Component/onboarding/sections/AccessAndContentSection";
import FinalReviewSection from "../Component/onboarding/sections/FinalReviewSection";

import { onboardingSections, getOnboardingStatus, onboardingStatus, getFirstUnlockedSectionOrStep, getFirstSectionOrStepWithMessage, allStatusesAreComplete } from "../Component/onboarding/onboarding.constants";

function OnboardingPage(props) {

    const { auth, onboarding } = props;

    const [expanded, setExpanded] = useState(false);
    const [loadedPanels, setLoadedPanels] = useState([]);
    const [progressCompleted, setProgressCompleted] = useState(0);

    const classes = useStepStyles();

    // Load organization.
    useEffect(() => {
        console.log("Onboarding page init", props);
        if (auth.userData) {
            props.loadOnboardingStatusesForOrganization(auth.userData.account);
        }
    }, []);

    useEffect(() => {
        console.log("Onboarding page onboarding statuses changed", props);
        let completed = 0;
        let count = 0;
        let sections = Object.keys(onboarding.statuses);
        for (let i = 0; i < sections.length; i++) {
            let steps = Object.keys(onboarding.statuses[sections[i]]);
            let sectionStatus = getOnboardingStatus(onboarding.statuses, sections[i]);
            if (sectionStatus !== onboardingStatus.DISABLED) {
                // Section doesn't have any steps -- section is the step.
                if (steps && steps.length === 1 && steps[0] === sections[i] && sectionStatus === onboardingStatus.COMPLETE) {
                    count++;
                    completed++;
                }
                for (let j = 0; j < steps.length; j++) {
                    if (sections[i] !== steps[j]) {
                        let stepStatus = getOnboardingStatus(onboarding.statuses, steps[j]);
                        if (stepStatus !== onboardingStatus.DISABLED) {
                            count++;
                            if (stepStatus === onboardingStatus.COMPLETE) {
                                completed++;
                            }
                        }
                    }
                }
            }
        }
        // Set progress bar percentage.
        let progressPercent = (completed / count) * 100.0;
        setProgressCompleted(progressPercent);

        const stepWithMessage = getFirstSectionOrStepWithMessage(onboarding.messages, "", true);
        // Expand next unlocked step.
        const stepToExpand = (stepWithMessage || getFirstUnlockedSectionOrStep(onboarding.statuses));
        handleChange(stepToExpand)(undefined, true);

    }, [onboarding.statuses.lastUpdated]);

    const handleChange = panelName => (event, isExpanded) => {
        const panelOnboardingStatus = getOnboardingStatus(onboarding.statuses, panelName);
        if (panelOnboardingStatus !== onboardingStatus.LOCKED
            && ((panelName !== expanded) || panelName === expanded && isExpanded === false)) {
            // Clear message for currently expanded panel.
            if (typeof expanded === "string"
                && expanded
                && onboarding
                && expanded in onboarding.statuses
                && getOnboardingStatus(onboarding.messages, expanded)) {
                props.setStepMessage(expanded, "");
            }
            setExpanded(isExpanded ? panelName : false);
            if (!loadedPanels.includes(panelName)) {
                setLoadedPanels(loadedPanels.concat([panelName]));
            }
        }
    };

    // Render loading when required data is not met.
    if (!(onboarding && onboarding.statuses)) {
        return (<CircularProgress />);
    }
    return (
        <div className="row">
            <div className="col-md-12">
                <div className="kt-section">
                    <Grid container alignItems="center" className={classes.progressContainer}>
                        <Grid item xs={11}>
                            <LinearProgress className={classes.progressBar} variant="determinate" value={progressCompleted} />
                        </Grid>
                        <Grid item xs={1} style={{ textAlign: "center" }}>
                            <div style={{ topMargin: "-1em" }}>{Math.floor(progressCompleted)}%</div>
                        </Grid>
                    </Grid>
                    <div className="kt-section__content">
                        <StatusBubble>
                            {
                                getOnboardingStatus(onboarding.statuses, onboardingSections.FINAL_REVIEW.name) === onboardingStatus.COMPLETE && 
                                <>
                                    <p>
                                        Thank you! You've successfully completed onboarding. Your program manager has been notified and will be in touch regarding next steps.
                                    </p>
                                    <p>
                                        If you need to edit any of your information, you can do so by expanding the desired section below. Please note that changes to certain items may have an impact on the time required to finish setting up your store. Your program manager will be notified of any updated information and will inform you should there be any impact to your scheduled launch date.
                                    </p>
                                </>
                            }
                        </StatusBubble>
                        <div className={classes.root}>
                            <OnboardingSectionExpansionPanel
                                section={onboardingSections.ORGANIZATION}
                                sectionStatuses={onboarding.statuses[onboardingSections.ORGANIZATION.name]}
                                message={getOnboardingStatus(onboarding.messages, onboardingSections.ORGANIZATION.name)}
                                expanded={expanded}
                                handleChange={handleChange.bind(this)}
                            >
                                <OrganizationSection />
                            </OnboardingSectionExpansionPanel>

                            <OnboardingSectionExpansionPanel
                                section={onboardingSections.BRANDING}
                                sectionStatuses={onboarding.statuses[onboardingSections.BRANDING.name]}
                                message={getOnboardingStatus(onboarding.messages, onboardingSections.BRANDING.name)}
                                expanded={expanded}
                                handleChange={handleChange.bind(this)}
                            >
                                <BrandingSection />
                            </OnboardingSectionExpansionPanel>

                            <OnboardingSectionExpansionPanel
                                section={onboardingSections.CATALOG_AND_PRODUCTS}
                                sectionStatuses={onboarding.statuses[onboardingSections.CATALOG_AND_PRODUCTS.name]}
                                message={getOnboardingStatus(onboarding.messages, onboardingSections.CATALOG_AND_PRODUCTS.name)}
                                expanded={expanded}
                                handleChange={handleChange.bind(this)}
                            >
                                <ProductAndCatalogSection
                                    sectionStatuses={{ ...onboarding.statuses[onboardingSections.CATALOG_AND_PRODUCTS.name] }}
                                />
                            </OnboardingSectionExpansionPanel>


                            <OnboardingSectionExpansionPanel
                                section={onboardingSections.GROUPS}
                                sectionStatuses={onboarding.statuses[onboardingSections.GROUPS.name]}
                                message={getOnboardingStatus(onboarding.messages, onboardingSections.GROUPS.name)}
                                expanded={expanded}
                                handleChange={handleChange.bind(this)}
                            >
                                Groups
                            </OnboardingSectionExpansionPanel>

                            <OnboardingSectionExpansionPanel
                                section={onboardingSections.LICENSING_AND_ROYALTIES}
                                sectionStatuses={onboarding.statuses[onboardingSections.LICENSING_AND_ROYALTIES.name]}
                                message={getOnboardingStatus(onboarding.messages, onboardingSections.LICENSING_AND_ROYALTIES.name)}
                                expanded={expanded}
                                handleChange={handleChange.bind(this)}
                            >
                                Licensing & Royalties
                            </OnboardingSectionExpansionPanel>

                            <OnboardingSectionExpansionPanel
                                section={onboardingSections.BILLING}
                                sectionStatuses={onboarding.statuses[onboardingSections.BILLING.name]}
                                message={getOnboardingStatus(onboarding.messages, onboardingSections.BILLING.name)}
                                expanded={expanded}
                                handleChange={handleChange.bind(this)}
                            >
                                Billing
                            </OnboardingSectionExpansionPanel>

                            <OnboardingSectionExpansionPanel
                                section={onboardingSections.CHECKOUT_OPTIONS}
                                sectionStatuses={onboarding.statuses[onboardingSections.CHECKOUT_OPTIONS.name]}
                                message={getOnboardingStatus(onboarding.messages, onboardingSections.CHECKOUT_OPTIONS.name)}
                                expanded={expanded}
                                handleChange={handleChange.bind(this)}
                            >
                                Checkout Options
                            </OnboardingSectionExpansionPanel>

                            <OnboardingSectionExpansionPanel
                                section={onboardingSections.APPROVALS_AND_ORDER_PROCESSING}
                                sectionStatuses={onboarding.statuses[onboardingSections.APPROVALS_AND_ORDER_PROCESSING.name]}
                                message={getOnboardingStatus(onboarding.messages, onboardingSections.APPROVALS_AND_ORDER_PROCESSING.name)}
                                expanded={expanded}
                                handleChange={handleChange.bind(this)}
                            >
                                Approvals & Order Processing
                            </OnboardingSectionExpansionPanel>

                            <OnboardingSectionExpansionPanel
                                section={onboardingSections.ACCESS_AND_CONTENT}
                                sectionStatuses={onboarding.statuses[onboardingSections.ACCESS_AND_CONTENT.name]}
                                message={getOnboardingStatus(onboarding.messages, onboardingSections.ACCESS_AND_CONTENT.name)}
                                expanded={expanded}
                                handleChange={handleChange.bind(this)}
                            >
                                <AccessAndContentSection
                                    sectionStatuses={{ ...onboarding.statuses[onboardingSections.ACCESS_AND_CONTENT.name] }}
                                />
                            </OnboardingSectionExpansionPanel>

                            <OnboardingSectionExpansionPanel
                                section={onboardingSections.FINAL_REVIEW}
                                sectionStatuses={onboarding.statuses[onboardingSections.FINAL_REVIEW.name]}
                                message={getOnboardingStatus(onboarding.messages, onboardingSections.FINAL_REVIEW.name)}
                                expanded={expanded}
                                handleChange={handleChange.bind(this)}
                            >
                                <FinalReviewSection />
                            </OnboardingSectionExpansionPanel>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

function mapStateToProps(state) {
    return {
        onboarding: state.onboarding,
        organization: state.organization.organization,
        auth: state.auth.user
    }
}

export default injectIntl(
    connect(
        mapStateToProps,
        { ...organizationDuck.actions, ...onboardingDuck.actions }
    )(OnboardingPage)
);