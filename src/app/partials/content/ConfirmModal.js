import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from "@material-ui/core";

export default function ConfirmModal({ title, body, exitText, confirmText, onExit, onConfirm }) {
    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Dialog
                open={true}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {body}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { handleClose(); onExit && onExit(); }} color="primary">
                        {exitText || "Close"}
                    </Button>
                    <Button onClick={() => { onConfirm && onConfirm(); handleClose(); onExit && onExit(); }} color="primary" autoFocus>
                        {confirmText || "Confirm"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}