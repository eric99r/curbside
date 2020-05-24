import React, { useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
    ExpansionPanelSummary,
    Typography,
} from "@material-ui/core";
import MarketingImagesGuidelinesStep from "../steps/MarketingImagesGuidelinesStep";
import ContactInfoStep from "../steps/ContactInfoStep";
import VerbiageTaglinesFontsStep from "../steps/VerbiageTaglinesFontsStep";
import SportsTeamsStep from "../steps/SportsTeamsStep";

import { OnboardingStepExpansionPanel } from "../../../../partials/layout/ExpansionPanels";
import { useStepStyles } from "../../../../partials/style/OnboardingStyles";

import { onboardingSections, getOnboardingStatus, onboardingStatus } from "../onboarding.constants";

export default function AccessAndContentSection(props) {

    const classes = useStepStyles();

    const [expanded, setExpanded] = React.useState(false);
    const [loaded, setLoaded] = React.useState([]);

    const handleChange = panelName => (event, isExpanded) => {
        const panelOnboardingStatus = getOnboardingStatus(props.sectionStatuses, panelName);
        if (panelOnboardingStatus != onboardingStatus.LOCKED) {
            setExpanded(isExpanded ? panelName : false);
            if (!loaded.includes(panelName)) {
                setLoaded(loaded.concat([panelName]));
            }
        }
    };

    const { sectionStatuses } = props;
    const section = onboardingSections.ACCESS_AND_CONTENT;

    useEffect(() => {
        console.log("Section status changed", sectionStatuses);
        // Expand next unlocked step.
        var steps = Object.keys(sectionStatuses);
        for (let i = 0; i < steps.length; i++) {
            if (steps[i] !== section.name && getOnboardingStatus(sectionStatuses, steps[i]) === onboardingStatus.UNLOCKED) {
                handleChange(steps[i])(undefined, true);
                break;
            }
        }
    }, [sectionStatuses]);

    return (
        <>
            <div className={classes.root}>
                <div className="kt-container kt-container--fluid" style={{ padding: "1em" }}>

                    <OnboardingStepExpansionPanel
                        step={section.steps.MARKETINGIMAGES}
                        status={getOnboardingStatus(sectionStatuses, section.steps.MARKETINGIMAGES.name)}
                        expanded={expanded}
                        handleChange={handleChange.bind(this)}
                    >
                        { 
                            loaded.includes(section.steps.MARKETINGIMAGES.name) &&
                            <MarketingImagesGuidelinesStep />
                        }
                    </OnboardingStepExpansionPanel>
                    
                    <OnboardingStepExpansionPanel
                        step={section.steps.ContactInfo}
                        status={getOnboardingStatus(sectionStatuses, section.steps.ContactInfo.name)}
                        expanded={expanded}
                        handleChange={handleChange.bind(this)}
                    >
                        { 
                            loaded.includes(section.steps.ContactInfo.name) &&
                            <ContactInfoStep />
                        }
                    </OnboardingStepExpansionPanel>
                </div>
            </div>
        </>
    );
}
