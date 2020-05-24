import React from "react";
import {
    ExpansionPanelSummary,
    Typography,
} from "@material-ui/core";

import { useStepStyles } from "../../../../partials/style/OnboardingStyles";
import OrganizationStep from "../steps/OrganizationStep";

export default function OrganizationSection(props) {

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
                    <OrganizationStep />
                </div>
            </div>
        </>
    );
}
