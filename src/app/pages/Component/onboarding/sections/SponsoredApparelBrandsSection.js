import React , { useEffect }  from "react";
import {
    ExpansionPanelSummary,
    Typography,
} from "@material-ui/core";
import { useStepStyles } from "../../../../partials/style/OnboardingStyles";
import { OnboardingStepExpansionPanel } from "../../../../partials/layout/ExpansionPanels";
import { onboardingSections, getOnboardingStatus, onboardingStatus } from "../onboarding.constants";

import SponseredApprealGuidlinesStep from "../steps/SponseredApprealGuidlinesStep";



export default function SponsoredApparelBrandsSection(props) {

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

    const { sectionStatuses } = props;
    const section = onboardingSections.SPONSORED_APPAREL_BRANDS;


    return (
        <>
            <div className={classes.root}>
                <div className="kt-container kt-container--fluid" style={{ padding: "1em" }}>
                <OnboardingStepExpansionPanel
                        step={section.steps.SPONSORED_APPAREL_BRANDS}
                        status={getOnboardingStatus(sectionStatuses, section.steps.SPONSORED_APPAREL_BRANDS.name)}
                        expanded={expanded}
                        handleChange={handleChange.bind(this)}
                    >
                        { 
                            loaded.includes(section.steps.SPONSORED_APPAREL_BRANDS.name) &&
                            <SponseredApprealGuidlinesStep/>
                           
                        }
                    </OnboardingStepExpansionPanel> 
                </div>
            </div>
        </>
    );
}
