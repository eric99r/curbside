import React, { useState, useEffect } from "react";
import {
    FormControl, FormControlLabel,
    Grid,
    Typography,
    Select, MenuItem,
    Link
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { logoTypes, defaultLogoType } from "../../pages/Component/onboarding/brand.constants";
import ImageThumb from "./ImageThumb";

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        marginLeft: 0,
        display: "flex",
        //minWidth: 120,
    }
}));

export default function LogoListItem(props) {

    const classes = useStyles();

    const { logo, onChange, onRemove } = props;

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

    function handleRemove(logo) {
        onRemove && onRemove(logo);
    }

    return (
        <Grid container>
            <Grid item>
                <ImageThumb
                    alt={logo.name}
                    src={logo.imageUrl}
                />
            </Grid>
            <Grid item xs zeroMinWidth>
                <Typography variant="subtitle1" noWrap>{logo.name}</Typography>
                <FormControl className={classes.formControl}>
                    <Typography variant="subtitle1" noWrap display="inline">Logo Type: </Typography>
                    <Select
                        value={state.logoType}
                        onChange={(event) => handleChange(event, logo)}
                    >
                        {
                            logoTypes.map(type => <MenuItem key={logo.imageUrl + type.value} value={type.value}>{type.name}</MenuItem>)
                        }
                    </Select>
                </FormControl>
                <Link className="kt-link" onClick={() => handleRemove(logo)}>Remove</Link>
            </Grid>
        </Grid >
    );
}