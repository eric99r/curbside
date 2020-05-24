import React, { useRef, useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
    ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary,
    Typography, Box
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useStepStyles } from "../style/OnboardingStyles";

import { getOnboardingStatus, onboardingStatus, getStatusIcon } from "../../pages/Component/onboarding/onboarding.constants"
import StatusBubble from "../content/StatusBubble";

export const ExpansionPanelDetailsNP = withStyles(theme => ({
    root: {
        padding: theme.spacing(0)
    }
}))(ExpansionPanelDetails);

export const InnerExpansionPanel = withStyles(theme => ({
    root: {
        heading: {
            width: "100%",
            overflow: "auto"
        },
        //backgroundColor: "rgba(240, 240, 240, 1)",
        //border: "3px solid rgba(.1, 0, 0, .125)",
        boxShadow: "none",
        "&:not(:last-child)": {
            borderBottom: 0
        },
        "&:before": {
            display: "none"
        },
        "&$expanded": {
            margin: "auto"
        },
        padding: theme.spacing(1)
    },
    expanded: {}
}))(ExpansionPanel);


export function OnboardingStepExpansionPanel(props) {

    const classes = useStepStyles();
    const { step, status, handleChange, expanded, children, message } = props;

    const containerRef = useRef();
    useEffect(() => {
        if (expanded === step.name) {
            containerRef.current.focus();
        }
    }, [expanded]);

    return status !== onboardingStatus.DISABLED && (
        <InnerExpansionPanel
            tabIndex={-1}
            ref={containerRef}
            square
            expanded={expanded === step.name}
            onChange={handleChange(step.name)}
            disabled={status === onboardingStatus.DISABLED}
        >
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${step.name}-content`}
                id={`${step.name}-header`}
            >
                <Typography className={classes.heading} style={{ whiteSpace: "nowrap"}}>
                    {getStatusIcon(status)}
                    {status === onboardingStatus.UNLOCKED ? <b>{step.label}</b> : step.label}
                </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetailsNP>
                <div className="kt-container kt-container--fluid">
                    <StatusBubble 
                        status={(message && message.content) || ""}
                        type={(message && message.type) || ""}
                        error={Boolean(message && message.type === "error")}
                    />
                    {children}
                </div>
            </ExpansionPanelDetailsNP>
        </InnerExpansionPanel>

    );
}

export function OnboardingSectionExpansionPanel(props) {

    const classes = useStepStyles();

    const { section, sectionStatuses, handleChange, expanded, children, message } = props;
    const status = getOnboardingStatus(sectionStatuses, section.name);

    const containerRef = useRef();
    useEffect(() => {
        if (expanded === section.name) {
            containerRef.current.focus();
        }
    }, [expanded]);

    return status !== onboardingStatus.DISABLED && (
        <ExpansionPanel
            tabIndex={-1}
            ref={containerRef}
            expanded={expanded === section.name}
            onChange={handleChange(section.name)}
            disabled={status === onboardingStatus.DISABLED}
        >
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${section.name}-content`}
                id={`${section.name}-header`}
            >
                <Typography className={classes.heading} style={{ whiteSpace: "nowrap"}}>
                    {getStatusIcon(status)} 
                    {status === onboardingStatus.UNLOCKED ? <b>{section.label}</b> : section.label}
                </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetailsNP>
                <div className="kt-container kt-container--fluid">
                    <StatusBubble 
                        status={(message && message.content) || ""}
                        type={(message && message.type) || ""}
                        error={Boolean(message && message.type === "error")}
                    />
                    {children}
                </div>
            </ExpansionPanelDetailsNP>
        </ExpansionPanel>
    );
}