import React, { useState, useEffect } from "react";
import { Radio, RadioGroup, FormControlLabel, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { logoTypes, defaultLogoType } from "../../pages/Component/onboarding/brand.constants";
import ImageThumb from "./ImageThumb";

const useStyles = makeStyles(theme => ({
    group: {
        margin: theme.spacing(1),
    }
}));

export default function LogoTypeListItem(props) {

    const classes = useStyles();

    const { logo, onChange } = props;

    const [state, setState] = useState({
        logoType: logo.logoType || defaultLogoType.value
    });

    useEffect(() => {
        setState({ ...state, logoType: logo.logoType || defaultLogoType.value });
    }, [logo]);

    function handleChange(event, logo) {
        const newLogoType = event.target.value || defaultLogoType.value;
        setState({ ...state, logoType: newLogoType });
        onChange && onChange({ ...logo, logoType: newLogoType });
    }

    return (
        <Grid container wrap="nowrap">
            <Grid item>
                <ImageThumb
                    alt={logo.name}
                    src={logo.imageUrl}
                />
            </Grid>
            <Grid item xs zeroMinWidth>
                <Typography variant="subtitle1" noWrap>{logo.name}</Typography>
                <RadioGroup
                    aria-label=""
                    name="logoType"
                    className={classes.group}
                    onChange={(event) => handleChange(event, logo)}
                    value={state.logoType}
                    row
                >
                    {
                        logoTypes.map(type => <FormControlLabel key={logo.imageUrl + type.value} value={type.value} control={<Radio />} label={type.name} />)
                    }
                </RadioGroup>
            </Grid>
        </Grid>
    );
}