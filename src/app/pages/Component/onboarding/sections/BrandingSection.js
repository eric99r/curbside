import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
    ExpansionPanelSummary,
    Typography,
} from "@material-ui/core";

import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";

import BrandGuidelinesStep from "../steps/BrandGuidelinesStep";
import VerbiageTaglinesFontsStep from "../steps/VerbiageTaglinesFontsStep";
import SportsTeamsStep from "../steps/SportsTeamsStep";
import LogosAndApprovedColorsStep from "../steps/LogosAndApprovedColorsStep";

import { OnboardingStepExpansionPanel } from "../../../../partials/layout/ExpansionPanels";
import { useStepStyles } from "../../../../partials/style/OnboardingStyles";

import { onboardingSections, getOnboardingStatus, onboardingStatus, getFirstUnlockedSectionOrStep } from "../onboarding.constants";

import * as onboardingDuck from "../../../../store/ducks/onboarding.duck";

function BrandingSection(props) {

    const classes = useStepStyles();
    const { onboarding } = props;

    const [expanded, setExpanded] = useState(false);
    const [loaded, setLoaded] = useState([]);

    const handleChange = panelName => (event, isExpanded) => {
        const panelOnboardingStatus = getOnboardingStatus(onboarding.statuses, panelName);
        if (panelOnboardingStatus !== onboardingStatus.LOCKED
            && ((panelName !== expanded) || panelName === expanded && isExpanded === false))  {
            // Clear message for currently expanded panel.
            if (typeof expanded === "string" 
                && expanded 
                && expanded in sectionStatuses 
                && getOnboardingStatus(onboarding.messages, expanded)) {
                props.setStepMessage(expanded, "");
            }
            setExpanded(isExpanded ? panelName : false);
            if (!loaded.includes(panelName)) {
                setLoaded(loaded.concat([panelName]));
            }
        }
    };


    const section = onboardingSections.BRANDING;
    const sectionStatuses = onboarding.statuses[section.name];
    const sectionMessages = onboarding.messages[section.name];

    useEffect(() => {
        console.log("Branding section status changed", sectionStatuses);
        // Expand next unlocked step.
        const unlockedStep = getFirstUnlockedSectionOrStep(sectionStatuses, section.name);
        handleChange(unlockedStep)(undefined, true);

    }, [onboarding.statuses[section.name].lastUpdated]);

    return (
        <>
            <div className={classes.root}>
                <div className="kt-container kt-container--fluid" style={{ padding: "1em" }}>

                    <OnboardingStepExpansionPanel
                        step={section.steps.BRAND_GUIDELINES}
                        status={getOnboardingStatus(sectionStatuses, section.steps.BRAND_GUIDELINES.name)}
                        message={getOnboardingStatus(sectionMessages, section.steps.BRAND_GUIDELINES.name)}
                        expanded={expanded}
                        handleChange={handleChange.bind(this)}
                    >
                        {
                            loaded.includes(section.steps.BRAND_GUIDELINES.name) &&
                            <BrandGuidelinesStep />
                        }
                    </OnboardingStepExpansionPanel>

                    <OnboardingStepExpansionPanel
                        step={section.steps.VERBIAGE_TAGLINES_AND_FONTS}
                        status={getOnboardingStatus(sectionStatuses, section.steps.VERBIAGE_TAGLINES_AND_FONTS.name)}
                        message={getOnboardingStatus(sectionMessages, section.steps.VERBIAGE_TAGLINES_AND_FONTS.name)}
                        expanded={expanded}
                        handleChange={handleChange}
                    >
                        {
                            loaded.includes(section.steps.VERBIAGE_TAGLINES_AND_FONTS.name) &&
                            <VerbiageTaglinesFontsStep />
                        }
                    </OnboardingStepExpansionPanel>

                    <OnboardingStepExpansionPanel
                        step={section.steps.SPORTS_TEAMS}
                        status={getOnboardingStatus(sectionStatuses, section.steps.SPORTS_TEAMS.name)}
                        message={getOnboardingStatus(sectionMessages, section.steps.SPORTS_TEAMS.name)}
                        expanded={expanded}
                        handleChange={handleChange}
                    >
                        {
                            loaded.includes(section.steps.SPORTS_TEAMS.name) &&
                            <SportsTeamsStep />
                        }
                    </OnboardingStepExpansionPanel>

                    <OnboardingStepExpansionPanel
                        step={section.steps.LOGOS_AND_APPROVED_COLORS}
                        status={getOnboardingStatus(sectionStatuses, section.steps.LOGOS_AND_APPROVED_COLORS.name)}
                        message={getOnboardingStatus(sectionMessages, section.steps.LOGOS_AND_APPROVED_COLORS.name)}
                        expanded={expanded}
                        handleChange={handleChange}
                    >
                        {
                            loaded.includes(section.steps.LOGOS_AND_APPROVED_COLORS.name) &&
                            <LogosAndApprovedColorsStep />
                        }
                    </OnboardingStepExpansionPanel>

                </div>
            </div>
        </>
    );
}

function mapStateToProps(state) {
    return {
        onboarding: state.onboarding,
    }
}

export default injectIntl(
    connect(
        mapStateToProps,
        onboardingDuck.actions
    )(BrandingSection)
);
