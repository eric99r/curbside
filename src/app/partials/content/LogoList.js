import React, { useState } from "react";
import { GridList, Grid } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import LogoListItem from "./LogoListItem";
import ConfirmModal from "./ConfirmModal";

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        display: "flex",
        minWidth: 120
    },
    gridList: {
        width: "100%",
        maxHeight: 350,
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    }
}));

export default function LogoList(props) {

    const classes = useStyles();
    const { logos, onChange, onRemove } = props;
    const [state, setState] = useState({
        showConfirmModal: false,
        confirmModalBody: "",
        confirmModalLogo: undefined
    })

    function handleChange(logo) {
        onChange && onChange(logo);
    }

    function handleRemove(logo) {
        setState({ 
            ...state, 
            showConfirmModal: true, 
            confirmModalBody: `Are you sure you want to remove ${logo.name}?`, 
            confirmModalLogo: logo
        });
    }

    function confirmRemove(logo) {
        onRemove && onRemove(logo);
    }

    return (
        <>
            <GridList className={classes.gridList} cellHeight={160}>
                {
                    logos.map(logo => (
                        <Grid item xs={6} key={logo.imageUrl}>
                            <LogoListItem
                                logo={logo}
                                onChange={handleChange}
                                onRemove={handleRemove}
                            />
                        </Grid>
                    ))
                }
            </GridList>
            {
                state.showConfirmModal &&
                <ConfirmModal
                    title="Remove Logo?"
                    body={state.confirmModalBody}
                    onConfirm={() => {confirmRemove(state.confirmModalLogo);} }
                    onExit={() => { setState({ ...state, showConfirmModal: false }); }}
                />
            }
        </>
    );
}