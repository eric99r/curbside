import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";

export const useStepStyles = makeStyles(theme => ({
    root: {
        width: "100%"
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: "33.33%",
        flexShrink: 0
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary
    },
    progressContainer: {
        margin: theme.spacing(1, 0)
    },
    progressBar: {
        height: 10
    }
}));